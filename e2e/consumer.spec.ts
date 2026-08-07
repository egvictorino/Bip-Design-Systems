import { test, expect } from '@playwright/test';

test.describe('published package smoke test', () => {
  test('renders, resolves ESM cleanly, and applies real token/theme styles', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/');

    const squareButton = page.getByTestId('button-square');
    const roundedButton = page.getByTestId('button-rounded');
    await expect(squareButton).toBeVisible();
    await expect(roundedButton).toBeVisible();

    // No "require is not defined" / module-resolution errors — proves the ESM-only
    // package (no "require" export condition, see package.json `exports`) resolved
    // cleanly through Vite's build, not just that *something* rendered.
    expect(consoleErrors).toEqual([]);

    // dist/style.css actually applied — --color-primary (light, square theme) is #2939cc.
    // If style.css hadn't been imported/bundled, this would read a browser default instead.
    const bg = await squareButton.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(41, 57, 204)');

    // The theme axis survives packaging: Button uses --radius-field, which differs
    // between square (1px) and rounded (8px) per styles/themes.css — proves
    // ThemeProvider's data-theme stamping + tokens.css cascade both made it into the
    // published build, not just the raw color tokens checked above.
    const squareRadius = await squareButton.evaluate((el) => getComputedStyle(el).borderRadius);
    const roundedRadius = await roundedButton.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(squareRadius).toBe('1px');
    expect(roundedRadius).toBe('8px');
    expect(squareRadius).not.toBe(roundedRadius);
  });
});
