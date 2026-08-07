import { createContext, useContext } from 'react';
import { esMX } from './es-MX';
import type { BipLocale, PartialBipLocale } from './types';

export const LocaleContext = createContext<BipLocale | null>(null);

/**
 * No error-guard-on-null here unlike the compound-component context pattern: rendering a
 * component outside a <ThemeProvider> is legitimate (see ThemeProvider's own "works without a
 * provider" default), so this falls back to `esMX` instead of throwing.
 */
export function useBipLocale(): BipLocale {
  return useContext(LocaleContext) ?? esMX;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** One level of recursion is enough — BipLocale is exactly two levels deep (section → key). */
export function mergeLocale(base: BipLocale, override?: PartialBipLocale): BipLocale {
  if (!override) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override) as (keyof BipLocale)[]) {
    const overrideValue = override[key];
    const baseValue = base[key];
    result[key] =
      isPlainObject(overrideValue) && isPlainObject(baseValue)
        ? { ...baseValue, ...overrideValue }
        : overrideValue;
  }
  return result as unknown as BipLocale;
}
