import tokensCss from '../tokens.css?raw';

export type TokenKind = 'seed' | 'derived';

export interface TokenEntry {
  name: string;
  group: string;
  kind: TokenKind;
  light: string;
  dark: string | null;
}

export interface ShadowEntry {
  name: string;
  light: string;
  dark: string;
}

const extractBlock = (css: string, selectorPattern: RegExp): string => {
  const match = css.match(selectorPattern);
  if (!match) throw new Error(`tokens.data.ts: no se encontró el bloque para ${selectorPattern}`);
  return match[1];
};

interface RawDecl {
  group: string;
  value: string;
}

/**
 * Parser línea a línea (no regex global) para no confundir declaraciones
 * reales con líneas comentarizadas — ver el bug que motivó esto en
 * src/styles/tokens.test.ts ("cada declaración... referencia var(--color-*)").
 */
const parseBlock = (block: string): Map<string, RawDecl> => {
  const result = new Map<string, RawDecl>();
  let currentGroup = '';

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    const fullLineComment = line.match(/^\/\*\s*(.*?)\s*\*\/$/);
    if (fullLineComment) {
      const text = fullLineComment[1];
      // Encabezados de grupo tipo "Interaction — semillas" o "Shadows (light)".
      // Cualquier otra cosa (p. ej. una declaración comentada) no actualiza el grupo.
      if (!text.includes(':')) {
        currentGroup = text.split('—')[0].split('(')[0].trim();
      }
      continue;
    }

    const decl = line.match(/^--([\w-]+):\s*([^;]+);/);
    if (decl) {
      const [, name, value] = decl;
      result.set(name, { group: currentGroup, value: value.trim() });
    }
  }

  return result;
};

const isHexLiteral = (value: string): boolean => /^#[0-9a-fA-F]{3,8}$/.test(value);

const lightBlock = parseBlock(
  extractBlock(tokensCss, /\[data-color-scheme='light'\]\s*{([^}]*)}/s)
);
const darkBlock = parseBlock(extractBlock(tokensCss, /\[data-color-scheme='dark'\]\s*{([^}]*)}/s));

const allTokens: TokenEntry[] = [];
const allShadows: ShadowEntry[] = [];

for (const [name, { group, value }] of lightBlock) {
  const darkDecl = darkBlock.get(name);
  if (name.startsWith('shadow-')) {
    allShadows.push({ name, light: value, dark: darkDecl?.value ?? value });
    continue;
  }
  allTokens.push({
    name,
    group,
    kind: isHexLiteral(value) ? 'seed' : 'derived',
    light: value,
    dark: darkDecl?.value ?? null,
  });
}

/** Orden de exhibición — coincide con el de tokens.css y CLAUDE.md § Design tokens. */
const GROUP_ORDER = ['Interaction', 'Text', 'Surface', 'Border', 'Feedback'];

export const TOKEN_GROUPS: { title: string; tokens: TokenEntry[] }[] = GROUP_ORDER.map(
  (title) => ({
    title,
    tokens: allTokens.filter((t) => t.group === title),
  })
).filter((g) => g.tokens.length > 0);

export const SHADOW_TOKENS: ShadowEntry[] = allShadows;
