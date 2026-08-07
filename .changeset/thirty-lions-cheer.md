---
"@bip-design-systems/ui-components": minor
---

Cierra varios huecos de empaquetado, superficie pública y foundations:

- Fix: `ThemeProvider` ahora declara `"use client"` — antes rompía en Next.js App Router al
  renderizarse desde un Server Component.
- Fix: mapa `exports` corregido (`types` antes que `import`) y ampliado con subpath exports
  (`@bip-design-systems/ui-components/Button`, etc.), aprovechando el build `preserveModules`.
- `peerDependencies` de React ampliado a `^18.2.0 || ^19.0.0`.
- Nuevos componentes: `Stack`, `Grid`, `Container`, `Text`, `Heading` (primitivos de layout y
  tipografía).
- Nuevos hooks públicos: `useClickOutside`, `useDisclosure`, `useFocusTrap`, `useMediaQuery`,
  `useScrollLock` — más `cn` ahora exportado desde el paquete.
- `Modal` y `DrawerPanel` refactorizados para compartir `useFocusTrap`/`useScrollLock` en vez
  de duplicar la lógica de focus trap y scroll lock.
- Nuevos tokens de breakpoint (`BREAKPOINTS`, `mediaQuery`) — fuente única para los `@media`
  que antes estaban hardcodeados en varios `.module.css`.
- Nuevas páginas de Storybook: `Introduction`, `Foundations/Typography`, `Foundations/Motion`,
  `Foundations/Breakpoints`.
- Fix: el focus ring de `.secondary` en `Button`, `.closeBtn` en `Alert` y `.confirmWarning` en
  `ConfirmDialog` ahora usa `var(--focus-ring)` en vez de un `box-shadow` hardcodeado —
  respetan la prop `focusRing` de `ThemeProvider`.
