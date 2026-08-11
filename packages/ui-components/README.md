# @bip-design-systems/ui-components

React component library with full TypeScript support, CSS Modules, and design tokens. Built for the BipUI design system.

[![npm version](https://img.shields.io/npm/v/@bip-design-systems/ui-components)](https://www.npmjs.com/package/@bip-design-systems/ui-components)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/egvictorino/Bip-Design-Systems/blob/main/LICENSE)

---

## Requirements

- React `^18.2.0` or `^19.0.0`
- Node >= 20
- ESM only — no CommonJS build is shipped (`"type": "module"`, `dist/` is ES modules). Works
  out of the box with any modern bundler/framework (Vite, Next.js App Router, Remix). If your
  toolchain requires `require()`, you'll need an ESM-aware bundler or a dynamic `import()` bridge.

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

**Subpath exports.** Besides importing from the package root, every component is importable
individually (the build emits one file per component, `preserveModules: true`):

```ts
import { Button } from '@bip-design-systems/ui-components/Button';
```

This `./*` wildcard only covers components (`dist/components/*/*.js`) — hooks (`useDisclosure`,
`useFocusTrap`, ...), `cn`, `contrastRatio`, and the i18n exports (`esMX`, `enUS`,
`useBipLocale`, `mergeLocale`) don't have their own deep-import subpaths and must be imported
from the package root instead.

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

### Layout & typography

| Component | Description |
|-----------|-------------|
| `Stack` | Flexbox layout (row/column) with `gap`, `align`, `justify` — replaces repeated inline styles |
| `Grid` | CSS grid layout with responsive columns and `gap` |
| `Container` | Centered max-width wrapper with side padding, for constraining content width |
| `Text` | Body text with size/weight/color variants driven by tokens |
| `Heading` | Semantic `h1`–`h6` headings, decoupled from visual size |

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
| `Slider` | `<input type="range">` with label, helper text, `error`, and an optional live value display |
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
| `Link` | Styled anchor · `underline` (`always`/`hover`/`none`), `disabled`, `external` (adds `target="_blank"`, `rel="noopener noreferrer"`, and an accessible "opens in a new tab" hint) |

### Overlay

| Component | Description |
|-----------|-------------|
| `Modal` | Dialog with focus trap and portal: `ModalHeader`, `ModalBody`, `ModalFooter` |
| `ConfirmDialog` | Confirmation dialog with positive/negative actions |
| `DrawerPanel` | Side sliding panel with background overlay |
| `Tooltip` | Positionable tooltip with configurable delay |
| `Popover` | Generic compound overlay: `PopoverTrigger`, `PopoverContent` (`placement`: `bottom-start`/`bottom-end`/`top-start`/`top-end`) · closes on outside click and Escape |

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
| `VisuallyHidden` | Renders content in the DOM, accessible to screen readers, but visually hidden |
| `ThemeProvider` | Theme provider — controls shape (`square`/`rounded`), color scheme (`light`/`dark`), brand (`tokens`), and locale (`locale`). See [Theming](#theming) and [Internationalization](#internationalization) |

---

## Hooks

Exported from `@bip-design-systems/ui-components` (previously internal to `src/lib/`):

| Hook | Description |
|------|-------------|
| `useClickOutside` | Runs a callback on click outside a ref — used by Dropdown, MultiSelect, DatePicker, etc. |
| `useDisclosure` | Open/close state with `onOpen`/`onClose`/`onToggle` — shared pattern for overlays |
| `useFocusTrap` | Traps focus (Tab/Shift+Tab) inside a container, focuses the first element on activation, restores focus on deactivation, and handles Escape — used by Modal, DrawerPanel, Odontogram |
| `useMediaQuery` | Reactive subscription to a media query (`matchMedia`) |
| `useScrollLock` | Locks `<body>` scroll while an overlay is open |

```ts
import { useDisclosure, useMediaQuery, cn } from '@bip-design-systems/ui-components';
```

`cn()` (a `clsx` wrapper for CSS Module class composition) and `BREAKPOINTS`/`mediaQuery` (the
single source for the `@media` queries used internally, see `src/styles/breakpoints.ts`) are
also exported from the package root.

---

## Internationalization

Every `aria-label`, placeholder, and visible string in the components comes from a dictionary
(`BipLocale`) resolved through context — nothing is hardcoded in Spanish without a way to
override it. The unconfigured default is `es-MX`, byte-identical to the library's previous
hardcoded behavior — no visual change for existing consumers.

```tsx
import { ThemeProvider, enUS } from '@bip-design-systems/ui-components';

<ThemeProvider theme="rounded" locale={enUS}>
  <App />
</ThemeProvider>

// Partial override on top of the es-MX default — only what you need to change
<ThemeProvider locale={{ alert: { close: 'Dismiss' } }}>
  <App />
</ThemeProvider>
```

- `locale` is a sibling prop to `theme`/`tokens`/`radius` on `<ThemeProvider>` — accepts the full
  dictionary (`esMX`, `enUS`, both exported by the package) or a partial override that merges
  over the parent `<ThemeProvider>`'s resolved dictionary (if nested), or over `esMX` otherwise.
- The dictionary carries a BCP-47 tag (`locale: 'es-MX'` / `'en-US'`) that also drives the
  `Intl.DateTimeFormat` calls used internally by `Calendar`, `DatePicker`, and
  `DateRangePicker` — changing locale reformats dates/months too, not just labels.
- Without a `<ThemeProvider>` in the tree (or without the `locale` prop), every component still
  works, defaulting to `es-MX` via `useBipLocale()`.
- To write your own dictionary (a full additional language, not just an override), import the
  `BipLocale` type and use `esMX`/`enUS` as a shape reference.
- `mergeLocale(base, override?)` — the same one-level merge `<ThemeProvider>` uses internally — is
  exported from the package root too, for composing a `PartialBipLocale` override on top of a full
  dictionary outside of `<ThemeProvider>` (e.g. to precompute a locale before passing it down).
- See the `Foundations/I18n` story in Storybook for a live playground.

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

> `ThemeProvider` declares `"use client"` — safe to render from a Next.js App Router Server
> Component (import it from a component marked `"use client"`, or let `ThemeProvider` itself be
> the client/server boundary in your layout).

---

## Peer dependencies

```json
{
  "react": "^18.2.0 || ^19.0.0",
  "react-dom": "^18.2.0 || ^19.0.0"
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

## Migration 0.4.x → 0.5.0

`0.5.0` unifies inconsistent prop names/values across sibling components ahead of a `1.0.0` API
freeze. All changes below are breaking; see `CHANGELOG.md` for the full list including additive
(non-breaking) changes.

| Component | Before | After |
|---|---|---|
| `Alert`, `Toast`, `Badge`, `ProgressBar`, `Timeline`, `Tooltip` | `variant="error"` | `variant="danger"` |
| `Stepper`'s `StepperStep` | `status="error"` (and `status="success"` etc.) | `variant="danger"` (and `variant="success"` etc.) |
| `Dropdown`'s `DropdownItem` | `danger` (boolean) | `variant="danger"` |
| `Spinner` | `variant="white"` | `variant="inverse"` |
| `Modal`, `ConfirmDialog`, `Sidebar` (mobile drawer) | `isOpen` | `open` (`onClose` unchanged) |
| `NumberInput` | `onChange={(value, event) => ...}` | `onChange={(value) => ...}` |
| `Pagination` | `currentPage` | `page` |
| `DataTable` | `onPageChange={(page, pageSize) => ...}` | `onPageChange={(page) => ...}` + `onPageSizeChange={(pageSize) => ...}` |
| `DataTable` | `onSearchChange` | `onSearch` |
| `DataTable` | `label` (was actually an accessible name) | `aria-label` |
| `Calendar` | `onRangeSelect={(start, end) => ...}` | `onRangeSelect={(range: DateRange) => ...}` |
| `Text` | `size="base"` | `size="md"` |
| `StatsCard` | `variant="filled"` | `variant="flat"` |
| `Odontogram` | `readOnly` | `disabled` |

`Dropdown` and `Popover` gain optional `open`/`defaultOpen`/`onOpenChange` (additive — existing
uncontrolled usage keeps working unchanged). `DrawerPanel` and `Tooltip` gain `onOpenChange`.
`Sidebar` gains `collapsed`/`onCollapsedChange` alongside the existing `defaultCollapsed`. `Modal`
gains a convenience `title` prop and now forwards `style`/`id`/`data-*`/`aria-*`; `ConfirmDialog`
now accepts `className` and other `HTMLAttributes`.

---

## Links

- [Repository](https://github.com/egvictorino/Bip-Design-Systems)
- [shared-utils](https://www.npmjs.com/package/@bip-design-systems/shared-utils) — pure TypeScript utilities (formatCurrency, formatDate, validateRFC)

---

## License

[MIT](https://github.com/egvictorino/Bip-Design-Systems/blob/main/LICENSE) — Copyright (c) 2026 Eduardo Gonzalez
