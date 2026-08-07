import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { describe, it, expect } from 'vitest';

const COMPONENTS_DIR = resolve(__dirname, '../components');

const HOOK_PATTERN =
  /\buse(State|Effect|Context|Ref|Callback|Memo|Id|Reducer|SyncExternalStore|ImperativeHandle|LayoutEffect|DeferredValue|Transition)\b/;

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
      const source = readFileSync(entryFile, 'utf-8');
      if (!HOOK_PATTERN.test(source)) return;

      const firstStatement = source.trimStart().slice(0, 20);
      expect(
        firstStatement.startsWith("'use client'") || firstStatement.startsWith('"use client"'),
        `${dir}.tsx usa hooks de React pero no declara "use client" como primera línea — ` +
          `se rompe al renderizarse desde un Server Component (Next.js App Router).`
      ).toBe(true);
    });
  }
});
