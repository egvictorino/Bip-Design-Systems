# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

## [0.1.1] - 2026-08-11

### Added

- `formatCurrency`/`formatDate` accept optional `locale`/`currency` overrides — the `es-MX`/MXN
  defaults are unchanged.

### Fixed

- **El paquete publicado (`0.1.0`) no era importable.** Faltaba `"type": "module"` en
  `package.json` pese a que `exports` solo declara la condición `"import"` y `dist/index.js` es
  ESM real — Node lo interpretaba como CommonJS y lanzaba `SyntaxError: Unexpected token
  'export'` en cualquier `import`. Se agregó `"type": "module"`, `"sideEffects": false`, y el
  gate `lint:package` (`publint` + `attw`, corrido ahora también en `pr-validation.yml`) para
  que este defecto falle en CI antes de publicarse.

## [0.1.0]

### Added

- `formatCurrency(amount: number): string` — formatea como moneda MXN usando locale `es-MX`.
- `formatDate(date: Date): string` — formatea fecha usando locale `es-MX`.
- `validateRFC(rfc: string): boolean` — valida formato de RFC mexicano (solo mayúsculas, sin
  normalización).
