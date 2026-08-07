import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import { TOKEN_VAR_MAP, ON_TEXT_VAR_MAP } from '../components/ThemeProvider/ThemeProvider';
import { contrastRatio } from '../lib/contrast';

const TOKENS_CSS_PATH = resolve(__dirname, '../tokens.css');

/**
 * WCAG AA para texto normal — mismo umbral que ThemeProvider's warnIfLowContrast()
 * (ver ThemeProvider.tsx AA_CONTRAST_THRESHOLD) y contrast.test.ts.
 */
const AA_CONTRAST_THRESHOLD = 4.5;

const extractBlock = (css: string, selectorPattern: RegExp): string => {
  const match = css.match(selectorPattern);
  if (!match) throw new Error(`No se encontró el bloque para ${selectorPattern}`);
  return match[1];
};

/**
 * A diferencia de extractDeclaredTokens (tokens.test.ts, solo nombres), acá se necesita el
 * valor — pero solo para hex literales: los derivados con color-mix() no se pueden resolver
 * sin un motor CSS real, así que se excluyen y se devuelve un Map parcial. Ver el límite
 * documentado abajo.
 */
const extractHexValues = (block: string): Map<string, string> => {
  const map = new Map<string, string>();
  for (const [, name, value] of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    const trimmed = value.trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) map.set(name, trimmed);
  }
  return map;
};

describe('tokens.css — contraste WCAG AA de tokens reales (no solo la función contrastRatio)', () => {
  const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
  const lightValues = extractHexValues(
    extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s)
  );
  const darkValues = extractHexValues(
    extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s)
  );

  /**
   * Límite explícito de esta suite: solo evalúa pares cuyo valor en tokens.css es un hex
   * literal — las 6 semillas de relleno (TOKEN_VAR_MAP) contra su --color-txt-on-* (ON_TEXT_VAR_MAP),
   * y el par base --color-txt / --color-surface-1. Los derivados con color-mix() (hover, press,
   * light, subtle, text, etc.) no se pueden resolver a un hex concreto sin un motor CSS real —
   * ese contraste renderizado lo cubre @axe-core/playwright en visual/a11y-browser.spec.ts,
   * corriendo axe con color-contrast activado en un navegador de verdad. No asumir que esta
   * suite cubre toda la paleta: cubre las semillas de fill, que es lo único que
   * ThemeProvider recalcula en runtime vía pickReadableText().
   */
  const fillPairs = Object.entries(ON_TEXT_VAR_MAP) as [keyof typeof TOKEN_VAR_MAP, string][];

  describe.each(['light', 'dark'] as const)('esquema %s', (scheme) => {
    const values = scheme === 'light' ? lightValues : darkValues;

    it.each(fillPairs)('%s alcanza 4.5:1 contra su --color-txt-on-*', (seedKey, onTextVar) => {
      const seedVar = TOKEN_VAR_MAP[seedKey].replace(/^--/, '');
      const onTextName = onTextVar.replace(/^--/, '');
      const seedHex = values.get(seedVar);
      const onTextHex = values.get(onTextName);

      expect(seedHex, `${seedVar} no se encontró como hex literal en tokens.css`).toBeDefined();
      expect(onTextHex, `${onTextName} no se encontró como hex literal en tokens.css`).toBeDefined();

      const ratio = contrastRatio(seedHex!, onTextHex!);
      expect(
        ratio,
        `${seedVar}(${seedHex}) vs ${onTextName}(${onTextHex}) = ${ratio.toFixed(2)}:1, mínimo ${AA_CONTRAST_THRESHOLD}:1`
      ).toBeGreaterThanOrEqual(AA_CONTRAST_THRESHOLD);
    });

    it('--color-txt alcanza 4.5:1 contra --color-surface-1', () => {
      const txt = values.get('color-txt');
      const surface = values.get('color-surface-1');
      expect(txt).toBeDefined();
      expect(surface).toBeDefined();

      const ratio = contrastRatio(txt!, surface!);
      expect(
        ratio,
        `--color-txt(${txt}) vs --color-surface-1(${surface}) = ${ratio.toFixed(2)}:1, mínimo ${AA_CONTRAST_THRESHOLD}:1`
      ).toBeGreaterThanOrEqual(AA_CONTRAST_THRESHOLD);
    });
  });
});
