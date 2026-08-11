# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

### Changed — Unificación de API (breaking en 0.x, ver guía de migración en el README)

Preparación para congelar la API antes de declarar 1.0.0. Todos los cambios de esta sección son
breaking pero aceptados dentro del versionado 0.x; cada uno tiene un equivalente directo.

- **Rol semántico negativo unificado a `'danger'`** (antes `'error'` en algunos componentes,
  `'danger'` en otros). Afecta `Alert`, `Toast`, `Badge`, `ProgressBar`, `Timeline`, `Tooltip`
  (`variant="error"` → `variant="danger"`); `Stepper`'s `StepperStep` renombra además su prop
  `status` → `variant` (`status="error"` → `variant="danger"`, y `success`/`warning`/`loading` se
  quedan igual pero ahora bajo `variant`); `Dropdown`'s `DropdownItem` cambia `danger?: boolean` a
  `variant?: 'default' | 'danger'`; `Spinner` renombra el valor `'white'` a `'inverse'`.
- **Overlays unificados a `open` + `onOpenChange`** (estándar Radix/Headless UI/shadcn). `Modal`,
  `ConfirmDialog` y `Sidebar` (eje del drawer móvil) renombran `isOpen` → `open`; `onClose` se
  mantiene igual en los tres. `DrawerPanel` y `Tooltip` ya usaban `open`, ahora ganan
  `onOpenChange`/`defaultOpen` para completar el patrón. `Dropdown` y `Popover` ganan soporte de
  modo controlado (`open`/`defaultOpen`/`onOpenChange`), aditivo — el modo no-controlado existente
  no cambia. `Sidebar` gana además `collapsed`/`onCollapsedChange` (aditivo) junto a
  `defaultCollapsed`.
- **Firmas de callbacks unificadas**: `NumberInput.onChange` pierde el segundo parámetro
  (`event`) — ahora es `(value: number | null) => void`, igual que el resto de controles
  compuestos. `Pagination.currentPage` → `page`. `DataTable.onPageChange(page, pageSize)` se separa
  en `onPageChange(page)` + `onPageSizeChange(pageSize)`; `DataTable.onSearchChange` → `onSearch`
  (alineado con `SearchInput`); su `label` (que en realidad era un nombre accesible) → `aria-label`.
  `Calendar.onRangeSelect(start, end)` → `onRangeSelect(range: DateRange)`, reusando el tipo
  `DateRange` de `DateRangePicker`.
- **Vocabulario de escalas y superficies**: `Text`'s escalón medio `'base'` → `'md'` (alinea con
  los otros 26 componentes con `size`). `StatsCard`'s variante `'filled'` → `'flat'` (alinea con
  `Card`, que ya usaba ese vocabulario). `Odontogram`'s `readOnly` → `disabled` (alinea con el
  resto de la librería).
- **`Modal`** gana una prop `title?: string` de conveniencia (renderiza un `<ModalHeader>`
  automáticamente) y ahora extiende `HTMLAttributes<HTMLDivElement>` (gana `style`, `id`, `data-*`,
  `aria-*`, spreados sobre el `<div role="dialog">`). **`ConfirmDialog`** extiende
  `HTMLAttributes<HTMLDivElement>` — antes no aceptaba ni `className`.

### Added

- Patrones de props incompletos completados en componentes controlados-only: `defaultValue` en
  `MultiSelect`, `FileUpload`, `DatePicker`, `DateRangePicker`, `TimePicker`, `Odontogram` (antes
  fallaban en silencio si el consumidor no pasaba `value`). `loading` en `FileUpload`, `DatePicker`,
  `TimePicker`. `required` (con asterisco visual junto al `label`, igual que `Input`) en
  `MultiSelect`, `DatePicker`, `DateRangePicker`, `TimePicker`, y renderizado del asterisco (ya
  existía la prop por herencia nativa, pero no se pintaba) en `Slider`, `Toggle`, `SearchInput`.
  `disabled` en `Pagination` y `Calendar`.
- Exportados desde el barrel raíz (`src/index.ts`) tipos y hooks que ya existían pero no eran
  alcanzables públicamente: `useDensity`, `useDir`, `BipDensity`, `BipDirection`,
  `BipSpacingOverrides`, `RADIUS_VAR_MAP`, `ON_TEXT_VAR_MAP`, `FOCUS_RING_VAR_MAP`,
  `MOTION_VAR_MAP`, `SPACING_VAR_MAP`, `BulkAction`, `SortDirection` (DataTable), `ToothImage`,
  `ToothImageType` (Odontogram), `TabsVariant`, `TabsSize`, `TabsOrientation`, `AccordionVariant`,
  `SelectOptionGroup`, `StatsCardVariant`, `StatsCardSize`, `TimelineVariant`, `TimelineSize`,
  `TimelineOrientation`, `ToastContextValue`.
- `package.json`'s `exports` gana `"./package.json"` (esperado por varias herramientas de bundling)
  y subpaths explícitos `"./CheckboxGroup"` / `"./RadioGroup"`, antes inalcanzables por deep import
  porque el wildcard `"./*"` solo resuelve `<dir>/<dir>.js`. Se agregan stubs físicos
  `CheckboxGroup.js`/`.d.ts` y `RadioGroup.js`/`.d.ts` en la raíz del paquete para que esos dos
  subpaths también resuelvan bajo el algoritmo clásico `node10` (que ignora el mapa `exports`),
  igual que el resto de la superficie pública.
- **`forwardRef` en ~35 componentes** que extendían props nativas de HTML pero descartaban el
  `ref` recibido (declarados como `React.FC` en vez de `forwardRef`), lo que rompía anclar un
  `Tooltip`/`Popover` a ellos o usarlos con `react-hook-form`. Incluye tanto componentes atómicos
  (`Alert`, `Badge`, `Text`, `Heading`, `Stack`, `Container`, `Grid`, `Skeleton`, `Spinner`,
  `ProgressBar`, `EmptyState`, `Breadcrumb`, `VisuallyHidden`) como subcomponentes de familias
  compuestas (`Table`, `Tabs`, `Modal`, `Sidebar`, `Dropdown`).
- **`style`/`id`/`data-*`/`aria-*` habilitados** (vía `extends React.HTMLAttributes<...>` +
  spread) en ~24 componentes que antes solo aceptaban `className` a mano: `Accordion` (+3
  subcomponentes), `Calendar`, `CheckboxGroup`, `RadioGroup`, `DataTable`, `DatePicker`,
  `DateRangePicker`, `Divider`, `DrawerPanel`, `FileUpload`, `MultiSelect`, `Odontogram`,
  `Pagination`, `Popover` (+`PopoverContent`), `StatsCard`, `Stepper` (+`StepperStep`), `Tabs`,
  `TimePicker`, `Timeline` (+`TimelineItem`), `Tooltip`, `AvatarGroup`, `CardMedia`, y varios
  subcomponentes de `Sidebar`/`Dropdown`/`Navbar`. Donde una prop propia colisionaba en nombre
  con un atributo nativo del mismo nombre pero tipo distinto (`onChange`, `defaultValue`,
  `content`, `inputMode`), se usó `Omit<HTMLAttributes<...>, 'prop'>` para evitar el conflicto de
  tipos. **`ThemeProvider` se dejó fuera deliberadamente**: su `dir` propio colisiona en nombre
  con el atributo nativo `dir`, y su `style` calculado (tokens de marca resueltos) es demasiado
  crítico para arriesgar un spread genérico sin una revisión dedicada.
- Tipos compartidos `BipSize` (`'sm' | 'md' | 'lg'`) y `BipSizeExtended` (`'xs' | 'sm' | 'md' |
  'lg' | 'xl'`) en `src/types/size.ts`, exportados desde el barrel raíz — reemplazan 21 unions
  `'sm' | 'md' | 'lg'` inline duplicadas (`Button`, `Badge`, `Checkbox`, `Radio`, `DatePicker`,
  `DateRangePicker`, `DrawerPanel`, `EmptyState`, `FileUpload`, `Input`, `MultiSelect`,
  `SearchInput`, `ProgressBar`, `Stepper`, `Select`, `Skeleton`, `Toggle`, `Textarea`,
  `TimePicker`, `CheckboxGroup`, `RadioGroup`) y el tipo `Size` no exportado de `NumberInput`.
  `Spinner` (`'xs'..'xl'`) migra a `BipSizeExtended`. `Modal` (`'sm'|'md'|'lg'|'xl'`, sin `'xs'`)
  y `Avatar` (ya exporta su propio `AvatarSize` con nombre público) se dejan con su unión propia
  a propósito — forzarlos a `BipSize`/`BipSizeExtended` aceptaría o excluiría un valor sin
  respaldo real en su CSS.
- `.size-limit.json`: el límite del bundle barrel sube de 62 KB a 64 KB (medido: 62.52 KB) para
  reflejar el crecimiento real por `forwardRef`+`HTMLAttributes` en ~35 componentes — no es una
  regresión de tamaño accidental, es la nueva base legítima tras esta adición.

## [0.4.0] - 2026-08-07

### Added

- **Storybook 8.6 → 10.5.** `@storybook/addon-essentials` se disolvió en el core del paquete
  `storybook` en v9+ — se quitó de `.storybook/main.js`; sus doc blocks (`Meta`, usados en
  `Introduction.mdx`) ahora viven en `@storybook/addon-docs/blocks`, agregado como addon
  explícito. `parameters.a11y.config.rules` (usado para deshabilitar `color-contrast` en el
  panel del addon) no cambió de forma — sigue siendo `axe-core`'s `Spec`. Verificado con
  `pnpm test:visual:docker`: los 168 tests (theme-matrix, component-matrix, a11y-browser)
  pasan sin regenerar ningún baseline — cero deriva de IDs de story ni de rendering.
- **Internacionalización (i18n).** Nuevo sistema de diccionarios (`BipLocale`) resuelto vía
  contexto: todo `aria-label`/placeholder/texto visible que antes estaba quemado en español
  directamente en el JSX ahora se resuelve vía `useBipLocale()`, con `es-MX` como default
  byte-idéntico al comportamiento anterior. Nueva prop `locale` en `<ThemeProvider>` (sibling
  de `theme`/`tokens`/`radius`), acepta el diccionario completo (`esMX`, `enUS`, ambos
  exportados) o un override parcial que se fusiona sobre el diccionario del provider padre. El
  diccionario también lleva un tag BCP-47 (`locale.locale`) que alimenta los
  `Intl.DateTimeFormat` de `Calendar`/`DatePicker`/`DateRangePicker`, antes hardcodeados a
  `'es-MX'` a nivel de módulo. Ver story `Foundations/I18n` en Storybook.
- `formatCurrency`/`formatDate` (`shared-utils`) aceptan `locale`/`currency` opcionales — los
  defaults `es-MX`/MXN no cambian.
- `--provenance` en el publish de npm de ambos paquetes (`production.yml`) — badge de
  procedencia verificada, aprovechando el `id-token: write` ya declarado a nivel de workflow.
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
- `visual/component-matrix.spec.ts` — un screenshot por componente (48 de los 48 directorios
  de `src/components`; `ThemeProvider` no tiene UI propia) más un subset de 15 en RTL
  (`Sidebar`, `Toggle`, `Tooltip`, `Calendar`, `NumberInput`, `SearchInput`, `Input`, `Select`,
  `Dropdown`, `DrawerPanel`, `Tabs`, `Stepper`, `Timeline`, `MultiSelect`, `DatePicker` — los
  que tienen geometría direccional real). Antes las 8 baselines existentes cubrían solo
  ThemeProvider/Foundations; una regresión visual en un componente en sí no la detectaba
  nada. Guard de cobertura igual al de `a11y.test.tsx`: un componente nuevo sin entrada en
  `component-matrix.ts` falla el build.
- `visual/a11y-browser.spec.ts` — axe con `color-contrast` **activado**, en Chromium real vía
  `@axe-core/playwright`, contra los componentes en light y dark. Cierra el hueco que
  `a11y.test.tsx` deja explícito: happy-dom no resuelve `color-mix()`/custom properties con
  fidelidad suficiente para evaluar contraste renderizado. La primera corrida encontró 26
  violaciones reales — ver abajo.
- Nuevo token `--color-primary-text`: `--color-primary`/`--color-active` usados directamente
  como color de **texto** (no fill) medían 3.3–3.7:1 en dark contra superficies oscuras
  derivadas — bajo AA. En light es un alias directo a `--color-primary` (ya pasa, 8.2:1); en
  dark deriva con `color-mix(..., white 20%)`. Mismo mecanismo que `--color-danger-text` etc.
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
- `publint`/`@arethetypeswrong` (`pnpm --filter ui-components lint:package` y, ahora, también
  `pnpm --filter shared-utils lint:package`), wired into `pr-validation.yml`, para detectar
  regresiones de empaquetado (exports map, resolución de tipos) automáticamente en vez de a
  mano.
- Cobertura de tests (`@vitest/coverage-v8`, `pnpm test:coverage`) con umbral fijado al nivel
  actual, corriendo en CI, para **ambos** paquetes (`shared-utils` no tenía `vitest.config.ts`
  ni umbrales propios); reporter `lcov` agregado a los dos para habilitar badges/Codecov.
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
- **Cuatro componentes nuevos**, cerrando huecos identificados en una auditoría de completitud:
  `Slider`, `Popover` (compound: `Popover`/`PopoverTrigger`/`PopoverContent`, mismo patrón de
  contexto que `Dropdown`), `Link` (primer consumidor de los tokens `--color-link*`, ya
  declarados en `tokens.css` pero sin usar), y `VisuallyHidden` (hasta ahora solo existía como
  la clase global `.sr-only`). Los cuatro con tests, stories, y entrada en `a11y.test.tsx` y
  `visual/component-matrix.ts`.
- `mergeLocale` ahora se exporta desde el root del paquete (antes solo desde `i18n/index.ts`
  internamente) — necesario para componer diccionarios parciales por fuera de `ThemeProvider`.
- Matriz `react-compat` en `pr-validation.yml`: corre `test`+`typecheck` contra React 18 y 19
  reales — antes el soporte a React 19 solo estaba en el `peerDependencies`, sin verificación.

### Fixed

- **CI roto por el bump de `actions/setup-node` a v5** (ver entrada de node24 más abajo): v5
  estrena el input `package-manager-cache`, con default `true` — a diferencia de v4, ahora lee
  `"packageManager": "pnpm@9.15.9"` de `package.json` e invoca el binario `pnpm` para resolver
  qué cachear. Los 15 jobs del repo tenían el orden `setup-node` → `pnpm/action-setup`, así que
  pnpm todavía no estaba en el `PATH` en ese momento: `Error: Unable to locate executable file:
  pnpm`. Se invirtió el orden en los 15 jobs (`pnpm/action-setup` primero, patrón oficial de
  pnpm para CI) — con pnpm ya disponible, el auto-caché de v5 funciona sin configuración extra.
  De paso se encontró que los 3 pasos `actions/cache` manuales ("Setup pnpm cache") apuntaban a
  `~/.pnpm-store`, el default de pnpm 6/7 — pnpm 9 usa la ruta XDG (`~/.local/share/pnpm/store/v3`
  en Linux, confirmado con `pnpm store path`), así que llevaban tiempo cacheando una carpeta
  vacía sin ahorrar nada. Esos 3 pasos se eliminaron: el auto-caché de `setup-node@v5` ya cubre
  el store, con el path correcto, en los 15 jobs en vez de en 3.
- `eslint-plugin-storybook` se mantiene fijo en `0.12.0` (no en `^10.5.7`) — desde su release
  que acompaña a Storybook 9+, el paquete es ESM-only sin build CJS
  (`exports['.'] = { default: './dist/index.js' }`, sin condición `require`), y este repo
  todavía usa `.eslintrc.json` (ESLint 8 legacy config), cuyo `ConfigArrayFactory` carga
  plugins vía `require()` síncrono — falla con `ERR_REQUIRE_ESM`. `0.12.0` es la última
  versión con build CJS; sus reglas (CSF3, forma de `meta`/`title`) siguen aplicando sin
  cambios sobre Storybook 10 porque el formato CSF3 no cambió entre v8 y v10.
  `eslint-plugin-playwright@2.11.0` no tiene este problema — publica un `exports.require`
  (`index.cjs`) real junto al ESM, dual-package.
- `playwright.visual.config.ts`'s `webServer.command`: `pnpm storybook -- --ci --quiet`
  reenviaba un `--` literal al CLI de Storybook (`storybook dev -p 6006 -- --ci --quiet`), que
  el parser de Storybook 8 toleraba pero el de 9+ rechaza ("too many arguments for 'dev'.
  Expected 0 arguments but got 2") — todo lo posterior al `--` se trata como argumento
  posicional, no flag. Se quitó el separador redundante.
- `Odontogram`'s `ImagePopover`/`NotePopover` duplicaban a mano un `useFocusTrap` local
  (solo Tab-cycling, sin manejo de Escape ni restauración de foco) — reemplazado por el hook
  compartido `src/hooks/useFocusTrap.ts`. Comportamiento nuevo: el foco se restaura al elemento
  que abrió el popover al cerrarse (mejora, no regresión).
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
- **El i18n de la primera pasada quedó incompleto y el guard que debía impedirlo no lo
  detectaba.** `Table`, `DataTable`, `Calendar`, `FileUpload`, `MultiSelect`, `Odontogram`
  (`ToothSVG`/`ToothDetail`/`NotePopover`/`ImagePopover`) y el grid de abreviaturas de mes de
  `DatePicker`/`DateRangePicker` seguían con literales en español quemados en JSX — el string
  vivía dentro de una expresión (`placeholder={editable ? 'Escribe una nota...' : undefined}`,
  `{children ?? '...'}`) o era una palabra sin acento (`Guardar`, `Cancelar`, `Nota`), y
  `no-hardcoded-strings.test.ts`'s dos heurísticas originales (atributo con comillas dobles
  literales; nodo de texto JSX con acento y sin `{`) no cubrían ninguno de los dos casos.
  Se agregaron las claves faltantes a `BipLocale`/`es-MX.ts`/`en-US.ts` y se migraron los 7
  componentes a `useBipLocale()`; el guard se endureció con un escaneo genérico de literales de
  string en toda expresión JS más una heurística corta de stopwords en español (no solo
  acentos), y ya encontró un caso real al activarse (el `console.warn` de contraste de
  `ThemeProvider`, dev-only, ahora en su `ALLOWLIST` documentada). `dictionaries.test.ts`'s
  comparación de forma entre `esMX`/`enUS` pasó de comparar solo llaves de primer nivel a una
  comparación recursiva, para que una clave anidada faltante en un diccionario falle el build.
  De paso, `ThemeProvider`'s memoización de `locale` (`JSON.stringify(locale)`) no
  serializaba funciones — un override que cambiara solo una función de interpolación no
  disparaba el merge; el serializador ahora incluye `.toString()` de cada función en la clave.
- **`@bip-design-systems/shared-utils@0.1.0` no era importable.** Faltaba `"type": "module"`
  en su `package.json` pese a que `exports` solo declara la condición `"import"` y
  `dist/index.js` es ESM real — Node lo interpretaba como CommonJS y lanzaba `SyntaxError:
  Unexpected token 'export'` en cualquier `import`. Ver `CHANGELOG.md` de `shared-utils` para
  el detalle del fix.

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

[Unreleased]: https://github.com/egvictorino/Bip-Design-Systems/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/egvictorino/Bip-Design-Systems/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/egvictorino/Bip-Design-Systems/releases/tag/v0.3.0
