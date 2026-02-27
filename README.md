# PYMEs Platform — Monorepo

Plataforma de desarrollo web para PYMEs en Nuevo León, México.
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
pymes-platform/
├── packages/
│   ├── ui-components/      # Librería de componentes React  →  @pymes/ui-components
│   └── shared-utils/       # Utilidades TypeScript puras    →  @pymes/shared-utils
└── apps/
    └── template-base/      # Starter app para nuevos clientes
```

Los paquetes internos se consumen con el protocolo workspace:

```jsonc
// package.json de cualquier app cliente
{
  "dependencies": {
    "@pymes/ui-components": "workspace:*",
    "@pymes/shared-utils": "workspace:*"
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
pnpm --filter @pymes/shared-utils build
pnpm --filter @pymes/ui-components build

# 3. Abrir Storybook  →  http://localhost:6006
pnpm --filter @pymes/ui-components storybook

# 4. Levantar template base  →  http://localhost:5173
pnpm --filter @pymes/template-base dev
```

---

## Comandos

### Por paquete

```bash
pnpm --filter @pymes/ui-components storybook        # Dev Storybook
pnpm --filter @pymes/ui-components build-storybook  # Build estático
pnpm --filter @pymes/ui-components build            # Build librería
pnpm --filter @pymes/ui-components lint             # Lint
pnpm --filter @pymes/ui-components test             # Tests
```

### Monorepo completo

```bash
pnpm build   # Construye todos los paquetes
pnpm lint    # Lint en todos los proyectos
pnpm dev     # Modo desarrollo paralelo
```

---

## Componentes UI

> Storybook: <https://TU-USUARIO.github.io/pymes-platform/>

### Entrada de datos

| Componente | Descripción |
|------------|-------------|
| `Button` | Botón con variantes `primary`, `secondary`, `bare`, `danger` y tamaños `sm / md / lg` |
| `Input` | Campo de texto con label, helper text, estados de error y múltiples tipos |
| `Textarea` | Área de texto con autoResize opcional |
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
| `Table` | Tabla responsiva: `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell` — soporta ordenamiento, striped y compact |

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

## Tokens de Diseño

Los tokens están definidos en `packages/ui-components/tailwind.config.js` y registrados en `src/lib/cn.ts` para una resolución correcta de conflictos de clases.

```
interaction-primary-{default|hover|pressed}    →  #1643A8 / #10327D / #0B2152
interaction-secondary-{default|hover|pressed}  →  #4B5468 / #3A404B / #282C33
interaction-tertiary-{default|hover|pressed}   →  #DEE4ED / #B6BBC3 / #8E9298
interaction-disabled                           →  #EFEFEF

text-primary    →  #23232A
text-secondary  →  #5E5E60
text-disabled   →  #A6A7A8
text-white      →  #FFFFFF
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
| `main` | Producción | [GitHub Pages](https://tu-usuario.github.io/pymes-platform/) | Automático |
| `qa` | Testing | (por configurar) | Automático |
| `dev` | Desarrollo | (por configurar) | Automático |

---

## CI/CD

El pipeline de GitHub Actions ejecuta en cada PR:

- Validación de tipos TypeScript
- Lint (`eslint`)
- Build de todos los paquetes (en orden de dependencia)
- Deploy automático de Storybook a GitHub Pages (solo rama `main`)

---

## Agregar Nuevo Cliente

```bash
# Copiar el template base
cp -r apps/template-base apps/nombre-cliente

# Actualizar name en package.json del nuevo cliente
# Instalar dependencias
pnpm install

# Levantar
pnpm --filter @pymes/nombre-cliente dev
```

---

## Licencia

Privado — Todos los derechos reservados.
