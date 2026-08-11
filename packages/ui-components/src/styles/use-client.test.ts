import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SRC_DIR = resolve(__dirname, '..');
const COMPONENTS_DIR = join(SRC_DIR, 'components');
const HOOKS_DIR = join(SRC_DIR, 'hooks');
const I18N_DIR = join(SRC_DIR, 'i18n');

/**
 * Matches any call that follows React's hook naming convention — `use` followed by a
 * capital letter — not just the built-in hooks. A fixed list of built-in names (the
 * previous version of this pattern) misses custom hooks like `useBipLocale`, which is
 * exactly how 9 components shipped without "use client" in 0.4.0 despite this test
 * existing: they call `useBipLocale()` (itself wrapping `useContext`), not `useContext`
 * directly, so the old pattern never matched them.
 */
const HOOK_CALL_PATTERN = /\buse[A-Z]\w*\s*\(/;

function assertUseClient(filePath: string, label: string) {
  const source = readFileSync(filePath, 'utf-8');
  if (!HOOK_CALL_PATTERN.test(source)) return;

  const firstStatement = source.trimStart().slice(0, 20);
  expect(
    firstStatement.startsWith("'use client'") || firstStatement.startsWith('"use client"'),
    `${label} llama un hook de React pero no declara "use client" como primera línea — ` +
      `se rompe al renderizarse (incluso transitivamente) desde un Server Component ` +
      `(Next.js App Router) con "TypeError: createContext is not a function".`
  ).toBe(true);
}

describe('componentes con hooks de React declaran "use client"', () => {
  const componentDirs = readdirSync(COMPONENTS_DIR).filter((entry) =>
    statSync(join(COMPONENTS_DIR, entry)).isDirectory()
  );

  for (const dir of componentDirs) {
    const entryFile = join(COMPONENTS_DIR, dir, `${dir}.tsx`);
    try {
      statSync(entryFile);
    } catch {
      continue;
    }

    it(`${dir}: si usa hooks de React, empieza con "use client"`, () => {
      assertUseClient(entryFile, `${dir}.tsx`);
    });
  }
});

/**
 * Fuera de src/components/: hooks exportados en la raíz del paquete (src/hooks/) y el
 * contexto de i18n (src/i18n/LocaleContext.tsx) — ambos alcanzables por un Server
 * Component sin pasar antes por un boundary "use client" de ningún componente, así que
 * necesitan la directiva propia igual que un componente.
 */
describe('hooks y contexto compartido declaran "use client"', () => {
  const otherFiles = [
    ...readdirSync(HOOKS_DIR)
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'index.ts')
      .map((f) => join(HOOKS_DIR, f)),
    ...readdirSync(I18N_DIR)
      .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
      .map((f) => join(I18N_DIR, f)),
  ];

  for (const filePath of otherFiles) {
    const label = filePath.slice(SRC_DIR.length + 1);
    it(`${label}: si usa hooks de React, empieza con "use client"`, () => {
      assertUseClient(filePath, label);
    });
  }
});
