import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import {
  TOKEN_VAR_MAP,
  RADIUS_VAR_MAP,
  ON_TEXT_VAR_MAP,
  FOCUS_RING_VAR_MAP,
  MOTION_VAR_MAP,
} from '../components/ThemeProvider/ThemeProvider';

const TOKENS_CSS_PATH = resolve(__dirname, '../tokens.css');
const THEMES_CSS_PATH = resolve(__dirname, './themes.css');
const PRIMITIVES_CSS_PATH = resolve(__dirname, './primitives.css');

/**
 * TOKEN_VAR_MAP entries that live outside tokens.css by design — tokens.css
 * is scoped to color and shadow tokens only (ver primer test de este
 * archivo). fontFamily → --font-sans vive en styles/themes.css (capa
 * semántica de theme, no de esquema de color).
 */
const CROSS_FILE_TOKEN_VARS = new Set(['--font-sans']);

/**
 * Tokens que son invariantes a propósito entre esquemas de color y no
 * deben tener contraparte en el bloque [data-color-scheme='dark'].
 * --color-txt-white es "texto sobre relleno de marca" — correcto en
 * ambos esquemas (ver CLAUDE.md § Design tokens).
 */
const SCHEME_INVARIANT_TOKENS = new Set(['color-txt-white']);

const extractBlock = (css: string, selectorPattern: RegExp): string => {
  const match = css.match(selectorPattern);
  if (!match) throw new Error(`No se encontró el bloque para ${selectorPattern}`);
  return match[1];
};

const extractDeclaredTokens = (block: string): string[] =>
  [...block.matchAll(/--([\w-]+):/g)].map((m) => m[1]);

describe('tokens.css — dominio del eje de color/esquema', () => {
  it('contiene solo tokens --color-* y --shadow-* — no typography/radius (viven en primitives.css)', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const declarations = tokensCss.match(/--[a-z0-9-]+(?=:)/g) ?? [];
    expect(declarations.length).toBeGreaterThan(0);
    for (const decl of declarations) {
      expect(decl).toMatch(/^--(color|shadow)-/);
    }
  });

  it('todo token del esquema claro ([data-color-scheme=\'light\']) tiene contraparte en [data-color-scheme=\'dark\'], salvo invariantes declarados', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const lightTokens = extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s));
    const darkTokens = new Set(
      extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s))
    );

    const missing = lightTokens.filter(
      (t) => !darkTokens.has(t) && !SCHEME_INVARIANT_TOKENS.has(t)
    );
    expect(missing).toEqual([]);
  });

  it('el bloque dark no declara tokens ausentes del esquema claro', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const lightTokens = new Set(
      extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s))
    );
    const darkTokens = extractDeclaredTokens(
      extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s)
    );

    const extra = darkTokens.filter((t) => !lightTokens.has(t));
    expect(extra).toEqual([]);
  });

  it('declara color-scheme: dark en el bloque oscuro (controles nativos / scrollbars)', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const darkBlock = extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s);
    expect(darkBlock).toMatch(/color-scheme:\s*dark/);
  });

  it('ambos esquemas usan selector doble (:root + [data-color-scheme=X]) — necesario para que los derivados se re-resuelvan en un <ThemeProvider> anidado, no solo en <html>', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    expect(tokensCss).toMatch(/:root,\s*\n\s*\[data-color-scheme='light'\]\s*{/);
    expect(tokensCss).toMatch(/:root\[data-color-scheme='dark'\],\s*\n\s*\[data-color-scheme='dark'\]\s*{/);
  });

  it('cada declaración de color es una semilla (hex literal) o un derivado que referencia var(--color-*)', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
    const declarations = [
      ...tokensCss.matchAll(/--(color-[\w-]+):\s*([^;]+);/g),
    ].map(([, name, value]) => ({ name, value: value.trim() }));

    const isHexLiteral = (v: string) => /^#[0-9a-fA-F]{3,8}$/.test(v);
    const isDerived = (v: string) => v.startsWith('var(--') || v.startsWith('color-mix(');

    const invalid = declarations.filter((d) => !isHexLiteral(d.value) && !isDerived(d.value));
    expect(invalid).toEqual([]);
  });

  it('TOKEN_VAR_MAP (ThemeProvider) solo apunta a tokens semilla realmente declarados', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const themesCss = readFileSync(THEMES_CSS_PATH, 'utf-8');
    const lightTokens = new Set(
      extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s))
    );

    for (const cssVar of Object.values(TOKEN_VAR_MAP)) {
      if (CROSS_FILE_TOKEN_VARS.has(cssVar)) {
        expect(themesCss).toContain(`${cssVar}:`);
        continue;
      }
      const tokenName = cssVar.replace(/^--/, '');
      expect(lightTokens.has(tokenName)).toBe(true);
    }
  });

  it('ON_TEXT_VAR_MAP (contraste automático) apunta a tokens --color-txt-on-* realmente declarados en ambos esquemas', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const lightTokens = new Set(
      extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s))
    );
    const darkTokens = new Set(
      extractDeclaredTokens(extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s))
    );

    for (const cssVar of Object.values(ON_TEXT_VAR_MAP)) {
      const tokenName = cssVar.replace(/^--/, '');
      expect(lightTokens.has(tokenName)).toBe(true);
      expect(darkTokens.has(tokenName)).toBe(true);
    }
  });
});

describe('styles/themes.css — dominio del eje de tema (square/rounded)', () => {
  it('RADIUS_VAR_MAP (ThemeProvider) solo apunta a tokens semánticos realmente declarados', () => {
    const themesCss = readFileSync(THEMES_CSS_PATH, 'utf-8');
    for (const cssVar of Object.values(RADIUS_VAR_MAP)) {
      expect(themesCss).toContain(`${cssVar}:`);
    }
  });

  it("[data-theme='square'] y [data-theme='rounded'] declaran exactamente el mismo conjunto de tokens", () => {
    const themesCss = readFileSync(THEMES_CSS_PATH, 'utf-8');
    const squareTokens = new Set(
      extractDeclaredTokens(extractBlock(themesCss, /\[data-theme='square'\]\s*{([^}]*)}/s))
    );
    const roundedTokens = new Set(
      extractDeclaredTokens(extractBlock(themesCss, /\[data-theme='rounded'\]\s*{([^}]*)}/s))
    );

    expect([...squareTokens].sort()).toEqual([...roundedTokens].sort());
  });
});

describe('styles/primitives.css — dominio invariante (motion, focus ring, tipografía, z-index)', () => {
  it('FOCUS_RING_VAR_MAP (ThemeProvider) solo apunta a tokens realmente declarados', () => {
    const primitivesCss = readFileSync(PRIMITIVES_CSS_PATH, 'utf-8');
    for (const cssVar of Object.values(FOCUS_RING_VAR_MAP)) {
      expect(primitivesCss).toContain(`${cssVar}:`);
    }
  });

  it('MOTION_VAR_MAP (ThemeProvider) solo apunta a tokens realmente declarados', () => {
    const primitivesCss = readFileSync(PRIMITIVES_CSS_PATH, 'utf-8');
    for (const cssVar of Object.values(MOTION_VAR_MAP)) {
      expect(primitivesCss).toContain(`${cssVar}:`);
    }
  });
});
