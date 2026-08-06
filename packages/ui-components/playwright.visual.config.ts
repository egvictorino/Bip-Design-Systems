import { defineConfig, devices } from '@playwright/test';

/**
 * Regresión visual del sistema de temas — separado de `test` (vitest) porque
 * necesita un navegador real renderizando Storybook, no happy-dom. Preferido
 * sobre @storybook/test-runner por peso: solo nos interesa la matriz de
 * temas, no una corrida de accesibilidad/interacción por story.
 */
export default defineConfig({
  testDir: './visual',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  webServer: {
    command: 'pnpm storybook -- --ci --quiet',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://localhost:6006',
    viewport: { width: 960, height: 720 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
