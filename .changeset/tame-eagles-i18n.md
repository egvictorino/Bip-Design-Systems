---
"@bip-design-systems/ui-components": minor
---

Agrega internacionalización (i18n): nueva prop `locale` en `<ThemeProvider>`, diccionarios
`esMX`/`enUS` exportados, y hook `useBipLocale()`. Los ~100 `aria-label`/placeholders/textos
que antes estaban quemados en español directamente en el JSX de 28 componentes ahora se
resuelven vía contexto, con `es-MX` como default idéntico al comportamiento anterior — sin
cambios visuales para consumidores existentes que no configuren `locale`. El diccionario
también alimenta los formatos `Intl.DateTimeFormat` de `Calendar`/`DatePicker`/
`DateRangePicker`.

Fix: dedup de `useFocusTrap` en `Odontogram`'s `ImagePopover`/`NotePopover` — ahora usan el
hook compartido `src/hooks/useFocusTrap.ts` en vez de una copia local, ganando restauración de
foco al cerrar.

`--provenance` en el publish de npm de ambos paquetes.
