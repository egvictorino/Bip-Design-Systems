import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const COMPONENTS_DIR = resolve(__dirname, '../components');

/**
 * Mismo patrón que rtl.test.ts/on-text.test.ts/spacing.test.ts: un componente nuevo con un
 * string en español quemado en aria-label/placeholder/title, en un nodo de texto JSX, o en
 * un literal de string dentro de una expresión (ternarios, `??`, template literals), debe
 * pasar por el diccionario de i18n (useBipLocale()) — no directo en el JSX. Esta allowlist es
 * para los casos legítimos donde eso no aplica.
 */
const ALLOWLIST = new Set<string>([
  // console.warn de contraste WCAG en dev (resolveTokenVars() en ThemeProvider.tsx) — mensaje
  // de consola para quien integra la librería, no texto de UI renderizado; no pasa por el
  // diccionario de i18n a propósito, igual que el resto de mensajes de desarrollo del repo.
  'ThemeProvider/ThemeProvider.tsx',
]);

const findComponentFiles = (dir: string): string[] => {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...findComponentFiles(fullPath));
    } else if (
      entry.endsWith('.tsx') &&
      !entry.endsWith('.test.tsx') &&
      !entry.endsWith('.stories.tsx')
    ) {
      files.push(fullPath);
    }
  }
  return files;
};

// Acentos/¿¡ son una señal inequívoca. El resto es una lista corta de palabras/stopwords en
// español que aparecen constantemente en texto quemado de este repo (verbos de botones, y
// conectores que casi nunca aparecen como palabra exacta en inglés) — no es un diccionario
// completo, es la misma heurística de spot-check que ya usa el resto de los guard tests.
const SPANISH_HINTS =
  /\b(que|hay|más|mas|para|una|uno|del|con|sin|está|estás|guardar|cancelar|agregar|columnas|limpiar|eliminar|seleccionar|buscar|cargando|anterior|siguiente|cerrar|mostrar|registros|archivo|imagen|imágenes|diente|dientes|nota|notas|arrastra|suelta|formatos)\b/i;

const looksSpanish = (text: string): boolean =>
  /[áéíóúñÁÉÍÓÚÑ¿¡]/.test(text) || SPANISH_HINTS.test(text);

// Literal (no interpolado) aria-label="...", placeholder="...", o title="..." con al menos
// una letra — una versión dinámica (aria-label={...}) no matchea esto (ese caso lo cubre el
// escaneo genérico de literales de abajo).
const HARDCODED_ATTR = /\b(?:aria-label|placeholder|title)="[^"]*[a-zA-Z][^"]*"/;

// Nodo de texto JSX (entre `>` y `<`, sin `{` de por medio tras stripInterpolations) que
// contiene un caracter propio del español o una de las stopwords de arriba. Evaluado línea
// por línea (no contra el archivo completo) para que `[^<]*` no "salte" a través de saltos de
// línea y termine matcheando genéricos de TypeScript (`Record<...>`, `useState<...>`) que
// envuelven texto más abajo en el archivo.
const JSX_TEXT_NODE = />([^<]*)</;

// Un literal de string ('...', "...", `...`) en cualquier parte del archivo — cubre casos
// donde el texto en español vive dentro de una expresión JS (`{children ?? '...'}`,
// ternarios, etc.) en vez de directo en un atributo o nodo de texto JSX.
const STRING_LITERAL = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`/g;

const stripComments = (content: string): string =>
  content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');

// Quita interpolaciones simples (`{count}`, `{overflow}`) de una línea antes de evaluar el
// nodo de texto JSX que la envuelve — así `+{overflow} más` no queda oculto detrás del `{`
// que antes cortaba el match en seco.
const stripInterpolations = (line: string): string => line.replace(/\{[^{}]*\}/g, '');

const hasHardcodedSpanish = (content: string): boolean => {
  if (HARDCODED_ATTR.test(content)) return true;

  const withoutComments = stripComments(content);
  for (const match of withoutComments.matchAll(STRING_LITERAL)) {
    const literal = match[1] ?? match[2] ?? match[3] ?? '';
    if (literal.trim() && looksSpanish(literal)) return true;
  }

  return content.split('\n').some((rawLine) => {
    const line = rawLine.trim();
    if (line.startsWith('//') || line.startsWith('*')) return false;
    const textNode = JSX_TEXT_NODE.exec(stripInterpolations(line));
    return textNode ? looksSpanish(textNode[1]) : false;
  });
};

describe('sin strings en español quemados en componentes (deben venir de useBipLocale())', () => {
  it('todo componente nuevo con aria-label/placeholder/title/texto en español debe usar el diccionario de i18n', () => {
    const offenders = findComponentFiles(COMPONENTS_DIR)
      .map((path) => ({ path, relPath: relative(COMPONENTS_DIR, path).replace(/\\/g, '/') }))
      .filter(({ relPath }) => !ALLOWLIST.has(relPath))
      .filter(({ path }) => hasHardcodedSpanish(readFileSync(path, 'utf-8')));

    expect(offenders.map((o) => o.relPath)).toEqual([]);
  });
});
