# BipUI — Monorepo

Design system y librería de componentes React.
Monorepo basado en **pnpm workspaces** que centraliza la librería de componentes y utilidades compartidas.

---

## Contenido

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Inicio Rápido](#inicio-rápido)
- [Comandos](#comandos)
- [Componentes UI](#componentes-ui)
- [Utilidades Compartidas](#utilidades-compartidas)
- [Tokens de Diseño](#tokens-de-diseño)
- [Estilos Tailwind en los Componentes](#estilos-tailwind-en-los-componentes)
- [Estrategia de Branches](#estrategia-de-branches)
- [CI/CD](#cicd)
- [Usar en un Proyecto Externo](#usar-en-un-proyecto-externo)

---

## Estructura del Proyecto

```
bip-ui/
└── packages/
    ├── ui-components/      # Librería de componentes React  →  @bip/ui-components
    └── shared-utils/       # Utilidades TypeScript puras    →  @bip/shared-utils
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Lenguaje | TypeScript 5 · `strict: true` |
| UI | React 18 · `react-jsx` transform |
| Estilos | Tailwind CSS 3.4 |
| Composición de clases | `clsx` + `tailwind-merge` → utilidad `cn()` |
| Build | Vite 5 + `vite-plugin-dts` |
| Documentación | Storybook 8 (CSF v3 · autodocs) |
| Package manager | pnpm 9.15.9+ |
| Linting | ESLint + `@typescript-eslint` |

> **`cn()`** — utilidad en `src/lib/cn.ts` que combina `clsx` (lógica condicional) con
> `extendTailwindMerge` (resolución de conflictos de clases, incluye tokens de diseño custom).

---

## Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Construir paquetes en orden (shared-utils primero)
pnpm --filter @bip/shared-utils build
pnpm --filter @bip/ui-components build

# 3. Abrir Storybook  →  http://localhost:6006
pnpm --filter @bip/ui-components storybook
```

---

## Comandos

### Por paquete

```bash
pnpm --filter @bip/ui-components storybook        # Dev Storybook
pnpm --filter @bip/ui-components build-storybook  # Build estático
pnpm --filter @bip/ui-components build            # Build librería
pnpm --filter @bip/ui-components lint             # Lint
pnpm --filter @bip/shared-utils test              # Tests utilidades (vitest)
pnpm --filter @bip/ui-components test             # Tests componentes (vitest + happy-dom)
```

### Monorepo completo

```bash
pnpm build   # Construye todos los paquetes
pnpm lint    # Lint en todos los proyectos
pnpm dev     # Modo desarrollo paralelo
```

---

## Componentes UI

> Storybook: <https://TU-USUARIO.github.io/bip-ui/>

### Entrada de datos

| Componente | Descripción |
|------------|-------------|
| `Button` | Botón con variantes `primary`, `secondary`, `bare`, `soul` y tamaños `sm / md / lg` |
| `Input` | Campo de texto con label, helper text, estados `error`, `disabled` y `readOnly` |
| `Textarea` | Área de texto con control de resize (`none / vertical / horizontal / both`) |
| `Select` | Selector nativo con chevron custom, variantes y accesibilidad |
| `MultiSelect` | Selector múltiple con chips, búsqueda interna y navegación por teclado |
| `Checkbox` | Checkbox accesible con soporte para estado indeterminado |
| `Radio` | Radio button con label y helper text |
| `Toggle` | Interruptor on/off con label integrado |
| `DatePicker` | Selector de fecha con calendario, rangos min/max y accesibilidad completa |
| `TimePicker` | Selector de hora con columnas H/M scrollables y `step` configurable |
| `DateRangePicker` | Selector de rango de fechas (inicio + fin) con dos calendarios |
| `Calendar` | Calendario standalone reutilizable |
| `FileUpload` | Zona de arrastre y selección de archivos |
| `SearchInput` | Input con icono de búsqueda integrado |

### Retroalimentación

| Componente | Descripción |
|------------|-------------|
| `Alert` | Mensajes de estado con variantes `info`, `success`, `warning`, `error`; botón dismiss (`onClose`); `role="status"` (info/success) o `role="alert"` (warning/error) |
| `Toast` | Notificaciones flotantes vía `<ToastProvider>` + hook `useToast()` — auto-dismiss con barra de progreso, máx. simultáneos configurable |
| `Badge` | Etiqueta compacta con variantes semánticas y punto indicador opcional |
| `Spinner` | Indicador de carga animado con tamaños y colores |
| `Skeleton` | Placeholder de carga con variantes `text`, `circle`, `rect` y prop `lines` |
| `ProgressBar` | Barra de progreso con variantes de color y animación |

### Contenido y datos

| Componente | Descripción |
|------------|-------------|
| `Card` | Tarjeta compuesta: `CardHeader`, `CardBody`, `CardFooter` |
| `Table` | Tabla responsiva: `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` — soporta ordenamiento, striped, compact y filas seleccionables (`selected`) |
| `DataTable` | Tabla avanzada con paginación, ordenamiento y filtrado integrados |
| `StatsCard` | Tarjeta de estadística con valor principal, etiqueta y tendencia |
| `Avatar` / `AvatarGroup` | Avatar de usuario con imagen o iniciales; `AvatarGroup` para apilado con desbordamiento |
| `Timeline` / `TimelineItem` | Línea de tiempo vertical con ítems personalizables |
| `Stepper` / `StepperStep` | Indicador de pasos tipo wizard con estados completado/activo/pendiente |

### Navegación

| Componente | Descripción |
|------------|-------------|
| `Navbar` | Barra de navegación compound: `NavbarBrand`, `NavbarNav`, `NavbarItem`, `NavbarActions` — sticky, responsive con menú hamburguesa, navegación accesible (WAI-ARIA Navigation + Disclosure) |
| `Breadcrumb` | Ruta de navegación con separador configurable |
| `Tabs` | Pestañas accesibles: `TabList`, `Tab`, `TabPanel` |
| `Pagination` | Paginador con salto a primera/última página |
| `Dropdown` | Menú desplegable compound: `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownDivider` — navegación por teclado completa |
| `Accordion` | Panel expandible compound: `AccordionItem`, `AccordionTrigger`, `AccordionContent` |

### Overlay

| Componente | Descripción |
|------------|-------------|
| `Modal` | Diálogo con focus trap y portal: `ModalHeader`, `ModalBody`, `ModalFooter` |
| `ConfirmDialog` | Diálogo de confirmación con acciones positiva/negativa |
| `DrawerPanel` | Panel deslizable lateral con overlay de fondo |
| `Tooltip` | Tooltip posicionable con delay configurable |

### Navegación lateral

| Componente | Descripción |
|------------|-------------|
| `Sidebar` | Panel lateral compound: `SidebarHeader`, `SidebarBrand`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarItem`, `SidebarFooter`, `SidebarTrigger` — colapsable (w-60↔w-16), drawer móvil, Tooltip en ítems colapsados |

### Utilidades y Misceláneos

| Componente | Descripción |
|------------|-------------|
| `Divider` | Línea separadora horizontal o vertical con etiqueta opcional |
| `EmptyState` | Estado vacío con icono, título, descripción y acción principal |
| `Odontogram` | Odontograma interactivo para registrar condiciones dentales por pieza |

---

## Utilidades Compartidas

`@bip/shared-utils` — utilidades TypeScript puras, sin dependencias de runtime.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `formatCurrency` | `(amount: number) => string` | Formatea como moneda MXN con locale `es-MX` |
| `formatDate` | `(date: Date) => string` | Formatea fecha con locale `es-MX` |
| `validateRFC` | `(rfc: string) => boolean` | Valida formato RFC mexicano (solo mayúsculas, sin normalización) |

```ts
import { formatCurrency, formatDate, validateRFC } from '@bip/shared-utils';

formatCurrency(1500);           // "$1,500.00"
formatDate(new Date(2026, 5, 15)); // "15/6/2026"
validateRFC('ABC800101AA1');    // true
validateRFC('abc800101AA1');    // false — no acepta minúsculas
```

---

## Tokens de Diseño

Fuente única de verdad: `packages/ui-components/tailwind.tokens.js` — **generado automáticamente** con `pnpm sync:tokens` desde Figma. No editar manualmente. Importado por `tailwind.preset.js` (tema Tailwind) y `Colors.stories.tsx` (documentación Storybook).

```
// Interaction
active                                         (estado activo/resaltado)
primary, primary-{hover|press}
secondary, secondary-{hover|press}
danger, danger-{hover|light|muted|press|subtle|text}
disabled                                       (fondo campos deshabilitados)
field                                          (fondo campos outlined)
field-readonly                                 (fondo campos read-only)
selected                                       (fondo TableRow seleccionado)
unique                                         (color acento único)

// Text
txt, txt-{black|disabled|important|secondary|utility|white}
link, link-{hover|press}

// Surface
scrim                                          (fondo overlay)
surface-{1|2|3|4}                              (capas de fondo)

// Border / Edge
edge, edge-{disabled|focus|heavy|hover|important|medium|success|unique|warning}

// Feedback
info, info-{light|subtle|text}
success, success-{light|subtle|text}
warning, warning-{light|subtle|text}
```

> Para agregar un token: editar `tailwind.tokens.js` → ejecutar `pnpm sync:tokens` (actualiza también `src/lib/cn.ts`).
> Nunca editar `tailwind.tokens.js` ni `src/lib/cn.ts` manualmente.

---

## Estilos Tailwind en los Componentes

Los estilos de todos los componentes se basan exclusivamente en **clases Tailwind** — sin CSS modules ni estilos inline. Los colores del sistema parten de tokens de diseño custom registrados en Tailwind.

### Dónde vive cada pieza

| Archivo | Rol |
|---------|-----|
| `packages/ui-components/tailwind.tokens.js` | **Fuente de verdad** — define todos los tokens de color (`primary`, `txt`, `edge`, `surface-*`, etc.). Generado automáticamente con `pnpm sync:tokens`. |
| `packages/ui-components/tailwind.preset.js` | Registra los tokens en el tema de Tailwind. Exportado en `@bip/ui-components/tailwind.preset` para que proyectos consumidores los usen. |
| `packages/ui-components/src/lib/cn.ts` | Utilidad `cn()` — combina `clsx` (lógica condicional) con `extendTailwindMerge` (resolución de conflictos para tokens custom). Generada automáticamente junto con los tokens. |
| `src/components/**/*.tsx` | Componentes — usan `cn()` con clases Tailwind estándar y tokens custom. Nunca importan `clsx` directamente. |
| `src/foundations/Colors.stories.tsx` | Documentación visual de todos los tokens en Storybook. |

### Cómo se usan los tokens en los componentes

Los tokens se usan como cualquier clase Tailwind, con los prefijos habituales (`bg-`, `text-`, `border-`, `ring-`):

```tsx
// Fondo de botón primario
className="bg-primary hover:bg-primary-hover active:bg-primary-press"

// Texto
className="text-txt"            // texto principal
className="text-txt-secondary"  // texto secundario
className="text-txt-disabled"   // texto deshabilitado

// Bordes
className="border-edge focus:border-edge-focus"

// Superficies / capas de fondo
className="bg-surface-1"        // fondo base
className="bg-surface-2"        // capa elevada

// Feedback
className="bg-danger text-danger-text"
className="bg-success-light text-success-text"
```

### Flujo de actualización de tokens

```
Figma  →  pnpm sync:tokens  →  tailwind.tokens.js + src/lib/cn.ts  →  pnpm build
```

> `pnpm sync:tokens` regenera `tailwind.tokens.js` y `src/lib/cn.ts` de forma sincronizada.
> Nunca edites esos dos archivos manualmente — los cambios manuales se perderán en el siguiente sync.

---

## Estrategia de Branches

```
main (producción)  ←  qa (testing)  ←  dev (desarrollo)  ←  feature/xxx
```

Los PRs siempre siguen el flujo `feature/xxx → dev → qa → main`.

### Flujo de trabajo

```bash
# 1. Nueva feature
git checkout dev
git checkout -b feature/nombre-feature
# ... cambios ...
git commit -m "feat: descripción"
git push origin feature/nombre-feature
# Crear PR: feature/nombre-feature → dev

# 2. Release a QA
# Crear PR: dev → qa  (deploy automático al hacer merge)

# 3. Release a producción
# Crear PR: qa → main  (deploy automático al hacer merge)
```

### Hotfixes

Para bugs críticos en producción:

```bash
git checkout main
git checkout -b hotfix/nombre-fix
# ... fix ...
git commit -m "hotfix: descripción"
# PR: hotfix/nombre-fix → main
# Después: cherry-pick de vuelta a qa y dev
```

### Ambientes

| Branch | Ambiente | Storybook | Deploy |
|--------|----------|-----------|--------|
| `main` | Producción | [GitHub Pages](https://tu-usuario.github.io/bip-ui/) | Automático |
| `qa` | Testing | (por configurar) | Automático |
| `dev` | Desarrollo | (por configurar) | Automático |

---

## CI/CD

Cuatro workflows de GitHub Actions, uno por ambiente:

| Workflow | Trigger | Pasos clave |
|----------|---------|-------------|
| `pr-validation.yml` | PR a cualquier rama | validación de branch → lint → **tests** → build |
| `dev.yml` | push/PR a `dev` | lint → **tests** → build → storybook preview |
| `qa.yml` | push/PR a `qa` | security audit · lint → **tests** → build → storybook QA |
| `production.yml` | push/PR a `main` | security · lint → **tests** → type-check → build → GitHub Pages → release tag |

**Reglas del pipeline:**
- Todos los workflows instalan dependencias con `--frozen-lockfile` para garantizar reproducibilidad.
- Los tests siempre se ejecutan **antes** del build (fail-fast).
- Orden de build garantizado: `shared-utils → ui-components`.

---

## Usar en un Proyecto Externo

Pasos para consumir BipUI desde un repositorio independiente.

### 1. Instalar los paquetes

**Desde GitHub (sin publicar en npm):**

```bash
# Con pnpm
pnpm add github:TU-ORG/bip-ui#main --filter @bip/ui-components
pnpm add github:TU-ORG/bip-ui#main --filter @bip/shared-utils
```

**Desde npm / registro privado (cuando se publique):**

```bash
pnpm add @bip/ui-components @bip/shared-utils
```

### 2. Instalar las peer dependencies

```bash
pnpm add react react-dom
pnpm add -D tailwindcss postcss autoprefixer
```

### 3. Configurar Tailwind

```js
// tailwind.config.js
import bipPreset from '@bip/ui-components/tailwind.preset';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // El preset ya incluye automáticamente el path de la librería
  ],
  presets: [bipPreset],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Usar los componentes

```tsx
import { Button, Input, ToastProvider, useToast } from '@bip/ui-components';
import { formatCurrency, validateRFC } from '@bip/shared-utils';

// Wrap the app root with ToastProvider
export const App = () => (
  <ToastProvider>
    <MiPagina />
  </ToastProvider>
);

export const MiPagina = () => {
  const { addToast } = useToast();
  return (
    <div>
      <Input label="RFC" />
      <Button variant="primary" onClick={() => addToast({ variant: 'success', message: '¡Guardado!' })}>
        Guardar
      </Button>
      <p>{formatCurrency(1500)}</p>
    </div>
  );
};
```

---

## Licencia

Privado — Todos los derechos reservados.
