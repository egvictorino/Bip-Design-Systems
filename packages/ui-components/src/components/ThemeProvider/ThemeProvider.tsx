import React, { createContext, useContext } from 'react';

export type BipTheme = 'square' | 'rounded';

const ThemeContext = createContext<BipTheme | null>(null);

/**
 * Sin <ThemeProvider> ancestro, el tema efectivo es 'square' — coincide
 * con los valores por defecto declarados en :root (styles/themes.css),
 * así que componentes que usan createPortal (Modal, Toast, DrawerPanel,
 * Calendar, Odontogram popovers) pueden llamar useTheme() sin exigir
 * un provider.
 */
export const useTheme = (): BipTheme => useContext(ThemeContext) ?? 'square';

export interface ThemeProviderProps {
  theme: BipTheme;
  children: React.ReactNode;
}

/**
 * display:contents evita que el wrapper agregue una caja al layout —
 * es un drop-in transparente. Vuelve a declarar font-family/letter-spacing
 * explícitamente porque esas propiedades se heredan por cascada normal
 * desde `body`, no se re-resuelven automáticamente al cambiar --font-sans
 * en un descendiente.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>
    <div
      data-theme={theme}
      style={{
        display: 'contents',
        fontFamily: 'var(--font-sans)',
        letterSpacing: 'var(--font-letter-spacing)',
      }}
    >
      {children}
    </div>
  </ThemeContext.Provider>
);

ThemeProvider.displayName = 'ThemeProvider';
