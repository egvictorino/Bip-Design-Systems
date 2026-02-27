# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires pnpm 9.15.9+)
pnpm install

# Build order matters — shared-utils must build before ui-components
pnpm --filter @pymes/shared-utils build
pnpm --filter @pymes/ui-components build
pnpm --filter @pymes/template-base build

# Component development
pnpm --filter @pymes/ui-components storybook        # http://localhost:6006
pnpm --filter @pymes/ui-components build-storybook

# Lint & test (scoped)
pnpm --filter @pymes/ui-components lint
pnpm --filter @pymes/ui-components test

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

Internal dependencies use the workspace protocol: `"@pymes/ui-components": "workspace:*"`.

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
- Use `clsx()` for all conditional class composition.
- Use design tokens (see below) for colors, never hardcode hex values.
- `group-has-[:checked]` and `group-has-[:focus-visible]` (Tailwind 3.4+) for custom form controls (Checkbox, Radio).

### Design tokens (tailwind.config.js custom colors)
```
interaction-primary-{default|hover|pressed}   → #1643A8 / #10327D / #0B2152
interaction-secondary-{default|hover|pressed} → #4B5468 / #3A404B / #282C33
interaction-tertiary-{default|hover|pressed}  → #DEE4ED / #B6BBC3 / #8E9298
interaction-disabled                          → #EFEFEF
text-primary    → #23232A
text-secondary  → #5E5E60
text-disabled   → #A6A7A8
text-white      → #FFFFFF
```

### Accessibility requirements
All form components must include:
- `aria-invalid={error || undefined}` (not `aria-invalid="false"`)
- `aria-describedby={messageId}` linked to helper/error span
- `role="alert"` on error message spans
- `htmlFor` / `id` pairing on labels

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

## TypeScript

All packages use `strict: true` + `noUnusedLocals: true` + `noUnusedParameters: true`. These will fail the build — never leave unused imports or variables. `jsx: 'react-jsx'` is set everywhere, so no `import React` is needed in component files (except `Button` which uses `React.FC` explicitly).

## Prettier

`printWidth: 100`, `singleQuote: true`, `semi: true`, `trailingComma: 'es5'`, `tabWidth: 2`. Prettier check is **not** enforced in CI (removed from the lint job).

## Ignored directories

Never read or search inside these directories:
- `node_modules/` (any level)
- `dist/`
