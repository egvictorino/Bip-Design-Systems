import { render, screen, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme, useColorScheme, useThemeAttributes } from './ThemeProvider';

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
    expect(result.current).toEqual({ 'data-theme': 'square', 'data-color-scheme': 'dark' });
  });

  it('useThemeAttributes falls back to square/light without an ancestor provider', () => {
    const { result } = renderHook(() => useThemeAttributes());
    expect(result.current).toEqual({ 'data-theme': 'square', 'data-color-scheme': 'light' });
  });
});
