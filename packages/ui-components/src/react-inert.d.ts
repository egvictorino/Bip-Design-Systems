// `inert` is a standard HTML global attribute (Baseline since 2023) but missing from
// @types/react 18 — this repo is pinned to React 18. Remove this augmentation once the
// installed @types/react ships it natively.
import 'react';

declare module 'react' {
  // Must match the type parameter name/arity of React's own HTMLAttributes<T> declaration —
  // interface merging requires identical type parameter lists across declarations.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    // React 18 doesn't recognize `inert` as a boolean HTML property and silently drops a
    // `true` value — only a string ('' or 'true') reaches the DOM. Pass '' to enable it.
    inert?: '';
  }
}
