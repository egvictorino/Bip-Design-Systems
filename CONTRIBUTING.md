# Contributing

## Setup

```bash
pnpm install
pnpm --filter @bip-design-systems/shared-utils build   # shared-utils primero
pnpm --filter @bip-design-systems/ui-components build
pnpm --filter @bip-design-systems/ui-components storybook   # http://localhost:6006
```

Requiere Node ≥ 20 y pnpm ≥ 9.15.9 (`packageManager` en `package.json` raíz).

## Flujo de ramas

```
main (producción)  ←  qa (testing)  ←  dev (desarrollo)  ←  feature/xxx
```

- Todo cambio nace en `feature/xxx` (o `fix/xxx`) desde `dev`.
- PRs siempre van `feature/xxx → dev → qa → main` — nunca directo a `qa`/`main` salvo hotfix.
- Hotfixes nacen de `main` y se cherry-pickean de vuelta a `qa` y `dev`.
- `pr-validation.yml`'s `validate-pr` job hace cumplir este flujo automáticamente y rechaza
  PRs con la combinación base/head equivocada.

### Tags de release

Los tags `v2026.MM.DD-N` (p. ej. `v2026.03.20-35`) son de un esquema anterior a Changesets,
basado en fecha — no reflejan versión semántica y no se generan más. Desde `0.3.0`, cada
release a `main` emite un tag `v<semver>` (p. ej. `v0.3.0`), calculado por Changesets y
publicado automáticamente por el job `create-release` de `production.yml`. Los tags viejos se
dejan tal cual (reescribir historia publicada no vale el riesgo); si corres `git describe`
contra un commit anterior a `0.3.0` verás el esquema de fecha, y a partir de ahí el semver.

## Antes de abrir un PR

1. **Tests** — `pnpm test` (ambos paquetes) debe pasar. Nuevo componente o hook ⇒ nuevo
   `*.test.tsx`/`*.test.ts` junto al archivo.
2. **Lint y typecheck** — `pnpm lint` y `pnpm typecheck`.
3. **Changeset** — si el PR toca `packages/*/src`, corre `pnpm changeset` (elige el/los
   paquete(s) afectados y el tipo de bump) y commitea el archivo `.changeset/<nombre>.md` que
   genera. Si el cambio no amerita release (docs, CI, tests), usa
   `pnpm exec changeset add --empty` para satisfacer el gate sin bump.
   `pr-validation.yml`'s `changeset-check` job (solo en PRs hacia `dev`) falla si falta.
4. **CHANGELOG.md** — añade una entrada en `packages/ui-components/CHANGELOG.md` bajo
   `## [Unreleased]` (Keep a Changelog format) en el mismo PR, si el cambio es visible para
   consumidores del paquete.
5. **Componente nuevo** — sigue la estructura y los cuatro registros obligatorios (ver abajo).
6. **Cambio visual** — regenera baselines con `pnpm test:visual:docker --update-snapshots`
   (nunca nativo en macOS/Windows, ver más abajo) y revisa el diff a ojo antes de commitear.

## Estructura de un componente nuevo

```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
├── ComponentName.stories.tsx
├── ComponentName.test.tsx
└── index.ts
```

Ver `CLAUDE.md` § Component Patterns para el template completo (forwardRef vs React.FC,
`displayName` obligatorio, tokens de diseño, propiedades lógicas para RTL, patrón compound
component). Al terminar, un componente nuevo necesita **cuatro registros** o el build falla:

1. `src/index.ts` — exportar el componente y sus tipos.
2. `src/a11y.test.tsx` — entrada en `REGISTRY` (o `SKIP_LIST` si no renderiza UI propia). El
   test de cobertura al final del archivo falla si falta.
3. `visual/component-matrix.ts` — entrada con `storyId`. Obtén el ID real corriendo Storybook
   y consultando `curl http://localhost:6006/index.json` — no lo derives a mano.
4. Changeset + entrada en `CHANGELOG.md` (ver arriba).

## Regresión visual

**Nunca corras `pnpm --filter ui-components test:visual` de forma nativa en macOS/Windows** —
las baselines están generadas en Linux vía Docker y un run nativo fallará por diseño con
"snapshot missing" en vez de generar un set `-darwin.png` divergente. Usa siempre:

```bash
pnpm test:visual:docker                    # verificar contra baselines existentes
pnpm test:visual:docker --update-snapshots # regenerar tras un cambio visual deliberado
```

Ver `CLAUDE.md` § Visual regression para el detalle de por qué (imagen Docker pineada a la
versión exacta de `@playwright/test`, timeouts especiales para `Foundations/Colors`, etc.).

## Reportar un bug

Abre un issue con: versión del paquete, pasos para reproducir, comportamiento esperado vs
observado. Para vulnerabilidades de seguridad, ver `SECURITY.md` en vez de un issue público.
