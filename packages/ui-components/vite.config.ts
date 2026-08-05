import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { preserveDirectives } from 'rollup-plugin-preserve-directives';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['**/*.test.tsx', '**/*.test.ts'],
      entryRoot: 'src',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'clsx'],
      // preserveDirectives keeps "use client" (source files, §src/components/*)
      // in each emitted chunk — with preserveModules:true, esbuild/Rollup
      // strip it by default, which silently breaks any consumer that renders
      // one of these components directly from a React Server Component.
      plugins: [preserveDirectives()],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'style[extname]',
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
