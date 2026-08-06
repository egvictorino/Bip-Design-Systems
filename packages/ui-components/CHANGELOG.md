# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

### Added

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
- `visual/a11y-browser.spec.ts` — axe con `color-contrast` **activado**, en Chromium real vía
  `@axe-core/playwright`, contra los 42 componentes en light y dark (84 casos). Cierra el
  hueco que `a11y.test.tsx` deja explícito: happy-dom no resuelve `color-mix()`/custom
  properties con fidelidad suficiente para evaluar contraste renderizado. La primera corrida
  encontró 26 violaciones reales — ver abajo.
- Nuevo token `--color-primary-text`: `--color-primary`/`--color-active` usados directamente
  como color de **texto** (no fill) medían 3.3–3.7:1 en dark contra superficies oscuras
  derivadas — bajo AA. En light es un alias directo a `--color-primary` (ya pasa, 8.2:1); en
  dark deriva con `color-mix(..., white 20%)`. Mismo mecanismo que `--color-danger-text` etc.

### Fixed

- `playwright.visual.config.ts`: `use.viewport` estaba declarado pero sin efecto — el spread
  de `devices['Desktop Chrome']` en el project lo pisaba, así que el viewport real siempre fue
  1280×720, no 960×720. Corregido moviendo el viewport al `use` del project, donde sí aplica.
- **Contraste real bajo AA, encontrado por `visual/a11y-browser.spec.ts`** (no un bug de test —
  la paleta en sí no llegaba a 4.5:1 en varios casos):
  - `--color-txt-secondary` (light, `#929292`): nunca alcanzaba AA contra ningún fondo claro
    del sistema (2.51–3.11:1). Bajado a `#5c5c5c` (≥5.1:1 contra el peor caso,
    `--color-secondary`).
  - `--color-success-text` (light, 30%→38% mezcla con negro) y `--color-warning-text` (light,
    35%→45%): marginales, 4.05–4.27:1. Ahora ≥4.9:1.
  - `Badge` `.primary`, `Tabs` tab activo (horizontal y vertical), `MultiSelect`
    `.labelFocused`/`.chevronFocused`, `Calendar` `.timeColumnHeaderWeekdayToday`: usaban
    `--color-primary` directo como texto — swap a `--color-primary-text` (ver arriba).
  - `StatsCard` `.trendPositive`: usaba la semilla `--color-success` directo como texto
    (2.28:1 contra blanco) — swap a `--color-success-text`.
  - `Calendar` `.eventBlockMeta`/`.eventBlockDoctor`: `opacity: 0.8`/`0.7` sobre texto ya
    ajustado al límite lo empujaba bajo AA — quitada, el `font-size` reducido ya carga la
    jerarquía visual sin sacrificar legibilidad.
  - `Calendar` `.timeLabelItem` (las horas del eje, "07:00" etc.) y `Sidebar` `.groupLabel`
    (encabezados de sección): usaban `--color-txt-disabled` para texto siempre visible y
    funcionalmente importante — no un estado inactivo. Swap a `--color-txt-secondary`.
  - `MultiSelect` `.placeholder`: mismo caso — es un `<span>` real (no `::placeholder`
    nativo), `--color-txt-disabled` fallaba 2.29:1. Swap a `--color-txt-secondary`.

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
