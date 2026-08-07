# Security Policy

## Reporting a Vulnerability

Si encuentras una vulnerabilidad de seguridad en `@bip-design-systems/ui-components` o
`@bip-design-systems/shared-utils`, repórtala de forma privada vía
[GitHub Security Advisories](https://github.com/egvictorino/Bip-Design-Systems/security/advisories/new)
en lugar de abrir un issue público.

Incluye:

- Versión del paquete afectada
- Pasos para reproducir
- Impacto potencial

## Versiones soportadas

Solo la última versión publicada de cada paquete recibe parches de seguridad — no hay
mantenimiento de versiones anteriores (proyecto en línea 0.x, ver `CLAUDE.md` § Versioning).

## Auditoría automatizada

`production.yml`'s `validate` job corre `pnpm audit --audit-level=high` en cada push a `main`
y bloquea el release si falla. `pr-validation.yml` corre una auditoría equivalente
(`--audit-level=moderate`, no bloqueante) en PRs hacia `qa`. Dependencias con CVEs conocidos y
sin fix upstream disponible se fijan vía `pnpm.overrides` en el `package.json` raíz.
