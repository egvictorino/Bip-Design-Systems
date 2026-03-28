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
    css: {
      modules: {
        // Use plain local names in tests (e.g. styles.primary → "primary")
        // so test assertions can reference CSS module class keys instead of hashed names.
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
