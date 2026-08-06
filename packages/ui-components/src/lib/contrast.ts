/**
 * Utilidades de contraste WCAG — usadas por ThemeProvider para elegir texto
 * legible cuando el consumidor sobrescribe una semilla de relleno de marca
 * (colorPrimary, colorDanger, ...) con un color arbitrario. `--color-txt-white`
 * es invariante y segura para los hex por defecto del sistema, pero deja de
 * serlo con un override — un amarillo claro no soporta texto blanco.
 */

const WHITE = '#ffffff';
/** Coincide con --color-txt (light) — el "negro" del sistema, no #000. */
const DARK = '#191919';

const parseHex = (hex: string): [number, number, number] | null => {
  const normalized = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(normalized)) return null;
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const int = parseInt(expanded.slice(0, 6), 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const relativeLuminance = (hex: string): number => {
  const rgb = parseHex(hex);
  if (!rgb) return 1; // no parseable — tratar como claro, degrada a texto oscuro sin romper
  const [r, g, b] = rgb.map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Contraste WCAG 2.x entre dos colores hex — 1 (sin contraste) a 21 (blanco/negro). */
export const contrastRatio = (hexA: string, hexB: string): number => {
  const lA = relativeLuminance(hexA) + 0.05;
  const lB = relativeLuminance(hexB) + 0.05;
  return lA > lB ? lA / lB : lB / lA;
};

/**
 * Elige, entre blanco y el oscuro del sistema, el que da mejor contraste
 * sobre `hex`. Determinista y sin dependencias — se puede llamar tanto en
 * ThemeProvider (runtime, browser) como en tests/tooling (Node).
 */
export const pickReadableText = (hex: string): string => {
  const onWhite = contrastRatio(hex, WHITE);
  const onDark = contrastRatio(hex, DARK);
  return onWhite >= onDark ? WHITE : DARK;
};
