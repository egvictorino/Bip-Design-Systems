import { readdirSync } from 'fs';
import { resolve } from 'path';
import { test, expect } from '@playwright/test';
import { COMPONENT_MATRIX, SKIP_LIST } from './component-matrix';

/**
 * Un screenshot canónico por componente — acotado a #storybook-root (no fullPage, como
 * theme-matrix.spec.ts) para que el archivo sea chico y el diff sea del componente, no del
 * canvas completo. `animations: 'disabled'` porque casi todo componente tiene una transición
 * en --duration-* (ver primitives.css) y sin esto los shots son inestables entre corridas.
 */
test.describe('component matrix — un screenshot por componente (LTR + subset RTL)', () => {
  for (const { dir, storyId, rtl } of COMPONENT_MATRIX) {
    test(`${dir} — LTR`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${dir}.png`, {
        animations: 'disabled',
      });
    });

    if (rtl) {
      test(`${dir} — RTL`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${storyId}&viewMode=story&globals=dir:rtl`);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#storybook-root')).toHaveScreenshot(`${dir}-rtl.png`, {
          animations: 'disabled',
        });
      });
    }
  }
});

/**
 * Guard de cobertura — mismo patrón que el de src/a11y.test.tsx (readdirSync sobre
 * src/components), pero como test() de Playwright: vitest no sirve acá, su config excluye
 * la carpeta visual/ por completo (ver el exclude en vitest.config.ts) porque ese runner y
 * el de Playwright no pueden convivir en la misma pasada.
 */
test('cobertura: todo directorio en src/components tiene entrada en COMPONENT_MATRIX o SKIP_LIST', () => {
  const componentsDir = resolve(__dirname, '../src/components');
  const dirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const covered = new Set([...COMPONENT_MATRIX.map((e) => e.dir), ...SKIP_LIST]);
  const missing = dirs.filter((dir) => !covered.has(dir));

  expect(missing, `Componentes sin cobertura visual: ${missing.join(', ')}`).toEqual([]);
});
