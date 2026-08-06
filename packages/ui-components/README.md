# @bip-design-systems/ui-components

React component library with full TypeScript support, CSS Modules, and design tokens. Built for the BipUI design system.

[![npm version](https://img.shields.io/npm/v/@bip-design-systems/ui-components)](https://www.npmjs.com/package/@bip-design-systems/ui-components)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/egvictorino/bip-ui/blob/main/LICENSE)

---

## Requirements

- React 18+
- Node >= 20

## Installation

```bash
pnpm add @bip-design-systems/ui-components
# or
npm install @bip-design-systems/ui-components
```

## Setup

Import the compiled CSS in your app entry point. No Tailwind or other CSS tooling required.

```ts
// src/main.tsx (or index.tsx)
import '@bip-design-systems/ui-components/style.css';
```

## Quick Start

```tsx
import { Button, Input, ThemeProvider, ToastProvider, useToast } from '@bip-design-systems/ui-components';

// ThemeProvider is optional — without it, the default theme is square/light.
export const App = () => (
  <ThemeProvider theme="rounded">
    <ToastProvider>
      <MyPage />
    </ToastProvider>
  </ThemeProvider>
);

const MyPage = () => {
  const { addToast } = useToast();
  return (
    <div>
      <Input label="Nombre" />
      <Button
        variant="primary"
        onClick={() => addToast({ variant: 'success', title: '¡Guardado!', message: 'Los cambios fueron guardados.' })}
      >
        Guardar
      </Button>
    </div>
  );
};
```

---

## Components

### Form inputs

| Component | Description |
|-----------|-------------|
| `Button` | `primary`, `secondary`, `bare`, `soul` variants · `sm / md / lg` sizes |
| `Input` | Text field with label, helper text, `error`, `disabled`, `readOnly` states |
| `Textarea` | Text area with resize control (`none / vertical / horizontal / both`) |
| `Select` | Native select with custom chevron, variants, and accessibility |
| `MultiSelect` | Multi-value select with chips, internal search, and keyboard navigation |
| `Checkbox` | Accessible checkbox with indeterminate state support |
| `CheckboxGroup` | Group of related checkboxes |
| `Radio` | Radio button with label and helper text |
| `Toggle` | On/off switch with integrated label |
| `DatePicker` | Date picker with calendar, min/max range, and full accessibility |
| `TimePicker` | Time picker with scrollable H/M columns and configurable `step` |
| `DateRangePicker` | Date range picker (start + end) with dual calendars |
| `Calendar` | Standalone reusable calendar |
| `FileUpload` | Drag-and-drop file upload zone |
| `SearchInput` | Input with integrated search icon |

### Feedback

| Component | Description |
|-----------|-------------|
| `Alert` | Status messages: `info`, `success`, `warning`, `error` · dismiss button · `role="status"/"alert"` |
| `Toast` | Floating notifications via `<ToastProvider>` + `useToast()` hook · auto-dismiss with progress bar |
| `Badge` | Compact label with semantic variants and optional dot indicator |
| `Spinner` | Animated loading indicator with sizes and colors |
| `Skeleton` | Loading placeholder: `text`, `circle`, `rect` variants |
| `ProgressBar` | Progress bar with color variants and animation |

### Content & data

| Component | Description |
|-----------|-------------|
| `Card` | Compound card: `CardHeader`, `CardBody`, `CardFooter` |
| `Table` | Responsive table: `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` · sortable, striped, compact, selectable rows |
| `DataTable` | Advanced table with pagination, sorting, and integrated filtering |
| `StatsCard` | Stat card with main value, label, and trend |
| `Avatar` / `AvatarGroup` | User avatar with image or initials; `AvatarGroup` for stacked overflow |
| `Timeline` / `TimelineItem` | Vertical timeline with customizable items |
| `Stepper` / `StepperStep` | Wizard step indicator with completed/active/pending states |

### Navigation

| Component | Description |
|-----------|-------------|
| `Navbar` | Compound navigation bar: `NavbarBrand`, `NavbarNav`, `NavbarItem`, `NavbarActions` · sticky, responsive hamburger menu |
| `Breadcrumb` | Navigation breadcrumb with configurable separator |
| `Tabs` | Accessible tabs: `TabList`, `Tab`, `TabPanel` |
| `Pagination` | Paginator with first/last page jump |
| `Dropdown` | Compound dropdown menu: `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownDivider` · full keyboard navigation |
| `Accordion` | Expandable panel compound: `AccordionItem`, `AccordionTrigger`, `AccordionContent` |

### Overlay

| Component | Description |
|-----------|-------------|
| `Modal` | Dialog with focus trap and portal: `ModalHeader`, `ModalBody`, `ModalFooter` |
| `ConfirmDialog` | Confirmation dialog with positive/negative actions |
| `DrawerPanel` | Side sliding panel with background overlay |
| `Tooltip` | Positionable tooltip with configurable delay |

### Sidebar

| Component | Description |
|-----------|-------------|
| `Sidebar` | Compound sidebar: `SidebarHeader`, `SidebarBrand`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarItem`, `SidebarFooter`, `SidebarTrigger` · collapsible (w-60↔w-16), mobile drawer |

### Utilities

| Component | Description |
|-----------|-------------|
| `Divider` | Horizontal or vertical divider with optional label |
| `EmptyState` | Empty state with icon, title, description, and primary action |
| `Odontogram` | Interactive odontogram for recording dental conditions per tooth |
| `ThemeProvider` | Theme provider — controls shape (`square`/`rounded`), color scheme (`light`/`dark`), and brand (`tokens`). See [Theming](#theming) |

---

## Theming

Three independent axes, all controlled by `<ThemeProvider>` — no build config or Tailwind required.

| Axis | Prop | Values | Affects |
|------|------|--------|---------|
| Shape / typography | `theme` | `square` \| `rounded` | `--radius-*`, `--font-sans` |
| Color scheme | `colorScheme` | `light` \| `dark` (default `light`) | The full `--color-*` palette |
| Brand | `tokens` | seed overrides (below) | `--color-primary`, `--color-danger`, etc. and their whole derived family |

```tsx
import { ThemeProvider } from '@bip-design-systems/ui-components';

export const App = () => (
  <ThemeProvider theme="rounded" colorScheme="dark">
    <MyApp />
  </ThemeProvider>
);
```

### Custom branding (`tokens`)

Ant Design `ConfigProvider`-style: pass a color and the whole library recolors — hover, press, focus ring, text and light/subtle variants are derived automatically.

```tsx
<ThemeProvider
  theme="rounded"
  tokens={{
    colorPrimary: '#e2007a',
    colorDanger: '#d6336c',
    // optional per-scheme refinement — wins over the flat value
    dark: { colorPrimary: '#ff4fa8' },
  }}
>
  <MyApp />
</ThemeProvider>
```

- Available seeds: `colorPrimary`, `colorSecondary`, `colorDanger`, `colorInfo`, `colorSuccess`, `colorWarning`, `colorUnique`, `colorLink`, `colorTxt`, `colorSurface`, `colorEdge`, `colorField`, `fontFamily`.
- `cssVars` is the escape hatch for any custom property outside that list: `cssVars={{ '--color-selected': '#...' }}`.
- Nested `<ThemeProvider>`s merge with their parent — an inner one only overrides what it declares.
- Portalled components (`Modal`, `Toast`, `DrawerPanel`, `Calendar`, `Odontogram` popovers) correctly inherit the brand even though they render outside the provider's DOM tree.

**Automatic contrast.** Overriding `colorPrimary`, `colorDanger`, `colorSuccess`, `colorWarning`, `colorInfo`, or `colorUnique` also computes WCAG contrast (`src/lib/contrast.ts`) and picks white or dark text automatically — a light `colorPrimary` won't leave the primary button with illegible white text. Migrated components: `Button`, `Avatar`, `Stepper`, `Sidebar` (`variant="primary"`).

**Brand radius.** Besides the `theme` preset, any of the 6 semantic radius tokens can be overridden independently:

```tsx
<ThemeProvider theme="rounded" radius={{ field: '12px', container: '24px' }}>
```

Keys: `marker`, `field`, `control`, `surface`, `container`, `containerLg`.

### Uncontrolled mode, `system`, and persistence

Without `theme`/`colorScheme`, `ThemeProvider` manages its own state (`defaultTheme`/`defaultColorScheme`) and exposes controls via `useThemeControls()` — useful for a toggle button without lifting state into your app:

```tsx
import { ThemeProvider, useThemeControls } from '@bip-design-systems/ui-components';

const ToggleButton = () => {
  const { resolvedColorScheme, toggleColorScheme } = useThemeControls();
  return <button onClick={toggleColorScheme}>{resolvedColorScheme === 'dark' ? '🌙' : '☀️'}</button>;
};

export const App = () => (
  <ThemeProvider defaultTheme="square" defaultColorScheme="system" storageKey="my-app-theme">
    <ToggleButton />
    <MyApp />
  </ThemeProvider>
);
```

- `colorScheme`/`defaultColorScheme` accept `'system'` — follows OS `prefers-color-scheme` live. Never stamped as `'system'` in the DOM, always the resolved value (`light`/`dark`).
- `storageKey` persists the preference to `localStorage` (best-effort — won't throw in Safari private mode).
- A controlled axis (`colorScheme` passed as a prop) always wins over internal state and over anything persisted.

**Avoiding the theme flash (FOUC) with SSR.** The server's first paint doesn't know the `localStorage` preference; use `getThemeInitScript()` to stamp `data-theme`/`data-color-scheme` on `<html>` before hydration:

```tsx
// Next.js App Router — app/layout.tsx
import { getThemeInitScript } from '@bip-design-systems/ui-components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: 'my-app-theme' }) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`storageKey` must match the one passed to `<ThemeProvider>`.

See the `Components/ThemeProvider` story in Storybook for interactive demos (includes `CustomBrand`, `UncontrolledWithPersistence`, and `SystemColorScheme`).

---

## Peer dependencies

```json
{
  "react": ">=18",
  "react-dom": ">=18"
}
```

---

## Browser support

The color system is built on native CSS `color-mix()` — no fallback bundle is shipped, so the
minimum supported browsers are:

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 111+ |
| Safari | 16.2+ |
| Firefox | 113+ |

All released in 2023 or later. If you need to support older browsers, do not upgrade past
`@bip-design-systems/ui-components@0.2.x` without verifying `color-mix()` support in your target
matrix first.

## Fonts

Inter and Figtree ship self-hosted (`@fontsource-variable`) inside `style.css` — no request to
`fonts.googleapis.com`, so the library works under a strict CSP with no extra network round-trip.
Only the `latin`/`latin-ext` Unicode subsets are included (full weight axis 100–900, normal +
italic) — Cyrillic/Greek/Vietnamese are not bundled. `style.css` is ~800KB as a result; if that's
too heavy for your use case, override `--font-sans` via `ThemeProvider`'s `tokens.fontFamily` with
your own font loading strategy.

---

## Links

- [Repository](https://github.com/egvictorino/bip-ui)
- [shared-utils](https://www.npmjs.com/package/@bip-design-systems/shared-utils) — pure TypeScript utilities (formatCurrency, formatDate, validateRFC)

---

## License

[MIT](https://github.com/egvictorino/bip-ui/blob/main/LICENSE) — Copyright (c) 2026 Eduardo Gonzalez
