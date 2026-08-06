import React, { createContext, useContext } from 'react';

export type BipTheme = 'square' | 'rounded';
export type BipColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: BipTheme;
  colorScheme: BipColorScheme;
}

const DEFAULT_CONTEXT: ThemeContextValue = { theme: 'square', colorScheme: 'light' };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Sin <ThemeProvider> ancestro, el tema efectivo es square/light — coincide
 * con los valores por defecto declarados en :root (tokens.css, styles/themes.css),
 * así que componentes que usan createPortal (Modal, Toast, DrawerPanel,
 * Calendar, Odontogram popovers) pueden llamar useTheme()/useColorScheme()
 * sin exigir un provider.
 */
export const useTheme = (): BipTheme => (useContext(ThemeContext) ?? DEFAULT_CONTEXT).theme;

export const useColorScheme = (): BipColorScheme =>
  (useContext(ThemeContext) ?? DEFAULT_CONTEXT).colorScheme;

/**
 * Atributos data-* para estampar el eje de tema en un nodo portalled
 * (Modal, Toast, DrawerPanel, Calendar, Odontogram popovers) que vive
 * fuera del árbol DOM del provider y por eso no hereda el estampado
 * que hace <ThemeProvider> en su wrapper. Punto único a actualizar si
 * se agrega un tercer eje.
 */
export const useThemeAttributes = (): {
  'data-theme': BipTheme;
  'data-color-scheme': BipColorScheme;
} => {
  const { theme, colorScheme } = useContext(ThemeContext) ?? DEFAULT_CONTEXT;
  return { 'data-theme': theme, 'data-color-scheme': colorScheme };
};

export interface ThemeProviderProps {
  theme: BipTheme;
  /** @default 'light' */
  colorScheme?: BipColorScheme;
  children: React.ReactNode;
}

/**
 * `body { color: var(--color-txt); font-family: var(--font-sans); ... }`
 * (index.css) resuelve esas variables en la posición de `body` — fuera de
 * CUALQUIER nodo con data-theme/data-color-scheme propio — y los hijos
 * heredan el valor ya calculado, no una referencia viva a la variable. Todo
 * nodo que estampa un esquema distinto al de `body` (el wrapper de
 * ThemeProvider, y los 6 portales que usan useThemeAttributes() porque
 * createPortal los saca del subárbol DOM del provider hacia document.body)
 * debe re-declarar estas propiedades explícitamente para que sus
 * descendientes sin `color`/`font-family` propios (p. ej. CardHeader) las
 * re-resuelvan en su propia posición del árbol.
 */
export const THEME_RESET_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  letterSpacing: 'var(--font-letter-spacing)',
  color: 'var(--color-txt)',
};

/**
 * display:contents evita que el wrapper agregue una caja al layout —
 * es un drop-in transparente.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  colorScheme = 'light',
  children,
}) => (
  <ThemeContext.Provider value={{ theme, colorScheme }}>
    <div
      data-theme={theme}
      data-color-scheme={colorScheme}
      style={{ display: 'contents', ...THEME_RESET_STYLE }}
    >
      {children}
    </div>
  </ThemeContext.Provider>
);

ThemeProvider.displayName = 'ThemeProvider';
