# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

### Added

- `src/styles/contrast-tokens.test.ts` — verifica WCAG AA (4.5:1) contra los valores hex
  reales de `tokens.css` para las 6 semillas de fill y sus `--color-txt-on-*`, en ambos
  esquemas de color. Antes solo se probaba la función `contrastRatio` con pares escritos a
  mano; ahora un cambio a un token real que rompa el contraste falla el build.
- Visual regression ahora corre en CI (`pr-validation.yml`, job `visual-regression`) contra
  baselines Linux generadas en `mcr.microsoft.com/playwright:v1.62.1-jammy` — antes solo
  existían baselines macOS y ningún workflow invocaba `test:visual`. Nuevo
  `scripts/visual-docker.sh` (raíz del repo, `pnpm test:visual:docker`) corre la misma imagen
  en local para que verificar o regenerar baselines sea idéntico a lo que corre en CI.
- `visual/component-matrix.spec.ts` — un screenshot por componente (42 de los 43 directorios
  de `src/components`; `ThemeProvider` no tiene UI propia) más un subset de 15 en RTL
  (`Sidebar`, `Toggle`, `Tooltip`, `Calendar`, `NumberInput`, `SearchInput`, `Input`, `Select`,
  `Dropdown`, `DrawerPanel`, `Tabs`, `Stepper`, `Timeline`, `MultiSelect`, `DatePicker` — los
  que tienen geometría direccional real). Antes las 8 baselines existentes cubrían solo
  ThemeProvider/Foundations; una regresión visual en un componente en sí no la detectaba
  nada. Guard de cobertura igual al de `a11y.test.tsx`: un componente nuevo sin entrada en
  `component-matrix.ts` falla el build.

### Fixed

- `playwright.visual.config.ts`: `use.viewport` estaba declarado pero sin efecto — el spread
  de `devices['Desktop Chrome']` en el project lo pisaba, así que el viewport real siempre fue
  1280×720, no 960×720. Corregido moviendo el viewport al `use` del project, donde sí aplica.
- `src/styles/rtl.test.ts`: `ProgressBar.module.css` estaba en `PHYSICAL_BY_DESIGN_ALLOWLIST`
  sin necesitarlo — no tiene ningún `left`/`right` físico, su exención era por un
  `translateX` en `@keyframes` que ninguno de los dos regex del test evalúa. La entrada era
  inerte y encubriría un `left`/`right` real que alguien agregara ahí después.

## [0.3.0] - 2026-08-06

### Added

- `ThemeProvider` gana cinco ejes de override en runtime, todos resueltos con el mismo
  mecanismo (`resolveVarMap`): `tokens` (semillas de color de marca, con refinamiento
  `light`/`dark`), `radius`, `focusRing`, `motion` y el escape hatch `cssVars`.
- Contraste automático (WCAG AA) en las seis semillas de fill (`colorPrimary`, `colorDanger`,
  `colorSuccess`, `colorWarning`, `colorInfo`, `colorUnique`): al sobrescribir una semilla,
  `pickReadableText()` recalcula el `--color-txt-on-*` correspondiente para los 43 componentes
  de la librería, en vez de dejar texto blanco varado sobre un fill claro.
- Aviso en consola (dev only) cuando el contraste de un override cae por debajo de 4.5:1 contra
  ambas opciones de texto.
- Soporte de tema `system` para `colorScheme`, resuelto en vivo vía `matchMedia` con
  `useSyncExternalStore` — nunca se estampa `'system'` en el DOM, siempre el valor resuelto.
- `useThemeControls()` y `useThemeAttributes()` — el segundo para que los componentes
  portalizados (Modal, Toast, DrawerPanel, Calendar, popovers de Odontogram) lean los vars
  resueltos aunque `createPortal` los saque del subárbol del provider.
- `getThemeInitScript()` — IIFE para inyectar en `<head>` y evitar FOUC antes de que React
  hidrate.
- `storageKey` — persistencia best-effort en `localStorage` para los ejes no controlados.
- Tokens de motion (`--duration-*`, `--ease-*`) y focus ring (`--focus-ring-*`) en
  `primitives.css`, ambos overrideables desde `ThemeProvider`. `prefers-reduced-motion: reduce`
  colapsa los cuatro `--duration-*` a `0ms` globalmente.
- `Foundations/Theming` — story-playground en Storybook para verificar contraste y overrides en
  vivo, sin depender solo de la lectura del código.

### Changed

- Migración completa fuera de Tailwind: todo el styling vive en CSS Modules + tokens
  (`var(--color-*)`), sin clases utilitarias.

### Fixed

- Se corrigieron ~20 story files con clases Tailwind muertas que no aplicaban ningún estilo
  desde la migración.

[Unreleased]: https://github.com/egvictorino/Bip-Design-Systems/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/egvictorino/Bip-Design-Systems/releases/tag/v0.3.0
