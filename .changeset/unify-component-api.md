---
"@bip-design-systems/ui-components": minor
---

Unifica nombres/valores de props inconsistentes entre componentes hermanos (`error`→`danger`,
`isOpen`→`open`+`onOpenChange`, firmas de callbacks, `size`/`variant`/`disabled` vocabulario) como
preparación para congelar la API antes de 1.0.0. Ver la sección "Migration 0.4.x → 0.5.0" del
README y el CHANGELOG para la tabla completa de renames. Breaking, aceptado dentro del versionado
0.x (bump `minor` por convención de este repo — ver CLAUDE.md § Versioning).

También, de forma aditiva: `forwardRef` en ~35 componentes que antes descartaban el `ref`;
`style`/`id`/`data-*`/`aria-*` habilitados en ~24 componentes que solo aceptaban `className`;
tipos compartidos `BipSize`/`BipSizeExtended` reemplazando 21 unions `'sm'|'md'|'lg'` duplicadas.
