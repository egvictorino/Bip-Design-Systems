# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires pnpm 9.15.9+)
pnpm install

# Build order matters — shared-utils must build before ui-components
pnpm --filter @bip/shared-utils build
pnpm --filter @bip/ui-components build
pnpm --filter @bip/template-base build

# Component development
pnpm --filter @bip/ui-components storybook        # http://localhost:6006
pnpm --filter @bip/ui-components build-storybook

# Lint & test (scoped)
pnpm --filter @bip/ui-components lint
pnpm --filter @bip/ui-components test

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

- `packages/ui-components` — React component library. Main deliverable. Builds to `dist/index.{es,umd}.js` + types.
- `packages/shared-utils` — Pure TypeScript utilities (formatting, validation). No runtime deps.
- `apps/template-base` — Starter app for new clients. Consumes both packages via `workspace:*`.

Internal dependencies use the workspace protocol: `"@bip/ui-components": "workspace:*"`.

## Tailwind consumer setup

`ui-components` ships a **Tailwind preset** at `@bip/ui-components/tailwind.preset`. Any project that consumes the library must configure Tailwind with this preset so the design tokens (`interaction-*`, `text-*`) resolve correctly.

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

`template-base` ya tiene esta configuración lista como referencia. Para proyectos externos (fuera del monorepo), instalar primero `tailwindcss`, `postcss` y `autoprefixer` como devDependencies.

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
export const Component = forwardRef<HTMLInputElement, ComponentProps>(
  ({ size = 'md', label, error = false, disabled = false, id, ...props }, ref) => {
    const componentId = id || (label ? `prefix-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    ...
  }
);
Component.displayName = 'Component';
```

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

Plain `clsx` does not resolve conflicts between same-type utilities (e.g. `w-full` vs `w-1/2` — the one that appears later in Tailwind's generated CSS wins, not the one listed last in the attribute). `cn()` guarantees the last argument wins, including for custom tokens like `bg-interaction-*`, `text-text-*`, `border-interaction-*`.

**Mantenimiento:** cuando se agreguen nuevos tokens a `tailwind.tokens.js`, deben registrarse también en el `extendTailwindMerge` de `src/lib/cn.ts`. Si no, `cn()` no resolverá conflictos para esos tokens y los overrides fallarán silenciosamente.

### Compound component pattern

Use when a component has multiple named sub-parts that share internal state (examples: Modal, Tabs, Dropdown). All three already exist as references.

```tsx
// 1. Context with null default + error guard hook
const MyContext = createContext<MyContextValue | null>(null);
const useMyContext = () => {
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

```
// Interaction
interaction-primary-{default|hover|pressed}    → #1643A8 / #10327D / #0B2152
interaction-secondary-{default|hover|pressed}  → #4B5468 / #3A404B / #282C33
interaction-tertiary-{default|hover|pressed}   → #DEE4ED / #B6BBC3 / #8E9298
interaction-disabled                           → #EFEFEF   (bg of disabled fields)
interaction-field                              → #FCFCFC   (bg of outlined fields)
interaction-field-readonly                     → #F2F2F2   (bg of read-only fields, via read-only: pseudo)
interaction-selected                           → #E4FCFF   (bg of selected TableRow)

// Text
text-primary    → #23232A
text-secondary  → #5E5E60
text-disabled   → #A6A7A8
text-white      → #FFFFFF

// Feedback
feedback-error-{default|light|subtle|muted|text}     → #EF4444 / #FEF2F2 / #FEE2E2 / #FECACA / #B91C1C
feedback-success-{default|light|subtle|text}         → #22C55E / #F0FDF4 / #DCFCE7 / #15803D
feedback-warning-{default|light|subtle|text}         → #EAB308 / #FEFCE8 / #FEF9C3 / #A16207
feedback-info-{light|subtle|text}                    → #EFF6FF / #DBEAFE / #1D4ED8
```

**Pseudo-variant states for form fields** (work automatically via HTML attributes — no extra config):
- `disabled:bg-interaction-disabled` → applied via `disabled` HTML attribute on Input, Select, Textarea
- `read-only:bg-interaction-field-readonly` → applied via `readOnly` HTML attribute on Input, Textarea

### Accessibility requirements

**Form components** must include:
- `aria-invalid={error || undefined}` (not `aria-invalid="false"`)
- `aria-describedby={messageId}` linked to helper/error span
- `role="alert"` on error message spans
- `htmlFor` / `id` pairing on labels

**Decorative / loading components** (Skeleton, Spinner): add `aria-hidden="true"` — they convey no semantic content.

**Interactive menus** (Dropdown — WAI-ARIA Menu Button pattern):
- Trigger: `aria-haspopup`, `aria-expanded`, `aria-controls`
- Menu: `role="menu"`, `aria-labelledby`, `aria-orientation="vertical"`
- Items: `role="menuitem"` placed **after** `{...props}` spread to always enforce it
- Dividers: `role="separator"` + `aria-orientation="horizontal"`
- Keyboard: ↑ ↓ Home End navigate items; Escape closes and returns focus to trigger

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
