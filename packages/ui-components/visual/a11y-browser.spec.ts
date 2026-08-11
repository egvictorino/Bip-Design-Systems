import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { COMPONENT_MATRIX } from './component-matrix';

/**
 * a11y.test.tsx (vitest + happy-dom + jest-axe) corre con color-contrast DESACTIVADO —
 * getComputedStyle() no resuelve color-mix()/custom properties con fidelidad de navegador
 * real ahí (ver el comentario de AXE_OPTIONS en ese archivo). Esta suite es lo que cierra
 * ese hueco: mismo motor axe-core, pero en un Chromium real vía @axe-core/playwright, con
 * la config de reglas POR DEFECTO — es decir, color-contrast SÍ activado. Es la única
 * verificación de este repo que evalúa el contraste tal como se renderiza de verdad,
 * incluidos los tokens derivados con color-mix() que ni contrast-tokens.test.ts (solo
 * hex literales) ni el resto de la suite de a11y pueden evaluar.
 *
 * Reusa COMPONENT_MATRIX (la fuente única también de component-matrix.spec.ts) en vez de
 * mantener una segunda lista de componentes que se puede desincronizar de la primera.
 * Corre en ambos esquemas de color — no solo light — porque los tokens derivados cambian
 * de fórmula (aclaran hacia white en dark en vez de oscurecer hacia black) y es donde más
 * probable es que un contraste marginal falle.
 *
 * `Calendar`'s story renders with `date: new Date()` — see the same fixed-time note in
 * component-matrix.spec.ts. Frozen here too so a date-dependent render (which fixture EVENTS
 * fall in the visible week, which cell is "today") can't flip an axe result day to day.
 */
const FROZEN_TIME = new Date('2026-01-15T09:00:00');

test.describe('a11y — axe en navegador real, color-contrast activado', () => {
  for (const { dir, storyId } of COMPONENT_MATRIX) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`${dir} — ${colorScheme}`, async ({ page }) => {
        if (dir === 'Calendar') await page.clock.setFixedTime(FROZEN_TIME);
        await page.goto(`/iframe.html?id=${storyId}&viewMode=story&globals=colorScheme:${colorScheme}`);
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page }).include('#storybook-root').analyze();

        expect(
          results.violations,
          results.violations
            .map((v) => `[${v.id}] ${v.help} (${v.nodes.length} nodo(s))\n${v.helpUrl}`)
            .join('\n\n')
        ).toEqual([]);
      });
    }
  }
});
