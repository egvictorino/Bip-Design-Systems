# Changelog

Todos los cambios notables de este paquete se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa versionado [SemVer](https://semver.org/lang/es/) dentro de la línea 0.x
(cambios `minor` pueden ser incompatibles hasta llegar a 1.0.0).

## [Unreleased]

### Added

- `formatCurrency`/`formatDate` accept optional `locale`/`currency` overrides — the `es-MX`/MXN
  defaults are unchanged.

## [0.1.0]

### Added

- `formatCurrency(amount: number): string` — formatea como moneda MXN usando locale `es-MX`.
- `formatDate(date: Date): string` — formatea fecha usando locale `es-MX`.
- `validateRFC(rfc: string): boolean` — valida formato de RFC mexicano (solo mayúsculas, sin
  normalización).
