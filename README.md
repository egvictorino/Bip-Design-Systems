# Bip Design Systems — Monorepo

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
- [Hooks](#hooks)
- [Tokens de Diseño](#tokens-de-diseño)
- [CSS Modules y Tokens de Diseño](#css-modules-y-tokens-de-diseño)
- [Theming](#theming)
- [Internacionalización (i18n)](#internacionalización-i18n)
- [Estrategia de Branches](#estrategia-de-branches)
- [CI/CD](#cicd)
- [Usar en un Proyecto Externo](#usar-en-un-proyecto-externo)

---

## Estructura del Proyecto

```
bip-ui/
└── packages/
    ├── ui-components/      # Librería de componentes React  →  @bip-design-systems/ui-components
    └── shared-utils/       # Utilidades TypeScript puras    →  @bip-design-systems/shared-utils
```

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Lenguaje | TypeScript 5 · `strict: true` |
| UI | React 18 · `react-jsx` transform |
| Estilos | CSS Modules + CSS Custom Properties |
| Composición de clases | `clsx` → utilidad `cn()` |
| Build | Vite 5 + `vite-plugin-dts` |
| Documentación | Storybook 8 (CSF v3 · autodocs) |
| Package manager | pnpm 9.15.9+ |
| Linting | ESLint + `@typescript-eslint` |

> **`cn()`** — utilidad en `src/lib/cn.ts`, wrapper delgado sobre `clsx` para composición condicional de clases de CSS Module.

---

## Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Construir paquetes en orden (shared-utils primero)
pnpm --filter @bip-design-systems/shared-utils build
pnpm --filter @bip-design-systems/ui-components build

# 3. Abrir Storybook  →  http://localhost:6006
pnpm --filter @bip-design-systems/ui-components storybook
```

---

## Comandos

### Por paquete

```bash
pnpm --filter @bip-design-systems/ui-components storybook        # Dev Storybook
pnpm --filter @bip-design-systems/ui-components build-storybook  # Build estático
pnpm --filter @bip-design-systems/ui-components build            # Build librería
pnpm --filter @bip-design-systems/ui-components lint             # Lint
pnpm --filter @bip-design-systems/shared-utils test              # Tests utilidades (vitest)
pnpm --filter @bip-design-systems/ui-components test             # Tests componentes (vitest + happy-dom)
pnpm --filter @bip-design-systems/ui-components test:visual      # Regresión visual del sistema de temas (Playwright)
```

### Monorepo completo

```bash
pnpm build   # Construye todos los paquetes
pnpm lint    # Lint en todos los proyectos
pnpm dev     # Modo desarrollo paralelo
```

---

## Componentes UI

> Storybook: <https://egvictorino.github.io/Bip-Design-Systems/>

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

### Layout y tipografía

| Componente | Descripción |
|------------|-------------|
| `Stack` | Layout de flexbox en columna/fila con `gap`, `align`, `justify` — reemplaza estilos inline repetidos |
| `Grid` | Layout de CSS grid con columnas responsivas y `gap` |
| `Container` | Envoltorio con `max-width` centrado y padding lateral, para limitar el ancho de contenido |
| `Text` | Texto de cuerpo con variantes de tamaño/peso/color vía tokens |
| `Heading` | Encabezados `h1`–`h6` semánticos, desacoplados del tamaño visual |

### Utilidades y Misceláneos

| Componente | Descripción |
|------------|-------------|
| `Divider` | Línea separadora horizontal o vertical con etiqueta opcional |
| `EmptyState` | Estado vacío con icono, título, descripción y acción principal |
| `Odontogram` | Odontograma interactivo para registrar condiciones dentales por pieza |
| `ThemeProvider` | Provider de tema — controla forma (`square`/`rounded`), esquema de color (`light`/`dark`) y marca (`tokens`). Ver [Theming](#theming) |

---

## Utilidades Compartidas

`@bip-design-systems/shared-utils` — utilidades TypeScript puras, sin dependencias de runtime.

| Función | Firma | Descripción |
|---------|-------|-------------|
| `formatCurrency` | `(amount: number) => string` | Formatea como moneda MXN con locale `es-MX` |
| `formatDate` | `(date: Date) => string` | Formatea fecha con locale `es-MX` |
| `validateRFC` | `(rfc: string) => boolean` | Valida formato RFC mexicano (solo mayúsculas, sin normalización) |

```ts
import { formatCurrency, formatDate, validateRFC } from '@bip-design-systems/shared-utils';

formatCurrency(1500);           // "$1,500.00"
formatDate(new Date(2026, 5, 15)); // "15/6/2026"
validateRFC('ABC800101AA1');    // true
validateRFC('abc800101AA1');    // false — no acepta minúsculas

// Ambas aceptan locale/currency opcionales — el default es-MX/MXN no cambia
formatCurrency(1500, { locale: 'en-US', currency: 'USD' }); // "$1,500.00"
formatDate(new Date(2026, 5, 15), { locale: 'en-US' });     // "6/15/2026"
```

---

## Hooks

Exportados desde `@bip-design-systems/ui-components` (antes internos a `src/lib/`):

| Hook | Descripción |
|------|-------------|
| `useClickOutside` | Ejecuta un callback al hacer click fuera de un ref — usado por Dropdown, MultiSelect, DatePicker, etc. |
| `useDisclosure` | Estado open/close con `onOpen`/`onClose`/`onToggle` — patrón compartido por overlays |
| `useFocusTrap` | Atrapa el foco (Tab/Shift+Tab) dentro de un contenedor, enfoca el primer elemento al activarse, restaura el foco al desactivarse, y maneja Escape — usado por Modal, DrawerPanel, Odontogram |
| `useMediaQuery` | Suscripción reactiva a un media query (`matchMedia`) |
| `useScrollLock` | Bloquea el scroll del `<body>` mientras un overlay está abierto |

```ts
import { useDisclosure, useMediaQuery, cn } from '@bip-design-systems/ui-components';
```

`cn()` (wrapper de `clsx` para composición de clases de CSS Module) y `BREAKPOINTS`/`mediaQuery`
(fuente única de los `@media` usados internamente, ver `src/styles/breakpoints.ts`) también se
exportan desde el paquete.

---

## Tokens de Diseño

Fuente única de verdad: `packages/ui-components/src/tokens.css` — **hand-authored**, se edita directamente. Define todos los tokens de color/sombra como CSS custom properties, con los valores `:root` (light) y sus overrides bajo `[data-color-scheme='dark']` en el mismo archivo. Documentado visualmente en `Colors.stories.tsx` (Storybook).

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

**Semilla vs. derivado** — dentro de cada bloque (`:root` / `[data-color-scheme='dark']`), un token es:
- **Semilla** — hex literal, uno por familia de color (`--color-primary`, `--color-danger`, `--color-info`, etc.). Es lo que el consumidor sobrescribe para theming de marca.
- **Derivado** — el resto de la familia (`-hover`, `-press`, `-light`, `-subtle`, `-text`...), calculado desde la semilla con `color-mix()`. Sobrescribir la semilla recolorea automáticamente toda la familia.

> Para agregar un token: editar `tokens.css` directamente — decidir primero de qué semilla deriva antes de escribir un hex nuevo. Ver [Theming](#theming) para el eje de marca en runtime.

---

## CSS Modules y Tokens de Diseño

Los estilos de todos los componentes usan **CSS Modules** (`ComponentName.module.css`) con **CSS Custom Properties** para los tokens de diseño. No se usa Tailwind CSS.

### Dónde vive cada pieza

| Archivo | Rol |
|---------|-----|
| `packages/ui-components/src/tokens.css` | **Fuente de verdad** — define todos los tokens de color como variables CSS (`:root { --color-primary: …; }`), hand-authored. |
| `packages/ui-components/src/components/**/*.module.css` | Estilos por componente (scoped). Usan las variables de `tokens.css`. |
| `packages/ui-components/src/lib/cn.ts` | Utilidad `cn()` — wrapper de `clsx` para composición condicional de clases de CSS Module. |
| `src/foundations/Colors.stories.tsx` | Documentación visual de todos los tokens en Storybook. |

### Cómo se usan los tokens en los componentes

Los tokens se consumen desde los archivos `.module.css` mediante `var()`:

```css
/* Button.module.css */
.primary {
  background-color: var(--color-primary);
  color: var(--color-txt-white);
}
.primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

/* Texto */
.label { color: var(--color-txt); }
.labelSecondary { color: var(--color-txt-secondary); }
.labelDisabled { color: var(--color-txt-disabled); }

/* Bordes */
.outlined { border: 1px solid var(--color-edge); }
.outlined:focus-within { border-color: var(--color-edge-focus); }

/* Feedback */
.error { background-color: var(--color-danger); color: var(--color-danger-text); }
.success { background-color: var(--color-success-light); color: var(--color-success-text); }
```

### Flujo de actualización de tokens

```
Editar src/tokens.css  →  pnpm build
```

> `tokens.css` es hand-authored — edítalo directamente y sigue la regla semilla/derivado (ver [Tokens de Diseño](#tokens-de-diseño)).

---

## Theming

Tres ejes independientes, todos controlados por `<ThemeProvider>` — sin configuración de build ni Tailwind.

| Eje | Prop | Valores | Afecta |
|-----|------|---------|--------|
| Forma / tipografía | `theme` | `square` \| `rounded` | `--radius-*`, `--font-sans` |
| Esquema de color | `colorScheme` | `light` \| `dark` (default `light`) | Toda la paleta `--color-*` |
| Marca | `tokens` | overrides de semillas (ver abajo) | `--color-primary`, `--color-danger`, etc. y toda su familia derivada |

```tsx
import { ThemeProvider } from '@bip-design-systems/ui-components';

export const App = () => (
  <ThemeProvider theme="rounded" colorScheme="dark">
    <MiApp />
  </ThemeProvider>
);
```

### Marca personalizada (`tokens`)

Estilo `ConfigProvider` de Ant Design: pasa un color y toda la librería se recolorea — hover, press, focus ring, texto y variantes claras/sutiles se derivan automáticamente.

```tsx
<ThemeProvider
  theme="rounded"
  tokens={{
    colorPrimary: '#e2007a',
    colorDanger: '#d6336c',
    // refinamiento opcional por esquema — gana sobre el valor plano
    dark: { colorPrimary: '#ff4fa8' },
  }}
>
  <MiApp />
</ThemeProvider>
```

- Semillas disponibles: `colorPrimary`, `colorSecondary`, `colorDanger`, `colorInfo`, `colorSuccess`, `colorWarning`, `colorUnique`, `colorLink`, `colorTxt`, `colorSurface`, `colorEdge`, `colorField`, `fontFamily`.
- `cssVars` es el escape hatch para cualquier custom property fuera de esa lista: `cssVars={{ '--color-selected': '#...' }}`.
- Los `<ThemeProvider>` anidados hacen merge con el padre — uno interno solo sobrescribe lo que declara.
- Los componentes con portal (`Modal`, `Toast`, `DrawerPanel`, `Calendar`, popovers de `Odontogram`) heredan la marca correctamente aunque se rendericen fuera del árbol DOM del provider.

**Contraste automático.** Al sobrescribir `colorPrimary`, `colorDanger`, `colorSuccess`, `colorWarning`, `colorInfo` o `colorUnique`, `ThemeProvider` calcula el contraste WCAG (`src/lib/contrast.ts`) y elige texto blanco u oscuro automáticamente — un `colorPrimary` amarillo claro no deja el botón primario con texto blanco ilegible. Componentes migrados a este mecanismo: `Button`, `Avatar`, `Stepper`, `Sidebar` (`variant="primary"`).

**Radius por marca.** Además del preset `theme`, se puede sobrescribir cualquiera de los 6 tokens semánticos de radius de forma independiente:

```tsx
<ThemeProvider theme="rounded" radius={{ field: '12px', container: '24px' }}>
```

Claves: `marker`, `field`, `control`, `surface`, `container`, `containerLg`.

### Modo no-controlado, `system` y persistencia

Sin `theme`/`colorScheme`, `ThemeProvider` maneja su propio estado (`defaultTheme`/`defaultColorScheme`) y expone controles vía `useThemeControls()` — útil para un botón de toggle sin levantar estado propio en la app:

```tsx
import { ThemeProvider, useThemeControls } from '@bip-design-systems/ui-components';

const ToggleButton = () => {
  const { resolvedColorScheme, toggleColorScheme } = useThemeControls();
  return <button onClick={toggleColorScheme}>{resolvedColorScheme === 'dark' ? '🌙' : '☀️'}</button>;
};

export const App = () => (
  <ThemeProvider defaultTheme="square" defaultColorScheme="system" storageKey="mi-app-theme">
    <ToggleButton />
    <MiApp />
  </ThemeProvider>
);
```

- `colorScheme`/`defaultColorScheme` aceptan `'system'` — sigue `prefers-color-scheme` del SO en vivo. Nunca se estampa `'system'` en el DOM, siempre el valor resuelto (`light`/`dark`).
- `storageKey` persiste la preferencia en `localStorage` (best-effort — no falla en modo privado de Safari).
- Un axis controlado (`colorScheme` pasado como prop) siempre gana sobre el estado interno y sobre lo persistido.

**Evitar el flash de tema (FOUC) en SSR.** El primer paint del servidor no conoce la preferencia guardada en `localStorage`; usa `getThemeInitScript()` para estampar `data-theme`/`data-color-scheme` en `<html>` antes de hidratar:

```tsx
// Next.js App Router — app/layout.tsx
import { getThemeInitScript } from '@bip-design-systems/ui-components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: 'mi-app-theme' }) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`storageKey` debe coincidir con el pasado a `<ThemeProvider>`.

Ver la story `Components/ThemeProvider` en Storybook para demos interactivas (incluye `CustomBrand`, `UncontrolledWithPersistence` y `SystemColorScheme`).

> `ThemeProvider` declara `"use client"` — es seguro renderizarlo desde un Server Component de
> Next.js App Router (basta con importarlo en un componente marcado `"use client"`, o dejar que
> el propio `ThemeProvider` sea el límite cliente/servidor de tu layout).

### Soporte de navegadores

El eje de marca depende de `color-mix()` nativo — sin bundle de fallback. Mínimo soportado:

| Navegador | Versión mínima |
|---|---|
| Chrome / Edge | 111+ |
| Safari | 16.2+ |
| Firefox | 113+ |

Todos de 2023 en adelante. Declarado en `packages/ui-components/package.json` (`browserslist`).

### Fuentes

Inter y Figtree se auto-hospedan (`@fontsource-variable`, `src/styles/fonts.css`) — ya no se cargan desde `fonts.googleapis.com`, así que funcionan bajo CSP estricta sin petición externa. Solo se incluyen los subsets `latin`/`latin-ext` (peso completo 100–900, normal + itálica); Cirílico/Griego/Vietnamita quedan fuera. Esto deja `style.css` en ~800KB — es el tradeoff de auto-hospedar variable fonts completas vs. el subsetting dinámico que hacía el CDN de Google.

---

## Internacionalización (i18n)

Todos los `aria-label`, placeholders y textos visibles de los componentes vienen de un
diccionario (`BipLocale`) resuelto vía contexto — no hay strings en español quemados en el
JSX sin forma de sobreescribirlos. El default sin configurar es `es-MX` (idéntico al
comportamiento anterior a esta sección, cero cambios visuales para consumidores existentes).

```tsx
import { ThemeProvider, enUS } from '@bip-design-systems/ui-components';

<ThemeProvider theme="rounded" locale={enUS}>
  <App />
</ThemeProvider>

// Override parcial sobre el default es-MX — solo lo que necesites cambiar
<ThemeProvider locale={{ alert: { close: 'Dismiss' } }}>
  <App />
</ThemeProvider>
```

- `locale` es una prop hermana de `theme`/`tokens`/`radius` en `<ThemeProvider>` — acepta el
  diccionario completo (`esMX`, `enUS`, exportados por el paquete) o un override parcial que se
  fusiona sobre el diccionario del `ThemeProvider` padre (si hay uno anidado) o sobre `esMX`.
- El diccionario incluye un tag BCP-47 (`locale: 'es-MX'` / `'en-US'`) que alimenta también los
  formatos de fecha (`Intl.DateTimeFormat`) usados internamente por `Calendar`, `DatePicker` y
  `DateRangePicker` — cambiar el locale no es solo textos, también reformatea fechas/meses.
- Sin `<ThemeProvider>` en el árbol (o sin la prop `locale`), todo componente sigue funcionando
  con `es-MX` por defecto vía `useBipLocale()`.
- Para escribir tu propio diccionario (otro idioma completo, no solo un override), importa el
  tipo `BipLocale` y usa `esMX`/`enUS` como referencia de forma.
- Ver la story `Foundations/I18n` en Storybook para un playground en vivo con la galería de
  componentes más cargados de texto (Calendar, DatePicker, MultiSelect, Pagination, DataTable).

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
| `main` | Producción | [GitHub Pages](https://egvictorino.github.io/Bip-Design-Systems/) | Automático |
| `qa` | Testing | (por configurar) | Automático |
| `dev` | Desarrollo | (por configurar) | Automático |

---

## CI/CD

> Para contribuir (flujo de ramas, changesets, cómo regenerar baselines visuales), ver
> [CONTRIBUTING.md](./CONTRIBUTING.md).

Cuatro workflows de GitHub Actions, uno por ambiente:

| Workflow | Trigger | Pasos clave |
|----------|---------|-------------|
| `pr-validation.yml` | PR a cualquier rama | validación de branch → lint → typecheck → **tests** → build → verificación de package (`publint`/`attw`) → **regresión visual** (job aparte, propio container) → **changeset check** (solo PR→`dev`) → security audit (solo PR→`qa`, no bloqueante) |
| `dev.yml` | push/PR a `dev` | lint → **tests** → build → storybook preview |
| `qa.yml` | push/PR a `qa` | lint → **tests** → build → **e2e-consumer** (tarball real) → storybook QA |
| `production.yml` | push/PR a `main` | security audit (bloqueante) · lint · **tests** · type-check → build → **e2e-consumer** → publish npm → GitHub Pages → release tag |

**Reglas del pipeline:**
- Todos los workflows instalan dependencias con `--frozen-lockfile` para garantizar reproducibilidad.
- Los tests siempre se ejecutan **antes** del build (fail-fast).
- Orden de build garantizado: `shared-utils → ui-components`.
- `e2e-consumer` (solo `qa.yml`/`production.yml`) instala el tarball real de `pnpm pack`, no un
  link de workspace — es un gate de release, no corre en cada PR por su costo.
- `changeset-check` solo corre en PRs hacia `dev` (donde nace un cambio real) — `dev→qa` y
  `qa→main` son promociones del mismo código ya versionado.

---

## Usar en un Proyecto Externo

Pasos para consumir BipUI desde un repositorio independiente.

### 1. Instalar los paquetes

```bash
pnpm add @bip-design-systems/ui-components @bip-design-systems/shared-utils
```

### 2. Instalar las peer dependencies

```bash
pnpm add react react-dom
```

Soporta React `^18.2.0` y `^19.0.0` como peer dependency.

### 3. Importar los estilos

En el entry point de tu proyecto, importa el CSS compilado de la librería:

```ts
// src/main.tsx (o index.tsx)
import '@bip-design-systems/ui-components/style.css';
```

No se requiere configurar Tailwind ni ningún otro preprocesador CSS.

**Paquete ESM-only** — `dist/` no incluye un build CommonJS (`require()`). Es una decisión
deliberada, no un hueco: cualquier bundler/framework moderno (Vite, Next.js App Router, Remix)
resuelve ESM sin configuración extra. Si tu proyecto depende de `require()` para este paquete,
necesitas un bundler con soporte ESM o un puente como `esm`/dynamic `import()`.

**Subpath exports** — además de importar todo desde la raíz del paquete, cada componente es
importable individualmente (aprovecha que el build ya emite un archivo por componente,
`preserveModules: true`):

```ts
import { Button } from '@bip-design-systems/ui-components/Button';
```

Útil para tree-shaking manual o para evitar cargar el paquete completo si solo necesitas un
componente puntual.

### 4. Usar los componentes

```tsx
import { Button, Input, ThemeProvider, ToastProvider, useToast } from '@bip-design-systems/ui-components';
import { formatCurrency, validateRFC } from '@bip-design-systems/shared-utils';

// ThemeProvider es opcional — sin él, el tema por defecto es square/light.
export const App = () => (
  <ThemeProvider theme="rounded" tokens={{ colorPrimary: '#e2007a' }}>
    <ToastProvider>
      <MiPagina />
    </ToastProvider>
  </ThemeProvider>
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

[MIT](./LICENSE) — Copyright (c) 2026 Eduardo Gonzalez
