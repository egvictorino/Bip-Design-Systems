import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { describe, it, expect } from 'vitest';
import { BREAKPOINTS } from './breakpoints';

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

const VALID_PX_VALUES = new Set(Object.values(BREAKPOINTS).map((n) => `${n}px`));

/**
 * `@media` cuyo umbral no está en la escala BREAKPOINTS, documentado con el comentario
 * al lado en el propio archivo — mismo patrón que OUTLIER_VALUES en spacing.test.ts.
 * - foundations/Foundations.module.css: colapso de un grid de 2 columnas en la página de
 *   docs de Theming (no es un componente publicado), afinado a 900px para ese layout
 *   concreto en vez de reutilizar `lg` (1024px), que colapsaría demasiado tarde.
 */
const OUTLIER_ALLOWLIST = new Set(['foundations/Foundations.module.css']);

const MEDIA_WIDTH_RE = /@media\s*\([^)]*(?:min|max)-width:\s*([\d.]+px)[^)]*\)/g;

describe('@media (min|max-width) usa la escala BREAKPOINTS, no literales', () => {
  it('todo breakpoint es uno de sm/md/lg/xl o un outlier documentado en OUTLIER_ALLOWLIST', () => {
    const offenders = findModuleCssFiles(SRC_DIR)
      .map((path) => ({ path, relPath: relative(SRC_DIR, path).replace(/\\/g, '/') }))
      .filter(({ relPath }) => !OUTLIER_ALLOWLIST.has(relPath))
      .map(({ path, relPath }) => {
        const css = readFileSync(path, 'utf-8');
        const offending = [...css.matchAll(MEDIA_WIDTH_RE)]
          .map((m) => m[1])
          .filter((px) => !VALID_PX_VALUES.has(px));
        return { relPath, offending };
      })
      .filter(({ offending }) => offending.length > 0);

    expect(offenders).toEqual([]);
  });
});
