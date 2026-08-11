---
"@bip-design-systems/ui-components": patch
---

Corrige el warning de consola "Received an empty string for a boolean attribute `inert`"
en `Navbar` bajo React 19, reportado al consumir el paquete desde un proyecto real
(Next.js App Router).

`Navbar`'s panel móvil pasaba `inert={isMobileOpen ? undefined : ''}` como prop JSX. Esto
resultó ser incompatible entre las dos versiones de React que el paquete declara soportar
como peer:

- **React 18** no tiene `inert` en su tabla de atributos-booleanos-conocidos — un valor
  `boolean` (`true`) se descarta en silencio; solo un `string` (`''` o `'true'`) llega al
  DOM. Por eso el código original usaba `''`.
- **React 19** sí agregó `inert` a esa tabla — para un atributo booleano conocido, un valor
  no-booleano como `''` genera el warning y, según el propio mensaje, "se trata como si
  fuera `false`" (el atributo tampoco se aplica).

Es decir, ningún valor único de la prop JSX satisface a las dos versiones simultáneamente:
con `''` el panel nunca queda realmente `inert` bajo React 19 (más el warning); con `true`
nunca queda `inert` bajo React 18 (verificado empíricamente en la suite de tests, que corre
sobre React 18 — un test que aserta `hasAttribute('inert') === true` con `inert={true}`
falla ahí).

**Solución**: se dejó de pasar `inert` como prop JSX. Ahora se asigna vía la propiedad DOM
imperativa (`element.inert = boolean`, un `ref` + `useLayoutEffect`), que es la API nativa
del navegador (Baseline desde 2023) y no pasa por la traducción prop→atributo de React —
evitando la inconsistencia entre versiones por completo. Se agregó un test de regresión en
`Navbar.test.tsx` que verifica la presencia/ausencia real del atributo `inert` en el DOM
al abrir/cerrar el menú móvil.

También se elimina `src/react-inert.d.ts` (el augmentation de tipos que declaraba
`inert?: boolean | ''` en `React.HTMLAttributes`): ya no lo usa ningún componente del
paquete, y no participaba del build publicado (no estaba referenciado desde `index.ts`),
así que su remoción no es un cambio observable para quien consume el paquete.
