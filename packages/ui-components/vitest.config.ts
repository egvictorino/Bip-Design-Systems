import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // visual/ es la suite de regresión visual de Playwright (theme-matrix.spec.ts),
    // no vitest — sin este exclude, el glob *.spec.ts por defecto la recoge y
    // choca con el runner de @playwright/test.
    exclude: ['**/node_modules/**', '**/visual/**'],
    css: {
      modules: {
        // Use plain local names in tests (e.g. styles.primary → "primary")
        // so test assertions can reference CSS module class keys instead of hashed names.
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/test-setup.ts',
        'src/vite-env.d.ts',
        'src/**/*.d.ts',
      ],
      // Umbral fijado en el nivel actual (ver CHANGELOG) para que no baje — no es un número
      // aspiracional: súbelo cuando la cobertura real suba, no lo bajes para pasar el build.
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 88,
        lines: 90,
      },
    },
  },
});
