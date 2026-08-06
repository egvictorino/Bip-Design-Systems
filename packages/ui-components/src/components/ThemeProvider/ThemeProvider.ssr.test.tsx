// @vitest-environment node
//
// happy-dom (the default environment for this suite, see vitest.config.ts) still provides a
// `window`, so it can't exercise ThemeProvider's actual SSR path — renderToString() running
// where `window`/`matchMedia` are genuinely undefined, which is what getSystemColorScheme()
// and useSyncExternalStore's getServerSnapshot (ThemeProvider.tsx:195-209) guard against.
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, getThemeInitScript } from './ThemeProvider';

describe('ThemeProvider — SSR (Node, sin window)', () => {
  it('renderToString no lanza sin window/matchMedia', () => {
    expect(() =>
      renderToString(
        <ThemeProvider defaultTheme="rounded" defaultColorScheme="dark">
          <span>contenido</span>
        </ThemeProvider>
      )
    ).not.toThrow();
  });

  it('estampa data-theme/data-color-scheme en el markup del servidor', () => {
    const html = renderToString(
      <ThemeProvider defaultTheme="rounded" defaultColorScheme="dark">
        <span>contenido</span>
      </ThemeProvider>
    );
    expect(html).toContain('data-theme="rounded"');
    expect(html).toContain('data-color-scheme="dark"');
  });

  it("colorScheme='system' resuelve al getServerSnapshot ('light') sin acceder a matchMedia", () => {
    const html = renderToString(
      <ThemeProvider theme="square" colorScheme="system">
        <span>contenido</span>
      </ThemeProvider>
    );
    // Nunca 'system' en el markup — y en el servidor, sin matchMedia, cae al snapshot fijo.
    expect(html).not.toContain('data-color-scheme="system"');
    expect(html).toContain('data-color-scheme="light"');
  });

  it('getThemeInitScript() devuelve un IIFE parseable sin acceso a window/localStorage', () => {
    const script = getThemeInitScript({ storageKey: 'bip-theme', defaultColorScheme: 'system' });
    expect(() => new Function(script)).not.toThrow();
    expect(script.startsWith('(function(){try{')).toBe(true);
  });
});
