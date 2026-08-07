# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

### Added

- **Internacionalización (i18n).** Nuevo sistema de diccionarios (`BipLocale`) resuelto vía
  contexto: los ~100 `aria-label`/placeholders/textos que antes estaban quemados en español
  directamente en el JSX de 28 componentes ahora se resuelven vía `useBipLocale()`, con `es-MX`
  como default byte-idéntico al comportamiento anterior. Nueva prop `locale` en
  `<ThemeProvider>` (sibling de `theme`/`tokens`/`radius`), acepta el diccionario completo
  (`esMX`, `enUS`, ambos exportados) o un override parcial que se fusiona sobre el diccionario
  del provider padre. El diccionario también lleva un tag BCP-47 (`locale.locale`) que alimenta
  los `Intl.DateTimeFormat` de `Calendar`/`DatePicker`/`DateRangePicker`, antes hardcodeados a
  `'es-MX'` a nivel de módulo. Ver story `Foundations/I18n` en Storybook.
- `formatCurrency`/`formatDate` (`shared-utils`) aceptan `locale`/`currency` opcionales — los
  defaults `es-MX`/MXN no cambian.
- `--provenance` en el publish de npm de ambos paquetes (`production.yml`) — badge de
  procedencia verificada, aprovechando el `id-token: write` ya declarado a nivel de workflow.

### Fixed

- `Odontogram`'s `ImagePopover`/`NotePopover` duplicaban a mano un `useFocusTrap` local
  (solo Tab-cycling, sin manejo de Escape ni restauración de foco) — reemplazado por el hook
  compartido `src/hooks/useFocusTrap.ts`. Comportamiento nuevo: el foco se restaura al elemento
  que abrió el popover al cerrarse (mejora, no regresión).

- E2E smoke test (`e2e/consumer.spec.ts`, `pnpm test:e2e` from the repo root) that installs
  the actual `pnpm pack` tarball into a standalone Vite app (not a workspace link) and
  asserts on real computed styles — catches the class of bug where the workspace-link dev
  loop works but the published package doesn't (design tokens missing from the tarball, ESM
  resolution failing outside the monorepo). Runs in CI on `qa.yml`/`production.yml` only, as
  a release gate; `production.yml`'s `publish-npm` now `needs:` it.
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
- `src/styles/rtl.test.ts`: `ProgressBar.module.css` estaba en `PHYSICAL_BY_DESIGN_ALLOWLIST`
  sin necesitarlo — no tiene ningún `left`/`right` físico, su exención era por un
  `translateX` en `@keyframes` que ninguno de los dos regex del test evalúa. La entrada era
  inerte y encubriría un `left`/`right` real que alguien agregara ahí después.
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

### Added

- Nuevos componentes primitivos de layout y tipografía: `Stack`, `Grid`, `Container`, `Text`,
  `Heading` — cierran el hueco que hasta ahora obligaba a resolver layout en las stories con
  estilos inline (`style={{ display: 'flex', gap: '1rem' }}`).
- Nuevos hooks públicos en `src/hooks/` (exportados desde el paquete):
  `useClickOutside` (promovido desde `lib/`, ya usado por 7 componentes), `useDisclosure`,
  `useFocusTrap`, `useMediaQuery`, `useScrollLock`. `cn` también se exporta ahora.
- `BREAKPOINTS`/`mediaQuery` (`src/styles/breakpoints.ts`) — fuente única para los `@media`
  que antes se repetían como literales en varios `.module.css` (Navbar, Sidebar) y para
  `useMediaQuery` en runtime. `src/styles/breakpoints.test.ts` hace cumplir la escala.
- Storybook: página `Introduction` (antes no había ningún `.mdx` ni landing page) y foundations
  `Typography`, `Motion`, `Breakpoints` — `Elevation` no se agregó como página aparte porque
  `Foundations/Colors` ya documenta los tokens `--shadow-*` (light/dark) dentro de su propia
  página.
- `publint`/`@arethetypeswrong` (`pnpm --filter ui-components lint:package`), wired into
  `pr-validation.yml`, para detectar regresiones de empaquetado (exports map, resolución de
  tipos) automáticamente en vez de a mano.
- Cobertura de tests (`@vitest/coverage-v8`, `pnpm test:coverage`) con umbral fijado al nivel
  actual, corriendo en CI.

### Fixed

- **`ThemeProvider` no declaraba `"use client"`** pese a ser el único componente con hooks de
  React sin la directiva — rompía en Next.js App Router al renderizarse desde un Server
  Component. Nuevo `src/styles/use-client.test.ts` lo hace cumplir para cualquier componente
  futuro con hooks.
- Mapa `exports` de ambos paquetes: `types` ahora precede a `import` (algunos resolvers de TS
  no encontraban los tipos con el orden anterior); `ui-components` gana subpath exports
  (`@bip-design-systems/ui-components/Button`, etc.) aprovechando que el build ya emite
  `preserveModules: true`.
- `repository`/`bugs`/`homepage` de ambos paquetes apuntaban a `github.com/egvictorino/bip-ui`,
  un repo que no existe — corregido a `Bip-Design-Systems`.
- `peerDependencies` de React ampliado a `^18.2.0 || ^19.0.0` (antes excluía React 19).
- `tsconfig.json` raíz referenciaba `./apps/template-base`, un directorio inexistente —
  `tsc -b` fallaba desde la raíz. Simplificado; nuevo script `pnpm typecheck` en la raíz.
- `Modal` y `DrawerPanel` duplicaban literalmente `FOCUSABLE_SELECTORS`, el bloqueo de scroll y
  la lógica de focus trap — extraído a `useFocusTrap`/`useScrollLock`, sin cambio de
  comportamiento (mismos tests de a11y y de componente pasan sin modificar).
- Focus ring hardcodeado en `Button` `.secondary`, `Alert` `.closeBtn` y `ConfirmDialog`
  `.confirmWarning` — usaban un `box-shadow` escrito a mano en vez de `var(--focus-ring)`, así
  que ignoraban silenciosamente la prop `focusRing` de `ThemeProvider`.
- **El paquete no declaraba `"type": "module"`** pese a que el build es ESM-only
  (`formats: ['es']`) — Node interpretaba los `.js` de `dist/` como CommonJS por defecto
  (`publint` marcaba 45 warnings de este tipo). `postcss.config.js`, el único archivo `.js`
  del paquete en CommonJS (`module.exports`), se renombró a `postcss.config.cjs` para no
  romperse bajo la nueva declaración; sus dos referencias (`vite.config.ts`,
  `.storybook/main.js`) se actualizaron junto con él.

### Added (infraestructura)

- Stories nuevas para los subcomponentes internos de `Odontogram`: `ImagePopover`,
  `NotePopover`, `ToothDetail`, `ToothSVG` — antes solo tenían tests, sin story propia.
- `visual/`, `.storybook/` y `e2e/` ahora se lintean (ESLint) y typechequean (`tsc`) — antes no
  se comprobaban en absoluto. Cero violaciones nuevas: no eran deuda oculta, solo estaban fuera
  del `include`/scope de los scripts existentes.
- `eslint-plugin-storybook` (reglas sobre `*.stories.tsx`) y `eslint-plugin-playwright`
  (reglas sobre `visual/**` y `e2e/**`), vía `overrides` en `.eslintrc.json`.
- Presupuesto de bundle (`size-limit`, `pnpm size`) sobre `dist/index.js`, un componente
  representativo (`Button`) y `dist/style.css`, con límites fijados al tamaño actual medido —
  gate contra regresiones, no una meta aspiracional. Corriendo en `pr-validation.yml`.
- Workflows de seguridad nuevos: `codeql.yml` (análisis estático JS/TS) y
  `dependency-review.yml` (bloquea dependencias nuevas con CVEs conocidos en PRs).
- Los jobs `deploy-storybook-dev`/`deploy-storybook-qa` (antes `echo` stubs que construían
  Storybook y no publicaban nada) ahora suben la build como artifact de GitHub Actions
  descargable — un repo solo tiene un sitio de GitHub Pages, ya usado por
  `deploy-storybook-production`, así que dev/qa no pueden tener URL propia sin reestructurar.
  Se eliminaron los jobs `notify-qa-team`/`notify-production` (echo sin integración real) y el
  paso `Add QA badge` (escribía un `qa-banner.html` suelto que nada enlazaba).

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
