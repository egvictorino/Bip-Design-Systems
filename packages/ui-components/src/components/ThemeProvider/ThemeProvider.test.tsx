import { render, screen, renderHook, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useThemeAttributes,
  useThemeControls,
  getThemeInitScript,
  resolveTokenVars,
} from './ThemeProvider';

/** happy-dom no implementa matchMedia — se simula un SO en light por defecto. */
const mockMatchMedia = (matchesDark: boolean) => {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches: matchesDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
  };
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;
  return {
    fireChange: (matches: boolean) => {
      mql.matches = matches;
      listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
    },
  };
};

describe('ThemeProvider', () => {
  it('stamps data-theme and data-color-scheme on its wrapper', () => {
    render(
      <ThemeProvider theme="rounded" colorScheme="dark">
        <span data-testid="child">contenido</span>
      </ThemeProvider>
    );
    const wrapper = screen.getByTestId('child').parentElement;
    expect(wrapper).toHaveAttribute('data-theme', 'rounded');
    expect(wrapper).toHaveAttribute('data-color-scheme', 'dark');
  });

  it('defaults colorScheme to light when omitted', () => {
    render(
      <ThemeProvider theme="square">
        <span data-testid="child">contenido</span>
      </ThemeProvider>
    );
    const wrapper = screen.getByTestId('child').parentElement;
    expect(wrapper).toHaveAttribute('data-color-scheme', 'light');
  });

  it('useTheme returns "square" without an ancestor provider', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('square');
  });

  it('useColorScheme returns "light" without an ancestor provider', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('useTheme/useColorScheme read the nearest provider values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme="rounded" colorScheme="dark">
        {children}
      </ThemeProvider>
    );
    const { result: themeResult } = renderHook(() => useTheme(), { wrapper });
    const { result: colorSchemeResult } = renderHook(() => useColorScheme(), { wrapper });
    expect(themeResult.current).toBe('rounded');
    expect(colorSchemeResult.current).toBe('dark');
  });

  it('useThemeAttributes returns both data-* attributes for portalled content', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider theme="square" colorScheme="dark">
        {children}
      </ThemeProvider>
    );
    const { result } = renderHook(() => useThemeAttributes(), { wrapper });
    expect(result.current['data-theme']).toBe('square');
    expect(result.current['data-color-scheme']).toBe('dark');
    expect(result.current.style).toMatchObject({ color: 'var(--color-txt)' });
  });

  it('useThemeAttributes falls back to square/light without an ancestor provider', () => {
    const { result } = renderHook(() => useThemeAttributes());
    expect(result.current['data-theme']).toBe('square');
    expect(result.current['data-color-scheme']).toBe('light');
    expect(result.current.style).toMatchObject({ color: 'var(--color-txt)' });
  });

  describe('tokens prop — eje de marca', () => {
    it('applies a flat override as an inline CSS var on the wrapper', () => {
      render(
        <ThemeProvider theme="square" tokens={{ colorPrimary: '#e2007a' }}>
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--color-primary')).toBe('#e2007a');
    });

    it('scheme-specific override wins over the flat override for the active scheme', () => {
      render(
        <ThemeProvider
          theme="square"
          colorScheme="dark"
          tokens={{ colorPrimary: '#e2007a', dark: { colorPrimary: '#00c2a8' } }}
        >
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--color-primary')).toBe('#00c2a8');
    });

    it('cssVars escape hatch wins over tokens', () => {
      render(
        <ThemeProvider
          theme="square"
          tokens={{ colorPrimary: '#e2007a' }}
          cssVars={{ '--color-primary': '#111111' }}
        >
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--color-primary')).toBe('#111111');
    });

    it('nested providers merge — child only overrides what it declares', () => {
      render(
        <ThemeProvider theme="square" tokens={{ colorPrimary: '#e2007a', colorDanger: '#ff0000' }}>
          <ThemeProvider theme="square" tokens={{ colorPrimary: '#00c2a8' }}>
            <span data-testid="child">contenido</span>
          </ThemeProvider>
        </ThemeProvider>
      );
      const inner = screen.getByTestId('child').parentElement as HTMLElement;
      expect(inner.style.getPropertyValue('--color-primary')).toBe('#00c2a8');
      expect(inner.style.getPropertyValue('--color-danger')).toBe('#ff0000');
    });

    it('resolveTokenVars merges base -> scoped -> cssVars', () => {
      const vars = resolveTokenVars(
        { colorPrimary: '#111', dark: { colorPrimary: '#222' } },
        'dark',
        { '--color-danger': '#333' }
      );
      expect(vars).toEqual({
        '--color-primary': '#222',
        '--color-txt-on-primary': '#ffffff',
        '--color-danger': '#333',
      });
    });

    it('overriding a fill seed also derives --color-txt-on-* via pickReadableText', () => {
      const vars = resolveTokenVars({ colorWarning: '#eab308' }, 'light', undefined);
      expect(vars['--color-warning']).toBe('#eab308');
      expect(vars['--color-txt-on-warning']).toBe('#191919');
    });

    it('an explicit cssVars override for --color-txt-on-* wins over the computed value', () => {
      const vars = resolveTokenVars({ colorPrimary: '#eab308' }, 'light', {
        '--color-txt-on-primary': '#ff00ff',
      });
      expect(vars['--color-txt-on-primary']).toBe('#ff00ff');
    });

    it('fontFamily maps to --font-sans', () => {
      render(
        <ThemeProvider theme="square" tokens={{ fontFamily: 'Poppins, sans-serif' }}>
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--font-sans')).toBe('Poppins, sans-serif');
    });
  });

  describe('radius prop — overrides de los tokens semánticos de radius', () => {
    it('applies each radius key to its semantic CSS var', () => {
      render(
        <ThemeProvider theme="square" radius={{ field: '12px', container: '24px' }}>
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--radius-field')).toBe('12px');
      expect(wrapper.style.getPropertyValue('--radius-container')).toBe('24px');
    });

    it('cssVars wins over radius when both target the same custom property', () => {
      render(
        <ThemeProvider
          theme="square"
          radius={{ field: '12px' }}
          cssVars={{ '--radius-field': '999px' }}
        >
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement as HTMLElement;
      expect(wrapper.style.getPropertyValue('--radius-field')).toBe('999px');
    });
  });

  describe('modo no-controlado + system + persistencia', () => {
    beforeEach(() => {
      window.localStorage.clear();
      mockMatchMedia(false);
    });

    it('theme/colorScheme son no-controlados por defecto (defaultTheme/defaultColorScheme)', () => {
      render(
        <ThemeProvider defaultTheme="rounded" defaultColorScheme="dark">
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement;
      expect(wrapper).toHaveAttribute('data-theme', 'rounded');
      expect(wrapper).toHaveAttribute('data-color-scheme', 'dark');
    });

    it("colorScheme='system' resuelve a light/dark y nunca estampa 'system' en el DOM", () => {
      mockMatchMedia(true);
      render(
        <ThemeProvider theme="square" colorScheme="system">
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      const wrapper = screen.getByTestId('child').parentElement;
      expect(wrapper).toHaveAttribute('data-color-scheme', 'dark');
    });

    it('system sigue los cambios en vivo de prefers-color-scheme', async () => {
      const { fireChange } = mockMatchMedia(false);
      render(
        <ThemeProvider theme="square" colorScheme="system">
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      expect(screen.getByTestId('child').parentElement).toHaveAttribute(
        'data-color-scheme',
        'light'
      );

      act(() => fireChange(true));

      await waitFor(() =>
        expect(screen.getByTestId('child').parentElement).toHaveAttribute(
          'data-color-scheme',
          'dark'
        )
      );
    });

    it('useThemeControls expone setTheme/setColorScheme/toggleColorScheme y actualiza el DOM', async () => {
      const user = userEvent.setup();
      const Toggle = () => {
        const { resolvedColorScheme, toggleColorScheme } = useThemeControls();
        return (
          <button onClick={toggleColorScheme}>{resolvedColorScheme === 'dark' ? '🌙' : '☀️'}</button>
        );
      };
      render(
        <ThemeProvider theme="square" defaultColorScheme="light">
          <Toggle />
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      expect(screen.getByTestId('child').parentElement).toHaveAttribute(
        'data-color-scheme',
        'light'
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByTestId('child').parentElement).toHaveAttribute(
        'data-color-scheme',
        'dark'
      );
    });

    it('un colorScheme controlado gana sobre el estado interno — setColorScheme no lo mueve', async () => {
      const user = userEvent.setup();
      const Toggle = () => {
        const { toggleColorScheme } = useThemeControls();
        return <button onClick={toggleColorScheme}>toggle</button>;
      };
      render(
        <ThemeProvider theme="square" colorScheme="light">
          <Toggle />
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByTestId('child').parentElement).toHaveAttribute(
        'data-color-scheme',
        'light'
      );
    });

    it('useThemeControls es no-op sin ancestro (no lanza, no hace nada)', () => {
      const { result } = renderHook(() => useThemeControls());
      expect(result.current.resolvedColorScheme).toBe('light');
      expect(() => result.current.setTheme('rounded')).not.toThrow();
      expect(() => result.current.toggleColorScheme()).not.toThrow();
    });

    it('con storageKey, persiste en localStorage al cambiar y rehidrata al montar', async () => {
      const user = userEvent.setup();
      const Toggle = () => {
        const { toggleColorScheme } = useThemeControls();
        return <button onClick={toggleColorScheme}>toggle</button>;
      };
      const { unmount } = render(
        <ThemeProvider theme="square" defaultColorScheme="light" storageKey="bip-theme-test">
          <Toggle />
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() =>
        expect(JSON.parse(window.localStorage.getItem('bip-theme-test')!)).toMatchObject({
          colorScheme: 'dark',
        })
      );
      unmount();

      render(
        <ThemeProvider theme="square" defaultColorScheme="light" storageKey="bip-theme-test">
          <span data-testid="child2">contenido</span>
        </ThemeProvider>
      );

      await waitFor(() =>
        expect(screen.getByTestId('child2').parentElement).toHaveAttribute(
          'data-color-scheme',
          'dark'
        )
      );
    });

    it('storageKey no pisa un colorScheme controlado', async () => {
      window.localStorage.setItem(
        'bip-theme-controlled',
        JSON.stringify({ colorScheme: 'dark' })
      );
      render(
        <ThemeProvider theme="square" colorScheme="light" storageKey="bip-theme-controlled">
          <span data-testid="child">contenido</span>
        </ThemeProvider>
      );
      await waitFor(() =>
        expect(screen.getByTestId('child').parentElement).toHaveAttribute(
          'data-color-scheme',
          'light'
        )
      );
    });
  });

  describe('getThemeInitScript', () => {
    it('incluye los defaults y, sin storageKey, no referencia localStorage', () => {
      const script = getThemeInitScript({ defaultTheme: 'rounded', defaultColorScheme: 'dark' });
      expect(script).toContain(`d.setAttribute('data-theme',t)`);
      expect(script).toContain('"rounded"');
      expect(script).toContain('"dark"');
      expect(script).not.toContain('localStorage');
    });

    it('con storageKey, lee localStorage antes de estampar los atributos', () => {
      const script = getThemeInitScript({ storageKey: 'bip-theme' });
      expect(script).toContain('localStorage.getItem("bip-theme")');
    });

    it('resuelve system a light/dark vía matchMedia, nunca lo deja en el atributo', () => {
      const script = getThemeInitScript({ defaultColorScheme: 'system' });
      expect(script).toContain("if(c==='system')");
      expect(script).toContain('matchMedia');
    });

    it('es ejecutable como IIFE sin lanzar (smoke test)', () => {
      const script = getThemeInitScript({ storageKey: 'bip-theme-exec' });
      expect(() => {
        // eslint-disable-next-line no-new-func
        new Function(script)();
      }).not.toThrow();
      expect(document.documentElement).toHaveAttribute('data-theme');
      expect(document.documentElement).toHaveAttribute('data-color-scheme');
    });
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-color-scheme');
  });
});
