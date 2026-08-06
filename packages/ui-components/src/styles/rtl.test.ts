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

/**
 * Archivos con propiedades físicas (left/right/margin-left/etc.) documentadas a
 * propósito, no accidentales — cada uno tiene el comentario justificativo en el propio
 * .module.css:
 * - DrawerPanel: `placement` es un prop físico explícito ('left'|'right') — pedir el
 *   lado derecho de la pantalla no debe depender de `dir`.
 * - Toast: `position` (topLeft/topRight/...) es el mismo tipo de elección física.
 * - Tooltip: `position` ('top'|'bottom'|'left'|'right') es física por la misma razón;
 *   `align` ('start'|'center'|'end'), en el mismo archivo, sí es lógica y ya usa
 *   inset-inline-start/end — la excepción cubre solo los bloques .left/.right ligados
 *   a `position`, no todo el archivo por igual (ver el comentario en el propio CSS).
 * - ProgressBar: la animación indeterminada es puramente decorativa, sin significado
 *   direccional — translateX físico a propósito, sin --rtl-x.
 */
const PHYSICAL_BY_DESIGN_ALLOWLIST = new Set([
  'components/DrawerPanel/DrawerPanel.module.css',
  'components/Toast/Toast.module.css',
  'components/Tooltip/Tooltip.module.css',
  'components/ProgressBar/ProgressBar.module.css',
]);

const PHYSICAL_PROP_RE =
  /\b(margin-left|margin-right|padding-left|padding-right|border-left(-\w+)?|border-right(-\w+)?|left|right)\s*:/g;
const TEXT_ALIGN_RE = /text-align\s*:\s*(left|right)\s*;/g;

describe('propiedades lógicas para RTL en lugar de físicas fuera del allowlist justificado', () => {
  it('margin/padding/border-left|right y text-align: left|right no aparecen fuera de PHYSICAL_BY_DESIGN_ALLOWLIST', () => {
    const offenders = findModuleCssFiles(SRC_DIR)
      .map((path) => ({ path, relPath: relative(SRC_DIR, path).replace(/\\/g, '/') }))
      .filter(({ relPath }) => !PHYSICAL_BY_DESIGN_ALLOWLIST.has(relPath))
      .filter(({ path }) => {
        const css = readFileSync(path, 'utf-8');
        return [...css.matchAll(PHYSICAL_PROP_RE)].length > 0 || [...css.matchAll(TEXT_ALIGN_RE)].length > 0;
      });

    expect(offenders.map((o) => o.relPath)).toEqual([]);
  });
});
