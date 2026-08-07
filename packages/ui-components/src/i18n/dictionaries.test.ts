import { describe, it, expect } from 'vitest';
import { esMX } from './es-MX';
import { enUS } from './en-US';
import type { BipLocale } from './types';

/**
 * BipLocale carries ~30 interpolation functions (pagination.page, odontogram.selectTooth,
 * etc.) that most component tests never exercise directly since they render with the es-MX
 * default and rarely hit every dynamic label. This walks every function-valued entry in both
 * shipped dictionaries and calls it, so a typo that breaks interpolation (or an unused branch
 * in en-US specifically) fails a test instead of only showing up in the Foundations/I18n
 * Storybook playground.
 */
function callEveryFunction(locale: BipLocale, path = ''): void {
  for (const [key, value] of Object.entries(locale as unknown as Record<string, unknown>)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === 'function') {
      const result = (value as (...args: unknown[]) => unknown)('Sample', 3, true, 'Extra');
      expect(typeof result, `${currentPath} should return a string`).toBe('string');
      expect((result as string).length, `${currentPath} should return a non-empty string`).toBeGreaterThan(0);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      callEveryFunction(value as unknown as BipLocale, currentPath);
    }
  }
}

describe('esMX dictionary', () => {
  it('every interpolation function returns a non-empty string', () => {
    callEveryFunction(esMX);
  });
});

describe('enUS dictionary', () => {
  it('every interpolation function returns a non-empty string', () => {
    callEveryFunction(enUS);
  });

  it('matches the shape of esMX (same section/key set)', () => {
    expect(Object.keys(enUS).sort()).toEqual(Object.keys(esMX).sort());
  });
});
