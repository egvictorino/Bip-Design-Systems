import { describe, it, expect } from 'vitest';
import { contrastRatio, pickReadableText } from './contrast';

describe('contrastRatio', () => {
  it('black vs white is the maximum ratio (21:1)', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('identical colors have a ratio of 1', () => {
    expect(contrastRatio('#2939cc', '#2939cc')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#2939cc', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#2939cc'), 10);
  });
});

describe('pickReadableText', () => {
  it('picks white for saturated dark fills (current --color-primary)', () => {
    expect(pickReadableText('#2939cc')).toBe('#ffffff');
  });

  it('picks dark text for light/bright fills (a warning yellow)', () => {
    expect(pickReadableText('#eab308')).toBe('#191919');
  });

  it('picks white for pure black', () => {
    expect(pickReadableText('#000000')).toBe('#ffffff');
  });

  it('picks dark text for pure white', () => {
    expect(pickReadableText('#ffffff')).toBe('#191919');
  });

  it('supports 3-digit hex shorthand', () => {
    expect(pickReadableText('#000')).toBe('#ffffff');
    expect(pickReadableText('#fff')).toBe('#191919');
  });

  it('never throws on an unparseable value — degrades to dark text', () => {
    expect(() => pickReadableText('not-a-color')).not.toThrow();
    expect(pickReadableText('not-a-color')).toBe('#191919');
  });

  it('the chosen color always meets or exceeds the alternative on the same fill', () => {
    const fills = ['#5468e8', '#ff5a5f', '#4ade80', '#fbbf24', '#6b7cff', '#c877ff'];
    for (const fill of fills) {
      const chosen = pickReadableText(fill);
      const other = chosen === '#ffffff' ? '#191919' : '#ffffff';
      expect(contrastRatio(fill, chosen)).toBeGreaterThanOrEqual(contrastRatio(fill, other));
    }
  });
});
