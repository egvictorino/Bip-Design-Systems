/**
 * Escala de breakpoints — fuente única para `.module.css` (donde se escriben como literal,
 * ya que CSS no permite `var()` dentro de `@media`) y para `useMediaQuery` en runtime.
 * Estilo Tailwind, igual que `--space-*` en primitives.css.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/** `useMediaQuery(mediaQuery('md'))` — igual que escribir `@media (min-width: 768px)` a mano. */
export const mediaQuery = (breakpoint: BreakpointKey): string =>
  `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
