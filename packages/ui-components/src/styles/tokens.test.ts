import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

describe('tokens.css generator boundary', () => {
  it('contains only color custom properties — no typography/radius/shadow leaked back in', () => {
    const tokensCss = readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8');
    const nonColorTokens = tokensCss.match(/--(?!color-)[a-z-]+:/g);
    expect(nonColorTokens).toBeNull();
  });

  it('every custom property in tokens.css is prefixed --color-', () => {
    const tokensCss = readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8');
    const declarations = tokensCss.match(/--[a-z0-9-]+(?=:)/g) ?? [];
    expect(declarations.length).toBeGreaterThan(0);
    for (const decl of declarations) {
      expect(decl).toMatch(/^--color-/);
    }
  });
});
