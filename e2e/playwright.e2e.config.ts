import { defineConfig, devices } from '@playwright/test';

/**
 * Verifies the PUBLISHED package, not the workspace source — the class of bug this guards
 * against already happened once (see the hotfix/design-tokens-not-bundled branch in git
 * history). scripts/e2e-consumer.sh builds ui-components, `pnpm pack`s it into a real
 * tarball, installs that tarball (not a workspace link) into e2e/consumer-app, builds THAT
 * with Vite, and serves the static output here. No webServer block: the script owns startup/
 * teardown of `vite preview` because it also has to run the tarball build in between.
 */
export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
