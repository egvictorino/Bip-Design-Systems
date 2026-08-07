import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SRC_DIR = resolve(__dirname, '..');

const findModuleCssFiles = (dir: string): string[] => {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...findModuleCssFiles(fullPath));
    } else if (entry.endsWith('.module.css')) {
      files.push(fullPath);
    }
  }
  return files;
};

const PROP_ALTERNATION =
  '(padding-top|padding-right|padding-bottom|padding-left|padding|' +
  'margin-top|margin-right|margin-bottom|margin-left|margin|' +
  'row-gap|column-gap|gap)';
const DECL_RE = new RegExp(`\\b${PROP_ALTERNATION}\\s*:\\s*([^;]+);`, 'g');

/**
 * Valores fuera de la grilla --space-* documentados en el propio .module.css con un
 * comentario explicando por qué (ajuste óptico puntual o suma de dos tokens ya
 * existentes) — ver primitives.css § Spacing. No es una lista de "excepciones
 * silenciosas": cada entrada tiene su comentario justificativo al lado en el CSS.
 */
const OUTLIER_VALUES = new Set(['13px', '11px', '5px', '1.375rem']);

// calc(var(--space-x) * -1) es la forma estándar de negar un token — no un literal.
const CALC_NEGATION_RE = /calc\(\s*var\(--space-[\w-]+\)\s*\*\s*-1\s*\)/g;

const findOffendingDeclarations = (css: string): string[] => {
  const offenders: string[] = [];
  for (const match of css.matchAll(DECL_RE)) {
    const [, prop, rawValue] = match;
    const value = rawValue.replace(CALC_NEGATION_RE, '0');
    const tokens = value.trim().split(/\s+/);
    for (const tok of tokens) {
      if (!/^-?[\d.]/.test(tok)) continue; // no numérico (auto, var(...), etc.)
      if (tok === '0') continue; // 0 sin unidad no necesita token
      if (OUTLIER_VALUES.has(tok)) continue;
      offenders.push(`${prop}: ${rawValue.trim()};`);
      break;
    }
  }
  return offenders;
};

describe('padding/margin/gap usan la escala --space-*, no literales', () => {
  it('todo valor de longitud en padding/margin/gap es var(--space-*), calc() sobre un --space-*, o un outlier documentado en OUTLIER_VALUES', () => {
    const offenders = findModuleCssFiles(SRC_DIR)
      .map((path) => ({ path, relPath: relative(SRC_DIR, path).replace(/\\/g, '/') }))
      .map(({ path, relPath }) => ({
        relPath,
        declarations: findOffendingDeclarations(readFileSync(path, 'utf-8')),
      }))
      .filter(({ declarations }) => declarations.length > 0);

    expect(offenders).toEqual([]);
  });
});
