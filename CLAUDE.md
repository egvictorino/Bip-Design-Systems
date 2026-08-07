# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires Node >=20 and pnpm 9.15.9+)
pnpm install

# Build order matters — shared-utils must build before ui-components
pnpm --filter @bip-design-systems/shared-utils build
pnpm --filter @bip-design-systems/ui-components build

# Component development
pnpm --filter @bip-design-systems/ui-components storybook        # http://localhost:6006
pnpm --filter @bip-design-systems/ui-components build-storybook

# Lint & test (scoped)
pnpm --filter @bip-design-systems/ui-components lint
pnpm --filter @bip-design-systems/shared-utils test
pnpm --filter @bip-design-systems/ui-components test         # component tests (vitest + happy-dom)
pnpm --filter @bip-design-systems/ui-components test:visual  # theme visual regression (Playwright, needs Storybook running)

# All packages at once
pnpm build
pnpm lint
pnpm dev   # parallel dev mode
```

## Branch Strategy

```
main (producción)  ←  qa (testing)  ←  dev (desarrollo)  ←  feature/xxx
```

PRs always go: `feature/xxx → dev → qa → main`. Hotfixes branch from `main` and are cherry-picked back to `qa` and `dev`.

## Architecture

**pnpm workspaces monorepo:**

- `packages/ui-components` — React component library. Main deliverable. Builds to `dist/` with one file per component (ES only, `preserveModules: true`) + individual `.d.ts` files. Entry: `dist/index.js`.
- `packages/shared-utils` — Pure TypeScript utilities (formatting, validation). No runtime deps.

## Consumer setup

`ui-components` ships a single compiled CSS file at `@bip-design-systems/ui-components/style.css` that includes all component styles and design tokens. No Tailwind configuration is required.

```ts
// src/main.tsx (o index.tsx) del proyecto consumidor
import '@bip-design-systems/ui-components/style.css';
```

Peer dependencies required: `react` and `react-dom`. No additional CSS tooling needed.

## shared-utils (`packages/shared-utils`)

Pure TypeScript utilities — no runtime dependencies.

**Available functions:**
- `formatCurrency(amount: number): string` — formats as MXN currency using `es-MX` locale
- `formatDate(date: Date): string` — formats date using `es-MX` locale
- `validateRFC(rfc: string): boolean` — validates Mexican RFC format (uppercase only, no normalization)
  - Regex: `/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/`

**Testing:** vitest is configured. Run with `pnpm --filter @bip-design-systems/shared-utils test` (21 tests).

**Build note:** `tsconfig.json` excludes `**/*.test.ts` from compilation so test files never appear in `dist/`. Do not remove this exclude.

## Component testing (`packages/ui-components`)

Test files live alongside components: `ComponentName.test.tsx`. Configured with:
- **vitest** + **happy-dom** (ESM-native DOM — do not switch to jsdom@28, it has ESM incompatibility)
- **@testing-library/react** + **@testing-library/user-event** + **@testing-library/jest-dom**
- `vitest.config.ts` at package root — sets `globals: true`, `environment: 'happy-dom'`, `setupFiles: ['./src/test-setup.ts']`
- `src/test-setup.ts` imports `@testing-library/jest-dom` to extend `expect`
- `vite-plugin-dts` excludes `**/*.test.tsx` so test files never appear in `dist/`
- `tsconfig.json` keeps test files **included** (no exclude) so the IDE resolves test imports correctly; `"types": ["vitest/globals", "@testing-library/jest-dom"]` provides global types

### Visual regression (`packages/ui-components/visual/`)

Separate from the vitest suite — `theme-matrix.spec.ts` uses `@playwright/test` against a running Storybook, not happy-dom, because it screenshots the theme system end-to-end: square/rounded × light/dark, custom brand (which is also rounded, so that combination has a baseline too), Foundations/Colors, Foundations/Radius, `SideBySide`, `PortalTheming` (Modal via `createPortal` inheriting the active theme), `SystemColorScheme`, and `SideBySide` again under the `dir:rtl` Storybook global (passed via URL — `&globals=dir:rtl` — see the `RTL` test) to confirm logical properties/flex order actually mirror. `UncontrolledWithPersistence` is deliberately not screenshotted — it depends on `localStorage` state from a prior visit, which isn't reproducible pixel-for-pixel. `playwright.visual.config.ts` auto-starts `pnpm storybook` if one isn't already running on :6006. Baselines are committed in `visual/theme-matrix.spec.ts-snapshots/` (platform-suffixed, e.g. `-chromium-darwin.png` — regenerate locally on your OS with `pnpm test:visual -- --update-snapshots` after a deliberate `tokens.css`/`ThemeProvider` change; not currently wired into CI — the committed baselines are macOS-only, and CI runs on `ubuntu-latest`, so wiring it in would first need a parallel Linux baseline set, e.g. generated via the Playwright Docker image).

`pnpm test` runs vitest once and exits (`vitest run`) — use `pnpm test:watch` for interactive watch mode. (Previously `test` ran in watch mode and only terminated in CI because GitHub Actions sets `CI=true`, which vitest respects — that was incidental, not by design.)

## CI/CD

Four workflows, one per environment:

| Workflow | Trigger | Key steps |
|----------|---------|-----------|
| `pr-validation.yml` | PR to any branch | branch check → lint → **test** → build |
| `dev.yml` | push/PR to `dev` | lint → **test** → build → storybook preview |
| `qa.yml` | push/PR to `qa` | security audit \| lint → **test** → build → storybook QA |
| `production.yml` | push/PR to `main` | security + lint + **test** + type-check → build → GitHub Pages → release |

**Rules:**
- All workflows use `pnpm install --frozen-lockfile` — never use `--no-frozen-lockfile` in CI.
- Tests for **both** packages always run **before** build (fail-fast): `pnpm --filter @bip-design-systems/shared-utils test` then `pnpm --filter @bip-design-systems/ui-components test`.
- Build order in every pipeline: `shared-utils → ui-components`.

## Versioning

`packages/ui-components` keeps a `CHANGELOG.md` (Keep a Changelog format). No changesets/automated
versioning — both the bump and the changelog entry are manual.

- Every PR into `dev` that changes `ui-components` behavior (new prop, new component, bug fix,
  breaking change) adds an entry under `## [Unreleased]` in `CHANGELOG.md`.
- The version bump in `package.json` happens when the release is cut for `main`, not per-PR:
  rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD` and add a fresh empty `## [Unreleased]`
  above it.
- `production.yml`'s `create-release` job extracts that version's section from `CHANGELOG.md` as
  the GitHub release body (via `awk`, matching the `## [x.y.z]` header) — keep entries scoped
  under their version header so extraction doesn't bleed into the next one.
- `shared-utils` does not currently have its own CHANGELOG or release tagging; its version in
  `package.json` is bumped independently when it changes, with no automated release step.

## Component Patterns (`packages/ui-components`)

### Structure for every new component
```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx
└── index.ts
```

Always export from `src/index.ts` after creating.

### Component template
Form components (anything with a ref) use `forwardRef`. Display components use `React.FC`.

```tsx
// Form component
import { forwardRef, useId } from 'react';

export const Component = forwardRef<HTMLInputElement, ComponentProps>(
  ({ size = 'md', label, error = false, disabled = false, id, ...props }, ref) => {
    const generatedId = useId();
    const componentId = id || (label ? generatedId : undefined);
    ...
  }
);
Component.displayName = 'Component';
```

**ID generation rule:** always use `useId()` from React 18 — never derive IDs from label text. Label-based IDs (`\`input-${label}\``) produce duplicate `id` attributes when two instances share the same label, breaking `htmlFor`/`id` linkage and screen reader accessibility. `useId()` is guaranteed unique per component instance and SSR-safe.

### Styling rules
- **CSS Modules** — one `ComponentName.module.css` per component, no inline styles.
- Import the module as `styles` and apply with `cn()`:
  ```tsx
  import styles from './Button.module.css';
  import { cn } from '../../lib/cn';

  className={cn(styles.button, styles[variant], styles[size], className)}
  ```
- Use design tokens via CSS custom properties (e.g. `var(--color-primary)`) in `.module.css` files — **never hardcode hex values**.
- CSS Modules provide automatic scoping — class name conflicts between components are impossible by design.

### `cn()` utility

Lives at `src/lib/cn.ts`. Thin wrapper around `clsx` for conditional CSS Module class composition:

```ts
import { cn } from '../../lib/cn';

className={cn(styles.base, condition && styles.active, className)}
```

CSS Modules guarantee scoping at build time, so merge conflict resolution (tailwind-merge) is not needed.

### Compound component pattern

Use when a component has multiple named sub-parts that share internal state (examples: Modal, Tabs, Dropdown, Navbar, Table, Sidebar). All six already exist as references.

```tsx
// 1. Context with null default + error guard hook (MANDATORY — never use a default object value)
//    Using a default object value (e.g. createContext({ striped: false })) silences errors when
//    sub-components are used outside the parent — the null guard makes misuse fail loudly.
const MyContext = createContext<MyContextValue | null>(null);
const useMyContext = (): MyContextValue => {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('<Sub> must be used inside <Parent>');
  return ctx;
};

// 2. Root provides context
export const Parent: React.FC<ParentProps> = ({ children }) => {
  const [state, setState] = useState(false);
  return (
    <MyContext.Provider value={{ state, setState }}>
      <div>{children}</div>
    </MyContext.Provider>
  );
};

// 3. Sub-components consume context
export const Sub: React.FC<SubProps> = ({ children }) => {
  const { state } = useMyContext();
  return <div>{children}</div>;
};
```

Export all sub-components from both `index.ts` and `src/index.ts`.

### Design tokens

Single source of truth: `src/tokens.css` — defines all design tokens as CSS custom properties. **Hand-authored, edit directly.** Contains both the `:root` (light) values and the `[data-color-scheme='dark']` overrides for the color-scheme axis (see `ThemeProvider`). Both schemes live in this one file because the build concatenates every CSS Module into a single `dist/style.css`, and chunk order between separate files is not guaranteed.

```css
/* Interaction */
--color-active, --color-primary, --color-primary-{hover|press}
--color-secondary, --color-secondary-{hover|press}
--color-danger, --color-danger-{hover|light|muted|press|subtle|text}
--color-disabled, --color-field, --color-field-readonly
--color-selected, --color-unique

/* Text */
--color-txt, --color-txt-{black|disabled|important|secondary|utility|white}
--color-link, --color-link-{hover|press}

/* Surface */
--color-scrim, --color-surface-{1|2|3|4}

/* Border / Edge */
--color-edge, --color-edge-{disabled|focus|heavy|hover|important|medium|success|unique|warning}

/* Feedback */
--color-info, --color-info-{light|subtle|text}
--color-success, --color-success-{light|subtle|text}
--color-warning, --color-warning-{light|subtle|text}
```

To use in a `.module.css` file: `background-color: var(--color-primary);`

To add a token: edit `tokens.css` directly — add the light value under `:root, [data-color-scheme='light']` and, if it should differ in dark mode, a matching override under `:root[data-color-scheme='dark'], [data-color-scheme='dark']`. **Both selectors are double** (`:root` + attribute-only) — `:root` alone only matches `<html>`, never a nested `<ThemeProvider>` wrapper `<div>`, so a bare `:root` block would silently fail to re-resolve derived `var()` references inside a nested provider. No registration in `cn.ts` required.

**Non-color primitives** (`src/styles/primitives.css` — invariant to `data-theme`/`data-color-scheme`, consumed directly by components, no `[data-theme=...]` layer needed):
```css
/* Typography */
--text-3xs, --text-2xs, --text-xs, --text-sm, --text-base, --text-lg, --text-xl, --text-2xl
--leading-tight, --leading-normal, --leading-relaxed
--font-normal, --font-medium, --font-semibold, --font-bold

/* Motion — overridable via ThemeProvider `motion` prop */
--duration-instant, --duration-fast, --duration-normal, --duration-slow
--ease-standard, --ease-out, --ease-in

/* Focus ring — overridable via ThemeProvider `focusRing` prop */
--focus-ring-width, --focus-ring-offset, --focus-ring-color, --focus-ring

/* Spacing — raw scale, see below */
--space-0, --space-px, --space-0-5, --space-1, --space-1-5, --space-2, --space-2-5,
--space-3, --space-3-5, --space-4, --space-5, --space-6, --space-7, --space-8, --space-9,
--space-10, --space-12, --space-14, --space-16, --space-18, --space-22

/* Z-index — not exposed on ThemeProvider (app-wide stacking, not a brand concern) */
--z-base, --z-raised, --z-dropdown, --z-overlay, --z-modal, --z-toast
```
`--focus-ring` is a compound token (`0 0 0 var(--focus-ring-offset) var(--color-surface-1), 0 0 0 calc(...) var(--focus-ring-color)`) — components use `box-shadow: var(--focus-ring);` directly; a danger-variant focus ring redeclares only `--focus-ring-color: var(--color-danger);` in the same rule instead of duplicating the shadow. `prefers-reduced-motion: reduce` collapses all four `--duration-*` tokens to `0ms` globally in `index.css` — components don't need their own media query as long as their transitions reference `var(--duration-*)`.

**Spacing** (`--space-*`, `src/styles/primitives.css`). All `padding`/`margin`/`gap` declarations in `.module.css` files use these tokens — **never a literal length**. The scale is Tailwind-style (name = value in units of 0.25rem/4px: `--space-3` = 0.75rem = 12px), derived from an audit of the values already in use, not invented — `src/styles/spacing.test.ts` enforces this the same way `on-text.test.ts` enforces the color rule, failing the build on any unmapped literal. Negation uses `calc(var(--space-n) * -1)` (see `Avatar`/`Calendar`/`Tooltip` for examples), never a separate negative token. A handful of true outliers (off the 2px grid, or one-off optical nudges) stay as literal values with an inline comment explaining why — `spacing.test.ts`'s `OUTLIER_VALUES` is the exhaustive list; a new outlier needs both the code comment and that entry, not a silent literal.

**Density** (`--space-control-x/-y-{sm,md,lg}`, `src/styles/density.css`) — a semantic layer *inside* the spacing scale, same two-file mechanic as `theme` (`:root`/`[data-density='comfortable']` vs `[data-density='compact']`, both in one file for the same dist/style.css chunk-order reason as `themes.css`). It only covers the control-padding horquilla that `Button`/`Input`/`Textarea` share exactly and that `Select` partially shares — the rest of `--space-*` (gaps, surface padding) is intentionally invariant to density. `ThemeProvider`'s `density` prop stamps `data-density` on the wrapper (like `theme`); unlike `theme`/`colorScheme` it's **not** controlled/uncontrolled with its own persistence — it's a direct value, resolved the same way as `radius`/`focusRing`/`motion` (see `spacing` prop below). See `Foundations/Spacing` and the Storybook toolbar's `density` global.

**Seed vs. derived tokens.** Within each color-scheme block, tokens are either:
- **Seeds** — hex literals, one per color family (`--color-primary`, `--color-secondary`, `--color-danger`, `--color-info`, `--color-success`, `--color-warning`, `--color-unique`, `--color-link`, `--color-txt`, `--color-surface-1`, `--color-edge`, `--color-field`). These are the tokens a consumer overrides for brand theming.
- **Derived** — everything else in that family (`-hover`, `-press`, `-light`, `-subtle`, `-text`, etc.), computed from the seed with `color-mix(in srgb, var(--color-x), black|white N%)`. Light derives toward `black`; dark derives toward `white`. Overriding a seed automatically recolors its whole family.
- **Computed defaults** — `--color-txt-on-primary`, `-danger`, `-success`, `-warning`, `-info`, `-unique`: static hex fallback in `tokens.css` (can't be a `color-mix()` formula — WCAG contrast isn't expressible in CSS), but re-computed in JS by `ThemeProvider` via `src/lib/contrast.ts`'s `pickReadableText()` whenever the matching seed is overridden. See below.

When adding a token, decide first which seed it derives from — don't add a new hex literal unless it genuinely doesn't belong to any existing family (e.g. `--color-selected`).

**`Foundations/Colors` and `Foundations/Radius`** (Storybook, `src/foundations/`) document every token live — `tokens.data.ts` parses `tokens.css` at build time via `?raw` import (see `src/vite-env.d.ts`) and classifies each token as seed/derived, so the docs page cannot drift from the actual file. Never hand-maintain a duplicate token list for documentation purposes again (a prior `tailwind.tokens.js` doing exactly that was deleted for this reason).

**`Foundations/Theming`** (`src/foundations/Theming.stories.tsx`) is a live playground, not a static doc page: `<input type="color">` per fill seed, a computed-contrast panel (ratio + AA pass/fail via `contrastRatio()`), a copy-to-clipboard `<ThemeProvider>` snippet, and a gallery of the components most likely to paint text over a fill (Button, Avatar, Tabs, Pagination). It's also how you manually verify a change to `ON_TEXT_VAR_MAP`/`--color-txt-on-*` didn't regress — try `colorPrimary: '#ffe066'` (a light yellow) and confirm every gallery item keeps readable text. The Storybook toolbar's `brand` global (`src/foundations/brandPresets.ts`) applies the same presets to *every* story, not just this one — `canary` (`#ffe066`) is the one to reach for when eyeballing any component under a light-override brand.

**Brand theming via `ThemeProvider`.** `ThemeProvider` accepts a `tokens` prop (Ant Design `ConfigProvider`-style) to override seeds at runtime, no CSS build step required:

```tsx
<ThemeProvider theme="rounded" tokens={{ colorPrimary: '#e2007a', dark: { colorPrimary: '#ff4fa8' } }}>
  <App />
</ThemeProvider>
```

- Flat keys (`colorPrimary`, `colorDanger`, ..., `fontFamily`) apply to both schemes; nested `light`/`dark` keys refine per scheme and win over the flat value for the active `colorScheme`.
- `radius` (sibling prop, not inside `tokens`) overrides the 6 semantic radius tokens independently of `theme`: `{ marker, field, control, surface, container, containerLg }`.
- `cssVars` is the escape hatch for anything not in `TOKEN_VAR_MAP` (e.g. `{ '--color-selected': '#...' }`) — it wins over both `tokens` and `radius`.
- Values are applied as inline CSS custom properties on the provider's wrapper `<div>`, so specificity always beats `tokens.css`.
- Nested `<ThemeProvider>`s merge with their parent — a nested provider only overrides the seeds it declares.
- Portalled components (Modal, Toast, DrawerPanel, Calendar, Odontogram popovers) read the resolved vars via `useThemeAttributes()` (returns `{ 'data-theme', 'data-color-scheme', 'data-density'?, style }` — `data-density` is only present when the provider fixes it) since `createPortal` moves them outside the provider's DOM subtree and they'd otherwise fall back to the default palette.
- Adding a new seed: add it to `tokens.css` (both schemes) **and** to `TOKEN_VAR_MAP` in `ThemeProvider.tsx` — `tokens.test.ts` asserts every `TOKEN_VAR_MAP` entry points to a real token.
- `focusRing` (sibling prop) overrides `{ width, offset, color }` against `--focus-ring-*` in `primitives.css` — the double box-shadow ring every focusable component uses (`box-shadow: var(--focus-ring)`), instead of the hand-written `0 0 0 2px var(--color-surface-1), 0 0 0 4px var(--color-primary)` that used to be duplicated per component.
- `motion` (sibling prop) overrides `{ durationInstant, durationFast, durationNormal, durationSlow, easeStandard, easeOut, easeIn }` against `--duration-*`/`--ease-*` in `primitives.css`.
- `spacing` (sibling prop) overrides `{ controlXSm, controlYSm, controlXMd, controlYMd, controlXLg, controlYLg }` against `--space-control-x/-y-*` in `density.css` (see § Spacing above). `density` (sibling prop, `'comfortable' | 'compact'`) stamps `data-density` directly — it isn't controlled/uncontrolled with its own persistence like `theme`, and a nested provider without its own `density` inherits the parent's rather than falling back to the CSS default.
- All five "flat override" axes (`radius`, `focusRing`, `motion`, `spacing`, and the non-scoped keys of `tokens`) share one resolver — `resolveVarMap(overrides, VAR_MAP)` in `ThemeProvider.tsx` — so adding a sixth axis means adding one `*_VAR_MAP` constant and one `resolveVarMap()` call, not a new bespoke resolver.

**Automatic contrast on fill seeds.** Overriding `colorPrimary`, `colorDanger`, `colorSuccess`, `colorWarning`, `colorInfo`, or `colorUnique` also recomputes the matching `--color-txt-on-*` token via `pickReadableText()` (WCAG relative luminance, picks white or `--color-txt`'s dark value against the override) — a light `colorPrimary` won't leave white text stranded on a light button. Components painting text over one of these fills must consume `--color-txt-on-*`, **never** `--color-txt-white`, which is reserved for a short, explicit allowlist of fixed-neutral surfaces that aren't brand seeds (`Sidebar` `.variantDark` on `--color-surface-4`, `Spinner`'s `.white` variant, `Avatar`'s non-brand `bg*` fallbacks) — see `Button`, `Avatar` (`bgPrimary`/`bgDanger`/`bgViolet`), `Stepper`, `Sidebar` (`variant="primary"`) for the `--color-txt-on-*` pattern. `src/styles/on-text.test.ts` fails the build if `--color-txt-white` shows up anywhere outside that allowlist. Dev builds also get a `console.warn` from `resolveTokenVars()` when an override's computed contrast falls below WCAG AA (4.5:1) against both text options.

Two fixed-neutral surfaces that deliberately invert relative to the page — `--color-surface-inverse` / `--color-txt-on-inverse` (used by `Tooltip`'s default bubble) — follow the same seed/derived split as color but are **not** brand-overridable via `tokens`; they exist so a component can flip light↔dark independent of the active `colorScheme`.

**`src/styles/contrast-tokens.test.ts`** checks the *default* AA contrast — `contrastRatio()` (`src/lib/contrast.ts`) applied to the actual hex values in `tokens.css` for each fill seed against its `--color-txt-on-*`, in both color schemes. This is separate from the `console.warn` above, which only fires for a runtime *override*: this test guards the shipped defaults themselves. Scope is deliberately narrow — only pairs that resolve to a literal hex in `tokens.css` (the 6 fill seeds + the base `--color-txt`/`--color-surface-1` pair). Derived tokens (`color-mix()` results — hover/press/light/subtle/text variants) can't be resolved to a concrete hex without a real CSS engine; their rendered contrast is covered instead by `@axe-core/playwright` with `color-contrast` enabled in `visual/a11y-browser.spec.ts` (see § Visual regression), which runs in an actual browser.

**`system`, uncontrolled mode, persistence, SSR.** `theme`/`colorScheme` are controlled-or-uncontrolled (React standard pattern: prop wins if passed, else internal state seeded by `defaultTheme`/`defaultColorScheme`). `colorScheme` additionally accepts `'system'`, resolved live via `useSyncExternalStore` over `matchMedia('(prefers-color-scheme: dark)')` — **never stamped as `'system'` in the DOM**, always the resolved `light`/`dark`. `useThemeControls()` exposes `{ theme, colorScheme, resolvedColorScheme, setTheme, setColorScheme, toggleColorScheme }` for building a toggle without lifting state (no-op outside a provider or on a controlled axis). `storageKey` persists the uncontrolled preference to `localStorage` (best-effort, wrapped in `try/catch`) — the write effect skips whichever axis is controlled by a prop, symmetric with hydration already skipping it on read. `getThemeInitScript({ storageKey })` returns a plain-JS IIFE string to inline in `<head>` before hydration — the only way to avoid a FOUC, since it must run before React mounts.

### RTL support

Components use CSS logical properties (`margin-inline-start`/`-end`, `padding-inline-*`, `border-inline-*`, `inset-inline-*`, `text-align: start`/`end`) instead of physical `left`/`right` — these resolve automatically against the nearest `dir` attribute, no `[dir='rtl']` override block needed per component. `src/styles/rtl.test.ts` fails the build on a new physical property outside the documented exceptions, same enforcement pattern as `on-text.test.ts`/`spacing.test.ts`.

**Two categories of `left`/`right` are deliberately *not* converted** — a handful of components expose an explicit physical placement as part of their public API, and mirroring it by `dir` would fight the consumer's choice, not honor it:
- `DrawerPanel`'s `placement` (`'left' | 'right'`) and `Toast`'s `position` (`topLeft`/`topRight`/etc.) — a consumer asking for a right-side drawer or top-right toast wants that physical corner regardless of document direction.
- `Tooltip`'s `position` (`'top' | 'bottom' | 'left' | 'right'`) is the same kind of physical choice — **but** `Tooltip`'s `align` (`'start' | 'center' | 'end'`) is a *different*, already-logical prop in the same component, and its CSS correctly uses `inset-inline-start`/`-end`. Don't conflate the two when touching `Tooltip.module.css`.

Each of these files documents the exception inline; `rtl.test.ts`'s `PHYSICAL_BY_DESIGN_ALLOWLIST` is the authoritative list — a new physical `left`/`right` needs both the code comment and that entry, not a silent literal.

**`transform: translateX(...)` has no logical equivalent** — CSS doesn't resolve it against `dir` the way it does `inset-inline-*`. `styles/rtl.css` defines `--rtl-x` (`1` in `:root`, `-1` under `[dir='rtl']`); a directionally-meaningful `translateX(Npx)` becomes `translateX(calc(var(--rtl-x) * Npx))` — see `Sidebar` (`.panelMobileClosed`, the mobile overlay sliding in from the inline-start edge) and `Toggle` (the checked-state thumb travel). Most `translateX` usages *don't* need this: a `translateX(-50%)` centering trick is symmetric, and `translateX` tied to one of the physical-placement props above (`DrawerPanel`, `Toast`) stays literal for the same reason those `left`/`right` values do. `ProgressBar`'s indeterminate loading animation is purely decorative (no directional meaning to convey) and is left physical too.

`ThemeProvider`'s `dir` prop (`'ltr' | 'rtl'`) stamps the native `dir` HTML attribute on the wrapper — same mechanic as `density` (direct value, not controlled/uncontrolled with its own persistence; a nested provider without its own `dir` inherits the parent's). `useThemeAttributes()` includes `dir` only when set, for the same portal reasons as `data-density`. See the `dir` Storybook toolbar global and `visual/theme-matrix.spec.ts`'s `RTL` test for a live/screenshotted example — flex and grid layouts reverse visual order under `dir='rtl'` automatically; nothing component-specific is needed for that part.

### `displayName` requirement

**All components must set `displayName`** — both `forwardRef` and `React.FC` components. This enables readable component names in React DevTools and error messages.

```tsx
// forwardRef
export const Input = forwardRef<HTMLInputElement, InputProps>((...) => { ... });
Input.displayName = 'Input';

// React.FC (including compound sub-components)
export const Card: React.FC<CardProps> = (...) => { ... };
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
```

### Accessibility requirements

**Automated a11y gate:** `src/a11y.test.tsx` renders one canonical instance of every component
in `src/components/*` (plus its important interactive state — Modal/ConfirmDialog/DrawerPanel
open, Dropdown menu open, Toast visible) and runs `jest-axe` against it as part of the normal
`pnpm test` run — no separate command, no browser. A coverage guard in the same file fails the
suite if a new component directory has no entry in the registry, so new components can't skip
the check. `color-contrast` is disabled in the ruleset (`AXE_OPTIONS` in that file) — happy-dom
can't resolve `color-mix()`/custom-property-based contrast with browser fidelity, and it's
already covered by `src/lib/contrast.ts` + `contrast.test.ts` + the `Foundations/Theming` story.
Portal-based components (Modal, ConfirmDialog, DrawerPanel, Toast) must be scanned via RTL's
`baseElement`, not `container`, since `createPortal` renders them into `document.body`.
`.storybook/preview.jsx`'s `parameters.a11y` mirrors the same rule config for the manual
`addon-a11y` panel, so the two don't disagree.

**Form components** must include:
- `aria-invalid={error || undefined}` (not `aria-invalid="false"`) — valid on `<input type="checkbox">`, `<input type="text">`, `<textarea>`, `<select>`. **Do NOT add to `<input type="radio">`** — the `radio` role does not support `aria-invalid` per WAI-ARIA spec (jsx-a11y `role-supports-aria-props` will error). For radio, error state is communicated exclusively via `aria-describedby` → `role="alert"` span at the group level.
- `aria-describedby={messageId}` linked to helper/error span
- `role="alert"` on error message spans
- `htmlFor` / `id` pairing on labels

**Decorative / loading components** (Skeleton, Spinner): add `aria-hidden="true"` — they convey no semantic content.

**Modal dialogs** (WAI-ARIA Dialog pattern):
- Save `document.activeElement` before opening — restore focus to it on close
- Focus trap: Tab cycles within modal; Shift+Tab reverses; Escape calls `onClose`
- First focusable element inside modal receives focus on open

**Interactive menus** (Dropdown — WAI-ARIA Menu Button pattern):
- Trigger: `aria-haspopup`, `aria-expanded`, `aria-controls`
- Menu: `role="menu"`, `aria-labelledby`, `aria-orientation="vertical"`
- Items: `role="menuitem"` placed **after** `{...props}` spread to always enforce it
- Dividers: `role="separator"` + `aria-orientation="horizontal"`
- Keyboard: ↑ ↓ Home End navigate items; Escape closes and returns focus to trigger

**Navigation** (Navbar — WAI-ARIA Navigation Landmark + Disclosure pattern):
- Root: `<nav aria-label="...">` landmark
- Hamburger: `aria-expanded`, `aria-controls` pointing to the mobile menu panel
- Mobile panel: conditionally rendered (not CSS hidden); closes on Escape and outside click
- NavbarItem active: `aria-current="page"`; disabled `<a>`: `aria-disabled` + `tabIndex={-1}`; disabled `<button>`: native `disabled`
- NavbarNav renders children in `<ul list-none>` with `<li className="contents">` wrappers (semantic list, transparent to layout)

**Alert** (`info/success` → `role="status"`, `warning/error` → `role="alert"`):
- `onClose` prop: renders a dismiss button with `aria-label="Cerrar alerta"` and `focus-visible:ring` per variant color
- `role="status"` (aria-live polite) for `info` / `success` — non-interrupting
- `role="alert"` (aria-live assertive) for `warning` / `error` — urgent announcements

**Toast** (Provider + hook pattern — NOT a compound component with sub-parts):
- Wrap the app with `<ToastProvider>` — renders a portal in `document.body`
- Portal container: `role="region"` + `aria-label="Notificaciones"` — `pointer-events-none` on wrapper, `pointer-events-auto` on each toast
- Individual toasts render `<Alert>` (inherits `role="status"/"alert"` per variant)
- Call `useToast().addToast({ variant, title, message, duration? })` anywhere inside the provider
- `duration: 0` → persistent (no auto-dismiss); default is 5000ms
- Enter/exit CSS transition (translate-x + opacity); progress bar tracks remaining time

**Sidebar** (WAI-ARIA Complementary Landmark + Navigation + Disclosure pattern):
- Root: `<aside aria-label="Navegación lateral">` — complementary landmark for the panel structure
- `SidebarContent` renders `<nav aria-label="Navegación">` — navigation landmark for the nav items (two distinct landmarks: aside for layout, nav for items)
- `SidebarBrand`: hidden automatically when collapsed (`return null`); supports optional `href` prop
- `SidebarTrigger`: `aria-expanded={!isCollapsed}` + `aria-controls={sidebarId}` — full ARIA disclosure widget compliance
- `SidebarGroup label="Section"`: `label` prop renders a `<p>` header (hidden when collapsed); children are wrapped in `<ul>` automatically — consumer does NOT need to provide `<ul>`
- `SidebarItem`: `<li className="contents">` wrapper; collapsed mode adds `aria-label` (string children) for screen readers + `<Tooltip>` for visual feedback
- `SidebarItem` active: `aria-current="page"`; disabled link: `aria-disabled` + `tabIndex={-1}`; disabled button: native `disabled`
- Mobile overlay: `role="presentation"` + `aria-hidden="true"`; closes on click or Escape
- `SidebarGroupLabel`: standalone label component for advanced/non-standard placement — prefer `label` prop on `SidebarGroup` for common cases

**Selectable table rows** (Table):
- `TableRow selected` prop must include `aria-selected={selected || undefined}` on `<tr>` — the `row` role supports this state

**Sortable table headers** (Table):
- `TableHeader sortable` must have `tabIndex={0}` and handle `onKeyDown` for Enter/Space — `<th>` is not natively focusable

### Story format (CSF v3)
```tsx
const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { ... },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

Use `layout: 'padded'` instead of `'centered'` for components that are wider than a button (Table, Skeleton compositions, etc.).

**Compound component stories:** when the root component has `children: ReactNode` as a required prop and stories use `render`, TypeScript requires `args` to satisfy the type. Always add `args: { children: null }` to every story — missing this causes a TS2322 build error in CI:

```tsx
export const MyStory: Story = {
  args: { children: null },  // required even when render() provides the children
  render: () => (
    <Parent>
      <Sub>content</Sub>
    </Parent>
  ),
};
```

**No Tailwind classes.** The project migrated off Tailwind entirely — `className="flex gap-4 w-80"` etc. silently does nothing (no such classes exist in any built CSS) and was a real bug found across ~20 story files (dead classNames, layouts rendering unstyled). For one-off story layout, use inline `style={{ display: 'flex', gap: '1rem', width: '320px' }}`; for anything reused many times in one file, hoist a `const` style object. Only real design tokens (`.module.css` + `var(--color-*)`) belong in components themselves.

## TypeScript

All packages use `strict: true` + `noUnusedLocals: true` + `noUnusedParameters: true`. These will fail the build — never leave unused imports or variables. `jsx: 'react-jsx'` is set everywhere, so no `import React` is needed for JSX alone. However, `import React` **is** required when using `React.FC`, `React.createContext`, `React.cloneElement`, `React.isValidElement`, or any other `React.*` API explicitly — this applies to all compound components.

## Prettier

`printWidth: 100`, `singleQuote: true`, `semi: true`, `trailingComma: 'es5'`, `tabWidth: 2`. Prettier check is **not** enforced in CI (removed from the lint job).

## Ignored directories

Never read or search inside these directories:
- `node_modules/` (any level)
- `dist/`
