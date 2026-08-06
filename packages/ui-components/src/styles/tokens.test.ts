import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const TOKENS_CSS_PATH = resolve(__dirname, '../tokens.css');

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

  it('todo token del esquema claro (:root) tiene contraparte en [data-color-scheme=\'dark\'], salvo invariantes declarados', () => {
    const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const lightTokens = extractDeclaredTokens(extractBlock(tokensCss, /:root\s*{([^}]*)}/s));
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
      extractDeclaredTokens(extractBlock(tokensCss, /:root\s*{([^}]*)}/s))
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
});
