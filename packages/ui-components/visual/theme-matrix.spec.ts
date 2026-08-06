import { test, expect } from '@playwright/test';

/**
 * Regresión visual del sistema de temas — ver README § Theming.
 * Baselines commiteadas en visual/theme-matrix.spec.ts-snapshots/. Para
 * actualizar tras un cambio deliberado de tokens.css/ThemeProvider:
 *   pnpm test:visual -- --update-snapshots
 */
test.describe('theme matrix', () => {
  test('square/rounded × light/dark — las 4 combinaciones en un solo grid', async ({ page }) => {
    await page.goto('/iframe.html?id=components-themeprovider--color-schemes&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('color-schemes-matrix.png', { fullPage: true });
  });

  test('marca personalizada — override de colorPrimary/colorDanger recolorea Button/Badge/Tabs/Alert/Modal', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=components-themeprovider--custom-brand&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('custom-brand.png', { fullPage: true });
  });

  test('Foundations/Colors — semillas y derivados resueltos, light y dark en paralelo', async ({ page }) => {
    await page.goto('/iframe.html?id=foundations-colors--overview&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('foundations-colors.png', { fullPage: true });
  });

  test('Foundations/Radius — square y rounded en paralelo', async ({ page }) => {
    await page.goto('/iframe.html?id=foundations-radius--overview&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('foundations-radius.png', { fullPage: true });
  });

  test('SideBySide — square y rounded renderizados uno junto al otro', async ({ page }) => {
    await page.goto('/iframe.html?id=components-themeprovider--side-by-side&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('side-by-side.png', { fullPage: true });
  });

  test('PortalTheming — Modal via createPortal hereda el tema del provider (no el de document.body)', async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=components-themeprovider--portal-theming&viewMode=story');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Abrir modal (rounded)' }).click();
    await expect(page.getByText('Modal en tema rounded')).toBeVisible();
    await expect(page).toHaveScreenshot('portal-theming.png', { fullPage: true });
  });

  test("SystemColorScheme — colorScheme='system' resuelve a light/dark sin estampar 'system'", async ({
    page,
  }) => {
    await page.goto('/iframe.html?id=components-themeprovider--system-color-scheme&viewMode=story');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('system-color-scheme.png', { fullPage: true });
  });
});
