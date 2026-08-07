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
  // Reintenta una vez en CI antes de reportar fallo — absorbe el flake ocasional de
  // fuentes/fonts todavía cargando en el primer paint sin esconder una regresión real
  // (maxDiffPixelRatio ya filtra el ruido de sub-píxel; esto es para timing, no pixeles).
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  webServer: {
    // Sin el separador `--` explícito: `pnpm storybook -- --ci --quiet` reenviaba un `--`
    // literal al CLI de Storybook (`storybook dev -p 6006 -- --ci --quiet`), que el parser
    // más laxo de Storybook 8 toleraba pero el de 9+ rechaza ("too many arguments for 'dev'.
    // Expected 0 arguments but got 2") — trata todo lo posterior al `--` como argumentos
    // posicionales en vez de flags. `pnpm storybook --ci --quiet` reenvía los flags tal cual.
    command: 'pnpm storybook --ci --quiet',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://localhost:6006',
  },
  // El viewport vive aquí (no en el `use` de arriba) porque `...devices['Desktop Chrome']`
  // trae su propio viewport (1280×720) y un `use.viewport` a nivel de config pierde contra
  // el `use` del project — quedaba declarado pero sin efecto. Se fija explícito para que
  // sea el valor real, no un accidente de precedencia.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
  ],
});
