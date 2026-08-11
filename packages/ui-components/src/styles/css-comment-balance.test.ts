import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SRC_DIR = resolve(__dirname, '..');

function findCssFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry);
    const stat = statSync(entryPath);
    if (stat.isDirectory()) {
      results.push(...findCssFiles(entryPath));
    } else if (entry.endsWith('.css')) {
      results.push(entryPath);
    }
  }
  return results;
}

// Regression test for a real bug: a comment in index.css read (roughly)
// "usa --duration-* / --ease-* (ver primitives.css)" with NO space between the asterisk
// and the slash — so its own text embedded a comment-closing sequence (the asterisk ending
// "--duration-*" immediately followed by the slash opening "/--ease-*"). Any comment
// stripper reads that as the terminator, and everything after it lands as unescaped raw
// text in the published dist/style.css, breaking CSS parsing entirely in strict bundlers
// (Turbopack). Deliberately writing block comments here to describe the bug would risk
// reproducing it, hence the line comments.
//
// postcss.parse() does NOT reliably catch this — the leftover prose after the premature
// close still tokenizes as *something* without throwing. Counting comment delimiters does:
// a well-formed file always has an equal number of openers and closers; this bug produces
// one opener before a closer that shouldn't be there, so the counts diverge (1 open vs. 2
// close in the original case). No valid CSS comment or string literal legitimately contains
// a closing sequence inside a comment's intended body, so this has no false-positive risk
// on correct CSS.
describe('los comentarios CSS del paquete no se auto-cierran a medias', () => {
  const cssFiles = findCssFiles(SRC_DIR);
  const OPEN = '/' + '*';
  const CLOSE = '*' + '/';

  for (const filePath of cssFiles) {
    const label = filePath.slice(SRC_DIR.length + 1);
    it(`${label}: cantidad de aperturas y cierres de comentario coincide`, () => {
      const source = readFileSync(filePath, 'utf-8');
      const opens = source.split(OPEN).length - 1;
      const closes = source.split(CLOSE).length - 1;
      expect(
        opens,
        `${label} tiene ${opens} apertura(s) de comentario pero ${closes} cierre(s) — algun ` +
          `comentario probablemente contiene una secuencia de cierre en su propio texto, que ` +
          `lo termina antes de tiempo y deja el resto como CSS crudo sin comentar.`
      ).toBe(closes);
    });
  }
});
