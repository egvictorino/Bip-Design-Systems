"use client";

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

/**
 * Live-tracks a `matchMedia` query via `useSyncExternalStore` — same mechanism
 * `ThemeProvider` uses internally for `colorScheme="system"`.
 *
 * SSR-safe: `getServerSnapshot` returns `false` and only subscribes to `matchMedia` on
 * the client, so this never throws when rendered from a Server Component.
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = useCallback(
    () => typeof window !== 'undefined' && window.matchMedia?.(query).matches === true,
    [query]
  );

  const subscribe = useCallback(
    (callback: () => void): (() => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
