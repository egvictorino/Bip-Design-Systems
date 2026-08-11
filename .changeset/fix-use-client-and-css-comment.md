---
"@bip-design-systems/ui-components": patch
---

Corrige dos bugs de build detectados al consumir 0.4.0 desde un Server Component de Next.js:

- `src/index.css` tenía un comentario cuyo propio texto (`--duration-*/--ease-*`) contenía una
  secuencia `*/` incrustada, que cualquier stripper de comentarios interpreta como el cierre del
  comentario. Eso dejaba el resto del texto (`-ease-* (ver primitives.css) — colapsarlos a 0ms...`)
  como CSS crudo sin comentar en el bundle publicado, rompiendo el parseo completo de `dist/style.css`
  en bundlers estrictos (Turbopack). Reescrito para no contener la secuencia `*/` dentro del comentario.
- `LocaleContext.tsx`, los 9 componentes que llaman `useBipLocale()` directamente (`Alert`,
  `Breadcrumb`, `Card`, `ConfirmDialog`, `Link`, `Pagination`, `ProgressBar`, `Spinner`, `StatsCard`)
  y los 5 hooks exportados en la raíz (`useClickOutside`, `useDisclosure`, `useFocusTrap`,
  `useMediaQuery`, `useScrollLock`) no tenían la directiva `"use client"`, pese a usar
  `createContext`/hooks de React. Cualquier Server Component que los importara (directa o
  transitivamente) fallaba con `TypeError: createContext is not a function`, porque Next.js los
  bundlea bajo la condición `react-server` al no cruzar un boundary `"use client"` antes de llegar
  a ellos. Mismo patrón de bug ya corregido una vez para otro subconjunto de componentes (ver
  CHANGELOG de 0.2.8); esta vez tocó un subconjunto distinto que no se había auditado.
