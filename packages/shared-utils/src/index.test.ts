import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, validateRFC } from './index';

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  it('formats a positive amount', () => {
    expect(formatCurrency(1500)).toBe(fmt(1500));
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe(fmt(0));
  });

  it('formats a negative amount', () => {
    expect(formatCurrency(-500)).toBe(fmt(-500));
  });

  it('formats large amounts with thousands separator', () => {
    expect(formatCurrency(1_000_000)).toBe(fmt(1_000_000));
  });

  it('formats decimal amounts', () => {
    expect(formatCurrency(99.99)).toBe(fmt(99.99));
  });
});

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  const fmt = (d: Date) => new Intl.DateTimeFormat('es-MX').format(d);

  it('formats a mid-year date', () => {
    const date = new Date(2026, 5, 15); // June 15 2026
    expect(formatDate(date)).toBe(fmt(date));
  });

  it('formats the first day of the year', () => {
    const date = new Date(2026, 0, 1);
    expect(formatDate(date)).toBe(fmt(date));
  });

  it('formats the last day of the year', () => {
    const date = new Date(2026, 11, 31);
    expect(formatDate(date)).toBe(fmt(date));
  });

  it('formats a leap day', () => {
    const date = new Date(2024, 1, 29); // Feb 29 2024 (leap year)
    expect(formatDate(date)).toBe(fmt(date));
  });
});

// ─── validateRFC ─────────────────────────────────────────────────────────────

describe('validateRFC', () => {
  describe('valid RFCs', () => {
    it('accepts a valid RFC for persona moral (3 letters)', () => {
      expect(validateRFC('ABC800101AA1')).toBe(true);
    });

    it('accepts a valid RFC for persona física (4 letters)', () => {
      expect(validateRFC('GOVE800101AA1')).toBe(true);
    });

    it('accepts RFC with Ñ in name part', () => {
      expect(validateRFC('GOÑE800101AA1')).toBe(true);
    });

    it('accepts RFC with & in name part', () => {
      expect(validateRFC('GO&E800101AA1')).toBe(true);
    });

    it('accepts RFC with digits in homoclave', () => {
      expect(validateRFC('ABC8001011A2')).toBe(true);
    });
  });

  describe('invalid RFCs', () => {
    it('rejects an empty string', () => {
      expect(validateRFC('')).toBe(false);
    });

    it('rejects lowercase letters', () => {
      expect(validateRFC('abc800101AA1')).toBe(false);
    });

    it('rejects RFC that is too short', () => {
      expect(validateRFC('ABC8001')).toBe(false);
    });

    it('rejects RFC that is too long', () => {
      expect(validateRFC('ABCDE800101AA1')).toBe(false);
    });

    it('rejects RFC with letters in the date segment', () => {
      expect(validateRFC('ABCX00101AA1')).toBe(false);
    });

    it('rejects RFC with special characters in homoclave', () => {
      expect(validateRFC('ABC800101@A1')).toBe(false);
    });

    it('rejects a completely invalid string', () => {
      expect(validateRFC('INVALIDO')).toBe(false);
    });
  });
});
