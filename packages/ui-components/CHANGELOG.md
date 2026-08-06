# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

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
