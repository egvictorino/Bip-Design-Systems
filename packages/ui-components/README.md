# @bip-design-systems/ui-components

React component library with full TypeScript support, CSS Modules, and design tokens. Built for the BipUI design system.

[![npm version](https://img.shields.io/npm/v/@bip-design-systems/ui-components)](https://www.npmjs.com/package/@bip-design-systems/ui-components)
[![license](https://img.shields.io/badge/license-Private-red)](https://github.com/egvictorino/bip-ui)

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
import { Button, Input, ToastProvider, useToast } from '@bip-design-systems/ui-components';

export const App = () => (
  <ToastProvider>
    <MyPage />
  </ToastProvider>
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

---

## Peer dependencies

```json
{
  "react": ">=18",
  "react-dom": ">=18"
}
```

---

## Links

- [Storybook](https://egvictorino.github.io/bip-ui/) — live component documentation
- [Repository](https://github.com/egvictorino/bip-ui)
- [shared-utils](https://www.npmjs.com/package/@bip-design-systems/shared-utils) — pure TypeScript utilities (formatCurrency, formatDate, validateRFC)

---

## License

Private — All rights reserved.
