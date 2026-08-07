import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins multiple string classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, '', 'c')).toBe('a c');
  });

  it('flattens conditional object syntax', () => {
    expect(cn({ a: true, b: false, c: true })).toBe('a c');
  });

  it('returns an empty string for no truthy input', () => {
    expect(cn(false, undefined, null)).toBe('');
  });
});
