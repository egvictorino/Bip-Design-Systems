import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { LocaleContext, useBipLocale, mergeLocale } from './LocaleContext';
import { esMX } from './es-MX';
import { enUS } from './en-US';

describe('useBipLocale', () => {
  it('falls back to esMX outside a LocaleContext.Provider', () => {
    const { result } = renderHook(() => useBipLocale());
    expect(result.current).toBe(esMX);
  });

  it('reads the value from an ancestor LocaleContext.Provider', () => {
    const { result } = renderHook(() => useBipLocale(), {
      wrapper: ({ children }) =>
        createElement(LocaleContext.Provider, { value: enUS }, children),
    });
    expect(result.current).toBe(enUS);
  });
});

describe('mergeLocale', () => {
  it('returns base unchanged when no override is given', () => {
    expect(mergeLocale(esMX, undefined)).toBe(esMX);
  });

  it('merges a nested partial override onto base, keeping sibling keys', () => {
    const merged = mergeLocale(esMX, { alert: { close: 'Dismiss' } });
    expect(merged.alert.close).toBe('Dismiss');
    expect(merged.modal.close).toBe(esMX.modal.close);
  });

  it('replaces non-plain-object values (e.g. the locale tag string) directly', () => {
    const merged = mergeLocale(esMX, { locale: 'en-US' } as Partial<typeof esMX>);
    expect(merged.locale).toBe('en-US');
  });

  it('applying a full locale dictionary as override reproduces it key by key', () => {
    const merged = mergeLocale(esMX, enUS);
    expect(merged.alert.close).toBe(enUS.alert.close);
    expect(merged.calendar.dayNames).toEqual(enUS.calendar.dayNames);
  });
});
