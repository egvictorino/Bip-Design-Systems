## Resumen

<!-- Qué cambia y por qué, en 1-3 líneas. -->

## Checklist

- [ ] Rama sigue el flujo `feature/xxx → dev → qa → main` (ver CONTRIBUTING.md)
- [ ] `pnpm changeset` ejecutado si el PR toca `packages/*/src` (o `changeset add --empty` si no aplica)
- [ ] `CHANGELOG.md` actualizado bajo `## [Unreleased]` si el cambio es visible para consumidores
- [ ] Tests nuevos/actualizados para el cambio (`pnpm test`)
- [ ] Story nueva/actualizada si el cambio toca un componente
- [ ] `pnpm lint` y `pnpm typecheck` pasan en local
- [ ] Si el cambio es visual: baselines regeneradas con `pnpm test:visual:docker --update-snapshots` y revisadas a ojo

## Plan de pruebas

<!-- Cómo se verificó el cambio — comandos corridos, capturas si es visual. -->
