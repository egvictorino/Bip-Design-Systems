import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

/** happy-dom no implementa matchMedia — mismo mock que ThemeProvider.test.tsx. */
const mockMatchMedia = (matches: boolean) => {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: '(min-width: 768px)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
  };
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;
  return {
    fireChange: (newMatches: boolean) => {
      mql.matches = newMatches;
      listeners.forEach((cb) => cb({ matches: newMatches } as MediaQueryListEvent));
    },
  };
};

describe('useMediaQuery', () => {
  it('returns the initial matchMedia result', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates live when the query match changes', () => {
    const { fireChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);

    act(() => fireChange(true));
    expect(result.current).toBe(true);
  });

  it('is false when matchMedia is unavailable (SSR-safe default)', () => {
    const original = window.matchMedia;
    // @ts-expect-error simulating an environment without matchMedia
    window.matchMedia = undefined;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    window.matchMedia = original;
  });
});
