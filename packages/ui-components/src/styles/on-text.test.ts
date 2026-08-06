import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SRC_DIR = resolve(__dirname, '..');

/**
 * Módulos donde --color-txt-white es intencional (fondo fijo, no una semilla
 * de marca overrideable) — ver el comentario en el propio archivo:
 * - Sidebar.module.css .variantDark: --color-surface-4 es un neutro fijo.
 * - Spinner.module.css: variante .white explícita, no un fill de estado.
 * - Avatar.module.css .initials (default): fallback para variantes bg* que
 *   no son semillas de marca (bgSecondary/bgSlate/-text) — las que sí lo son
 *   (bgPrimary/bgDanger/bgViolet) ya sobrescriben con --color-txt-on-*.
 * - foundations/Foundations.module.css .themingSnippet: panel de código con
 *   fondo --color-surface-4 (neutro fijo, no una semilla), mismo patrón.
 */
const ALLOWLIST = new Set([
  'components/Sidebar/Sidebar.module.css',
  'components/Spinner/Spinner.module.css',
  'components/Avatar/Avatar.module.css',
  'foundations/Foundations.module.css',
]);

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

describe('--color-txt-white no se usa fuera del allowlist justificado', () => {
  it('todo componente nuevo que pinte texto sobre un fill de marca debe usar --color-txt-on-*, no --color-txt-white', () => {
    const offenders = findModuleCssFiles(SRC_DIR)
      .map((path) => ({ path, relPath: relative(SRC_DIR, path).replace(/\\/g, '/') }))
      .filter(({ relPath }) => !ALLOWLIST.has(relPath))
      .filter(({ path }) => readFileSync(path, 'utf-8').includes('--color-txt-white'));

    expect(offenders.map((o) => o.relPath)).toEqual([]);
  });
});
