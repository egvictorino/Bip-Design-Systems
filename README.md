# BipUI — Monorepo

Design system y librería de componentes React.
Monorepo basado en **pnpm workspaces** que centraliza la librería de componentes, utilidades compartidas y el template base para nuevos clientes.

---

## Contenido

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Inicio Rápido](#inicio-rápido)
- [Comandos](#comandos)
- [Componentes UI](#componentes-ui)
- [Tokens de Diseño](#tokens-de-diseño)
- [Estrategia de Branches](#estrategia-de-branches)
- [CI/CD](#cicd)
- [Agregar Nuevo Cliente](#agregar-nuevo-cliente)

---

## Estructura del Proyecto

```
bip-ui/
├── packages/
│   ├── ui-components/      # Librería de componentes React  →  @bip/ui-components
│   └── shared-utils/       # Utilidades TypeScript puras    →  @bip/shared-utils
└── apps/
    └── template-base/      # Starter app para nuevos clientes
```

Los paquetes internos se consumen con el protocolo workspace:

```jsonc
// package.json de cualquier app cliente
{
  "dependencies": {
    "@bip/ui-components": "workspace:*",
    "@bip/shared-utils": "workspace:*"
  }
}
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

# 4. Levantar template base  →  http://localhost:5173
pnpm --filter @bip/template-base dev
```

---

## Comandos

### Por paquete

```bash
pnpm --filter @bip/ui-components storybook        # Dev Storybook
pnpm --filter @bip/ui-components build-storybook  # Build estático
pnpm --filter @bip/ui-components build            # Build librería
pnpm --filter @bip/ui-components lint             # Lint
pnpm --filter @bip/shared-utils test              # Tests (vitest)
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
| `Checkbox` | Checkbox accesible con soporte para estado indeterminado |
| `Radio` | Radio button con label y helper text |
| `Toggle` | Interruptor on/off con label integrado |

### Retroalimentación

| Componente | Descripción |
|------------|-------------|
| `Alert` | Mensajes de estado con variantes `info`, `success`, `warning`, `error` y acción dismiss |
| `Badge` | Etiqueta compacta con variantes semánticas y punto indicador opcional |
| `Spinner` | Indicador de carga animado con tamaños y colores |
| `Skeleton` | Placeholder de carga con variantes `text`, `circle`, `rect` y prop `lines` |

### Contenido y datos

| Componente | Descripción |
|------------|-------------|
| `Card` | Tarjeta compuesta: `CardHeader`, `CardBody`, `CardFooter` |
| `Table` | Tabla responsiva: `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` — soporta ordenamiento, striped, compact y filas seleccionables (`selected`) |

### Navegación

| Componente | Descripción |
|------------|-------------|
| `Breadcrumb` | Ruta de navegación con separador configurable |
| `Tabs` | Pestañas accesibles: `TabList`, `Tab`, `TabPanel` |
| `Pagination` | Paginador con salto a primera/última página |
| `Dropdown` | Menú desplegable compound: `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownDivider` — navegación por teclado completa |

### Overlay

| Componente | Descripción |
|------------|-------------|
| `Modal` | Diálogo con focus trap y portal: `ModalHeader`, `ModalBody`, `ModalFooter` |
| `Tooltip` | Tooltip posicionable con delay configurable |

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

Fuente única de verdad: `packages/ui-components/tailwind.tokens.js` — importado por `tailwind.preset.js` (tema Tailwind) y `Colors.stories.tsx` (documentación Storybook). Para agregar un token: editar `tailwind.tokens.js` → registrar en `src/lib/cn.ts`.

```
// Interaction
interaction-primary-{default|hover|pressed}    →  #1643A8 / #10327D / #0B2152
interaction-secondary-{default|hover|pressed}  →  #4B5468 / #3A404B / #282C33
interaction-tertiary-{default|hover|pressed}   →  #DEE4ED / #B6BBC3 / #8E9298
interaction-disabled                           →  #EFEFEF  (fondo campos deshabilitados)
interaction-field                              →  #FCFCFC  (fondo campos outlined)
interaction-field-readonly                     →  #F2F2F2  (fondo campos read-only)
interaction-selected                           →  #E4FCFF  (fondo TableRow seleccionado)

// Text
text-primary    →  #23232A
text-secondary  →  #5E5E60
text-disabled   →  #A6A7A8
text-white      →  #FFFFFF

// Feedback
feedback-error-{default|light|subtle|muted|text}   →  #EF4444 / #FEF2F2 / #FEE2E2 / #FECACA / #B91C1C
feedback-success-{default|light|subtle|text}       →  #22C55E / #F0FDF4 / #DCFCE7 / #15803D
feedback-warning-{default|light|subtle|text}       →  #EAB308 / #FEFCE8 / #FEF9C3 / #A16207
feedback-info-{light|subtle|text}                  →  #EFF6FF / #DBEAFE / #1D4ED8
```

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
- Orden de build garantizado: `shared-utils → ui-components → template-base`.

---

## Agregar Nuevo Cliente

```bash
# Copiar el template base
cp -r apps/template-base apps/nombre-cliente

# Actualizar name en package.json del nuevo cliente
# Instalar dependencias
pnpm install

# Levantar
pnpm --filter @bip/nombre-cliente dev
```

---

## Licencia

Privado — Todos los derechos reservados.
