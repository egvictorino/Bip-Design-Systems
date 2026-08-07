import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const COMPONENTS_DIR = resolve(__dirname, '../components');

/**
 * Mismo patrón que rtl.test.ts/on-text.test.ts/spacing.test.ts: un componente nuevo con un
 * string en español quemado en aria-label/placeholder/title, o en un nodo de texto JSX, debe
 * pasar por el diccionario de i18n (useBipLocale()) — no directo en el JSX. Esta allowlist es
 * para los casos legítimos donde eso no aplica.
 */
const ALLOWLIST = new Set<string>([
  // (vacío por ahora — agregar aquí + comentario si aparece un caso legítimo)
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

// Literal (no interpolado) aria-label="...", placeholder="...", o title="..." con al menos
// una letra — una versión dinámica (aria-label={...}) no matchea esto.
const HARDCODED_ATTR = /\b(?:aria-label|placeholder|title)="[^"]*[a-zA-Z][^"]*"/;

// Nodo de texto JSX (entre `>` y `<`, sin `{` de por medio) que contiene un caracter propio
// del español — acentos o ¿¡. Evaluado línea por línea (no contra el archivo completo) para
// que `[^<{]*` no "salte" a través de saltos de línea y termine matcheando genéricos de
// TypeScript (`Record<...>`, `useState<...>`) que envuelven texto acentuado más abajo en el
// archivo. No es infalible (un nombre propio con tilde en un comentario podría matchear) pero
// es la misma heurística de spot-check que ya usa el resto de los guard tests de este repo.
const SPANISH_TEXT_NODE = />[^<{]*[áéíóúñÁÉÍÓÚÑ¿¡][^<{]*</;

const hasHardcodedSpanish = (content: string): boolean => {
  if (HARDCODED_ATTR.test(content)) return true;
  return content
    .split('\n')
    .some((line) => !line.trim().startsWith('//') && !line.trim().startsWith('*') && SPANISH_TEXT_NODE.test(line));
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
