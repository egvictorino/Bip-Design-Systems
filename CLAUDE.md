# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires Node >=20 and pnpm 9.15.9+)
pnpm install

# Build order matters — shared-utils must build before ui-components
pnpm --filter @bip/shared-utils build
pnpm --filter @bip/ui-components build

# Component development
pnpm --filter @bip/ui-components storybook        # http://localhost:6006
pnpm --filter @bip/ui-components build-storybook

# Lint & test (scoped)
pnpm --filter @bip/ui-components lint
pnpm --filter @bip/shared-utils test
pnpm --filter @bip/ui-components test   # component tests (vitest + happy-dom)

# All packages at once
pnpm build
pnpm lint
pnpm dev   # parallel dev mode
pnpm sync:tokens  # Regenerates tailwind.tokens.js + src/lib/cn.ts from Figma
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

## Tailwind consumer setup

`ui-components` ships a **Tailwind preset** at `@bip/ui-components/tailwind.preset`. Any project that consumes the library must configure Tailwind with this preset so the design tokens (`primary`, `txt`, `edge`, `surface-*`) resolve correctly.

```js
// tailwind.config.js (proyecto consumidor)
import bipPreset from '@bip/ui-components/tailwind.preset';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // No hace falta agregar el path de la librería — el preset lo incluye automáticamente
  ],
  presets: [bipPreset],
};
```

```css
/* src/index.css (proyecto consumidor) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

El preset resuelve el `content` path de `dist/**/*.js` con una ruta absoluta desde su propia ubicación (`import.meta.url`), por lo que funciona tanto en el monorepo como en proyectos externos instalados vía npm.

Para proyectos externos, instalar primero `tailwindcss`, `postcss` y `autoprefixer` como devDependencies.

## shared-utils (`packages/shared-utils`)

Pure TypeScript utilities — no runtime dependencies.

**Available functions:**
- `formatCurrency(amount: number): string` — formats as MXN currency using `es-MX` locale
- `formatDate(date: Date): string` — formats date using `es-MX` locale
- `validateRFC(rfc: string): boolean` — validates Mexican RFC format (uppercase only, no normalization)
  - Regex: `/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/`

**Testing:** vitest is configured. Run with `pnpm --filter @bip/shared-utils test` (21 tests).

**Build note:** `tsconfig.json` excludes `**/*.test.ts` from compilation so test files never appear in `dist/`. Do not remove this exclude.

## Component testing (`packages/ui-components`)

Test files live alongside components: `ComponentName.test.tsx`. Configured with:
- **vitest** + **happy-dom** (ESM-native DOM — do not switch to jsdom@28, it has ESM incompatibility)
- **@testing-library/react** + **@testing-library/user-event** + **@testing-library/jest-dom**
- `vitest.config.ts` at package root — sets `globals: true`, `environment: 'happy-dom'`, `setupFiles: ['./src/test-setup.ts']`
- `src/test-setup.ts` imports `@testing-library/jest-dom` to extend `expect`
- `vite-plugin-dts` excludes `**/*.test.tsx` so test files never appear in `dist/`
- `tsconfig.json` keeps test files **included** (no exclude) so the IDE resolves test imports correctly; `"types": ["vitest/globals", "@testing-library/jest-dom"]` provides global types

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
- Tests for **both** packages always run **before** build (fail-fast): `pnpm --filter @bip/shared-utils test` then `pnpm --filter @bip/ui-components test`.
- Build order in every pipeline: `shared-utils → ui-components`.

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
- **Only Tailwind** — no CSS modules, no inline styles.
- Use `cn()` from `../../lib/cn` for all conditional class composition — **never import `clsx` directly** in component files.
- Use design tokens (see below) for colors, never hardcode hex values.
- `group-has-[:checked]` and `group-has-[:focus-visible]` (Tailwind 3.4+) for custom form controls (Checkbox, Radio).

### `cn()` utility

Lives at `src/lib/cn.ts`. Combines `clsx` (conditional logic) + `extendTailwindMerge` configured with all project custom tokens so that class overrides work reliably:

```ts
import { cn } from '../../lib/cn';

className={cn('base-class', condition && 'conditional-class', className)}
```

Plain `clsx` does not resolve conflicts between same-type utilities (e.g. `w-full` vs `w-1/2` — the one that appears later in Tailwind's generated CSS wins, not the one listed last in the attribute). `cn()` guarantees the last argument wins, including for custom tokens like `bg-primary`, `text-txt`, `border-edge`.

**Mantenimiento:** cuando se agreguen nuevos tokens a `tailwind.tokens.js`, deben registrarse también en el `extendTailwindMerge` de `src/lib/cn.ts`. Si no, `cn()` no resolverá conflictos para esos tokens y los overrides fallarán silenciosamente.

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

Single source of truth: `tailwind.tokens.js` — imported by `tailwind.preset.js` (Tailwind theme) and `src/foundations/Colors.stories.tsx` (Storybook docs). To add a token: edit `tailwind.tokens.js` → register in `cn.ts`.

Token names come from `tailwind.tokens.js` (auto-generated — run `pnpm sync:tokens` to update):

```
// Interaction
active                                         (highlight/active state)
primary, primary-{hover|press}
secondary, secondary-{hover|press}
danger, danger-{hover|light|muted|press|subtle|text}
disabled                                       (bg of disabled fields)
field                                          (bg of outlined fields)
field-readonly                                 (bg of read-only fields, via read-only: pseudo)
selected                                       (bg of selected TableRow)
unique                                         (accent/unique state)

// Text
txt, txt-{black|disabled|important|secondary|utility|white}
link, link-{hover|press}

// Surface
scrim                                          (overlay backdrop)
surface-{1|2|3|4}                              (layered background levels)

// Border / Edge
edge, edge-{disabled|focus|heavy|hover|important|medium|success|unique|warning}

// Feedback
info, info-{light|subtle|text}
success, success-{light|subtle|text}
warning, warning-{light|subtle|text}
```

**Pseudo-variant states for form fields** (work automatically via HTML attributes — no extra config):
- `disabled:bg-disabled` → applied via `disabled` HTML attribute on Input, Select, Textarea
- `read-only:bg-field-readonly` → applied via `readOnly` HTML attribute on Input, Textarea

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

## TypeScript

All packages use `strict: true` + `noUnusedLocals: true` + `noUnusedParameters: true`. These will fail the build — never leave unused imports or variables. `jsx: 'react-jsx'` is set everywhere, so no `import React` is needed for JSX alone. However, `import React` **is** required when using `React.FC`, `React.createContext`, `React.cloneElement`, `React.isValidElement`, or any other `React.*` API explicitly — this applies to all compound components.

## Prettier

`printWidth: 100`, `singleQuote: true`, `semi: true`, `trailingComma: 'es5'`, `tabWidth: 2`. Prettier check is **not** enforced in CI (removed from the lint job).

## Ignored directories

Never read or search inside these directories:
- `node_modules/` (any level)
- `dist/`
