// @types/jest-axe only augments Jest's `jest.Matchers`/`@jest/expect` interfaces — it has
// no vitest-native typings. Under vitest 3 this went unnoticed (its older `Assertion` typing
// happened to pick up the global `jest.Matchers` augmentation loosely); vitest 5 tightened
// that and exposed the gap as `Property 'toHaveNoViolations' does not exist`. The runtime
// registration (`expect.extend(toHaveNoViolations)` in test-setup.ts) was always correct —
// this file only teaches TypeScript about the matcher, mirroring both the signature
// `@types/jest-axe`'s `IToHaveNoViolations` already declares for Jest and the single-type-
// param `Assertion<T = any>` shape `@testing-library/jest-dom/vitest` augments successfully
// (see its own types/vitest.d.ts) — proven to merge cleanly with vitest 5's own interface.
import 'vitest';

declare module 'vitest' {
  // Matches the default of vitest's own `Assertion<T = any>` and jest-dom/vitest's identical
  // augmentation pattern.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}
