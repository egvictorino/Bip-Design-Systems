"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { pickReadableText, contrastRatio } from '../../lib/contrast.js';
import { LocaleContext, mergeLocale, esMX } from '../../i18n/index.js';
import type { BipLocale, PartialBipLocale } from '../../i18n/index.js';

export type BipTheme = 'square' | 'rounded';
export type BipColorScheme = 'light' | 'dark';
/** Preferencia declarada por el consumidor — 'system' se resuelve a light/dark en runtime, nunca se estampa en el DOM. */
export type BipColorSchemePreference = BipColorScheme | 'system';

/**
 * Overrides de marca — cada clave mapea a una token "semilla" en tokens.css
 * (ver TOKEN_VAR_MAP). Sobrescribir una semilla recolorea automáticamente
 * toda su familia derivada (hover/press/focus/text/light/subtle) vía los
 * color-mix() ya declarados en tokens.css.
 */
export interface BipTokenOverrides {
  colorPrimary?: string;
  colorSecondary?: string;
  colorDanger?: string;
  colorInfo?: string;
  colorSuccess?: string;
  colorWarning?: string;
  colorUnique?: string;
  colorLink?: string;
  colorTxt?: string;
  colorSurface?: string;
  colorEdge?: string;
  colorField?: string;
  /** Sobrescribe --font-sans — p. ej. 'Poppins, sans-serif'. No varía por esquema. */
  fontFamily?: string;
}

/** Único punto a actualizar si se agrega una semilla nueva a tokens.css. */
export const TOKEN_VAR_MAP: Record<keyof BipTokenOverrides, string> = {
  colorPrimary: '--color-primary',
  colorSecondary: '--color-secondary',
  colorDanger: '--color-danger',
  colorInfo: '--color-info',
  colorSuccess: '--color-success',
  colorWarning: '--color-warning',
  colorUnique: '--color-unique',
  colorLink: '--color-link',
  colorTxt: '--color-txt',
  colorSurface: '--color-surface-1',
  colorEdge: '--color-edge',
  colorField: '--color-field',
  fontFamily: '--font-sans',
};

/**
 * Overrides de los 6 tokens semánticos de radius (styles/themes.css) — un
 * eje aparte de `tokens` porque no varía por esquema de color, sino por
 * `theme` (square/rounded), y porque cada override es independiente en vez
 * de derivarse de una única semilla como el eje de color.
 */
export interface BipRadiusOverrides {
  marker?: string;
  field?: string;
  control?: string;
  surface?: string;
  container?: string;
  containerLg?: string;
}

export const RADIUS_VAR_MAP: Record<keyof BipRadiusOverrides, string> = {
  marker: '--radius-marker',
  field: '--radius-field',
  control: '--radius-control',
  surface: '--radius-surface',
  container: '--radius-container',
  containerLg: '--radius-container-lg',
};

/**
 * Overrides del anillo de foco — reemplaza el `box-shadow: 0 0 0 2px
 * var(--color-surface-1), 0 0 0 4px var(--color-primary)` que antes se
 * repetía a mano en cada componente (ver `--focus-ring` en primitives.css).
 */
export interface BipFocusRingOverrides {
  width?: string;
  offset?: string;
  color?: string;
}

export const FOCUS_RING_VAR_MAP: Record<keyof BipFocusRingOverrides, string> = {
  width: '--focus-ring-width',
  offset: '--focus-ring-offset',
  color: '--focus-ring-color',
};

/** Overrides de motion — duraciones/easings de primitives.css. */
export interface BipMotionOverrides {
  durationInstant?: string;
  durationFast?: string;
  durationNormal?: string;
  durationSlow?: string;
  easeStandard?: string;
  easeOut?: string;
  easeIn?: string;
}

export const MOTION_VAR_MAP: Record<keyof BipMotionOverrides, string> = {
  durationInstant: '--duration-instant',
  durationFast: '--duration-fast',
  durationNormal: '--duration-normal',
  durationSlow: '--duration-slow',
  easeStandard: '--ease-standard',
  easeOut: '--ease-out',
  easeIn: '--ease-in',
};

export type BipDensity = 'comfortable' | 'compact';
export type BipDirection = 'ltr' | 'rtl';

/**
 * Overrides de la horquilla de padding de controles (density.css) — la parte de la
 * escala --space-* donde compact/comfortable realmente cambia el layout. El resto de
 * --space-* (gaps, paddings de superficie, etc.) es invariante a densidad por diseño.
 */
export interface BipSpacingOverrides {
  controlXSm?: string;
  controlYSm?: string;
  controlXMd?: string;
  controlYMd?: string;
  controlXLg?: string;
  controlYLg?: string;
}

export const SPACING_VAR_MAP: Record<keyof BipSpacingOverrides, string> = {
  controlXSm: '--space-control-x-sm',
  controlYSm: '--space-control-y-sm',
  controlXMd: '--space-control-x-md',
  controlYMd: '--space-control-y-md',
  controlXLg: '--space-control-x-lg',
  controlYLg: '--space-control-y-lg',
};

/**
 * Resuelve cualquier objeto de overrides "plano" (radius/focusRing/motion —
 * cada clave independiente, a diferencia de `tokens` que deriva toda una
 * familia de una sola semilla) contra su *_VAR_MAP correspondiente.
 */
const resolveVarMap = <T extends object>(
  overrides: T | undefined,
  map: Record<keyof T, string>
): Record<string, string> => {
  if (!overrides) return {};
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(overrides) as [keyof T, string | undefined][]) {
    if (value === undefined) continue;
    vars[map[key]] = value;
  }
  return vars;
};

/**
 * Semillas de relleno de marca — al sobrescribirlas, se recalcula con
 * pickReadableText() el token --color-txt-on-* correspondiente (ver
 * tokens.css § contraste automático). Solo las semillas usadas como fondo
 * sólido con texto encima entran aquí — colorSecondary/colorSurface/etc.
 * no tienen contraparte --color-txt-on-* porque hoy ningún componente pinta
 * texto plano sobre ellas.
 */
export const ON_TEXT_VAR_MAP: Partial<Record<keyof BipTokenOverrides, string>> = {
  colorPrimary: '--color-txt-on-primary',
  colorDanger: '--color-txt-on-danger',
  colorSuccess: '--color-txt-on-success',
  colorWarning: '--color-txt-on-warning',
  colorInfo: '--color-txt-on-info',
  colorUnique: '--color-txt-on-unique',
};

export interface ThemeControls {
  theme: BipTheme;
  /** Preferencia declarada — puede ser 'system'; usar `resolvedColorScheme` para pintar el icono sol/luna. */
  colorScheme: BipColorSchemePreference;
  resolvedColorScheme: BipColorScheme;
  setTheme: (theme: BipTheme) => void;
  setColorScheme: (colorScheme: BipColorSchemePreference) => void;
  /** Alterna entre light/dark. Si la preferencia actual es 'system', parte del valor resuelto. */
  toggleColorScheme: () => void;
}

const NOOP_CONTROLS: ThemeControls = {
  theme: 'square',
  colorScheme: 'light',
  resolvedColorScheme: 'light',
  setTheme: () => {},
  setColorScheme: () => {},
  toggleColorScheme: () => {},
};

interface ThemeContextValue {
  theme: BipTheme;
  colorScheme: BipColorScheme;
  /** undefined = sin opinión, cae al default CSS (:root, [data-density='comfortable']). */
  density: BipDensity | undefined;
  /** undefined = sin opinión, cae al default del navegador (ltr) — ver styles/rtl.css. */
  dir: BipDirection | undefined;
  /** Vars CSS resueltas acumuladas (padre + propias) — ver ThemeProvider. */
  resolvedVars: Record<string, string>;
  controls: ThemeControls;
}

const DEFAULT_CONTEXT: ThemeContextValue = {
  theme: 'square',
  colorScheme: 'light',
  density: undefined,
  dir: undefined,
  resolvedVars: {},
  controls: NOOP_CONTROLS,
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * SSR-safe: getServerSnapshot devuelve 'light' (coincide con el default de
 * :root en tokens.css), y solo se re-suscribe a matchMedia en el cliente.
 */
const getSystemColorScheme = (): BipColorScheme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const subscribeToSystemColorScheme = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

/** Sigue `prefers-color-scheme` del SO en vivo. Usado internamente cuando `colorScheme="system"`. */
const useSystemColorScheme = (): BipColorScheme =>
  useSyncExternalStore(subscribeToSystemColorScheme, getSystemColorScheme, () => 'light');

interface StoredThemePreference {
  theme?: BipTheme;
  colorScheme?: BipColorSchemePreference;
}

const readStoredPreference = (storageKey: string): StoredThemePreference | null => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as StoredThemePreference) : null;
  } catch {
    // localStorage inaccesible (modo privado) o valor corrupto — se ignora, quedan los defaults.
    return null;
  }
};

const writeStoredPreference = (storageKey: string, value: StoredThemePreference): void => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Safari en modo privado lanza en setItem — la persistencia es best-effort.
  }
};

/**
 * Hook para leer/mutar el tema desde cualquier descendiente sin levantar
 * estado propio — p. ej. un botón de toggle light/dark. Sin <ThemeProvider>
 * ancestro (o si el axis correspondiente es controlado por props), los
 * setters son no-op.
 */
export const useThemeControls = (): ThemeControls =>
  (useContext(ThemeContext) ?? DEFAULT_CONTEXT).controls;

/** Evita re-avisar el mismo hex en cada render — solo una vez por valor visto. */
const warnedLowContrastValues = new Set<string>();

/**
 * WCAG AA para texto normal (4.5:1) — el mismo umbral que
 * `pickReadableText()` no puede garantizar cuando ninguna de las dos
 * opciones (blanco/oscuro del sistema) alcanza un contraste aceptable
 * contra un override extremo (p. ej. un gris medio).
 */
const AA_CONTRAST_THRESHOLD = 4.5;

const warnIfLowContrast = (seedKey: string, hex: string, onTextHex: string): void => {
  if (process.env.NODE_ENV === 'production') return;
  if (warnedLowContrastValues.has(hex)) return;
  const ratio = contrastRatio(hex, onTextHex);
  if (ratio >= AA_CONTRAST_THRESHOLD) return;
  warnedLowContrastValues.add(hex);
  // eslint-disable-next-line no-console
  console.warn(
    `[bip-design-systems] tokens.${seedKey}="${hex}" no alcanza contraste WCAG AA (${ratio.toFixed(2)}:1, ` +
      `mínimo 4.5:1) contra el texto calculado (${onTextHex}). Prueba un tono más saturado u oscuro/claro.`
  );
};

/**
 * Resuelve el mapa final { '--color-primary': '#...' } a partir de los
 * overrides comunes + el refinamiento del esquema activo + el escape hatch
 * cssVars, en ese orden (cada capa pisa a la anterior).
 */
export const resolveTokenVars = (
  tokens: (BipTokenOverrides & { light?: BipTokenOverrides; dark?: BipTokenOverrides }) | undefined,
  colorScheme: BipColorScheme,
  cssVars: Record<string, string> | undefined
): Record<string, string> => {
  if (!tokens && !cssVars) return {};

  const { light, dark, ...base } = tokens ?? {};
  const scoped = colorScheme === 'dark' ? dark : light;
  const merged: BipTokenOverrides = { ...base, ...scoped };

  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined) continue;
    const typedKey = key as keyof BipTokenOverrides;
    vars[TOKEN_VAR_MAP[typedKey]] = value;

    const onTextVar = ON_TEXT_VAR_MAP[typedKey];
    if (onTextVar) {
      const onTextHex = pickReadableText(value);
      vars[onTextVar] = onTextHex;
      warnIfLowContrast(typedKey, value, onTextHex);
    }
  }
  return { ...vars, ...cssVars };
};

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

/** undefined si el provider no fija `density` — cae al default CSS (comfortable). */
export const useDensity = (): BipDensity | undefined =>
  (useContext(ThemeContext) ?? DEFAULT_CONTEXT).density;

/** undefined si el provider no fija `dir` — cae al default del navegador (ltr). */
export const useDir = (): BipDirection | undefined =>
  (useContext(ThemeContext) ?? DEFAULT_CONTEXT).dir;

/**
 * Atributos data-* / dir + style para estampar el eje de tema (incluidas las vars
 * de marca resueltas) en un nodo portalled (Modal, Toast, DrawerPanel,
 * Calendar, Odontogram popovers) que vive fuera del árbol DOM del provider
 * y por eso no hereda ni el estampado ni las custom properties que hace
 * <ThemeProvider> en su wrapper. `style` ya incluye THEME_RESET_STYLE, así
 * que los call sites no necesitan importarlo aparte. `data-density`/`dir`
 * solo se incluyen cuando el provider los fija — omitirlos dejaría el
 * atributo con valor `"undefined"` en el DOM en vez de simplemente no
 * estar presente. `dir` es un atributo HTML nativo (no data-*): portales
 * lo necesitan explícito porque `[dir='rtl']` en rtl.css no cruza el
 * límite del portal hacia document.body.
 */
export const useThemeAttributes = (): {
  'data-theme': BipTheme;
  'data-color-scheme': BipColorScheme;
  'data-density'?: BipDensity;
  dir?: BipDirection;
  style: React.CSSProperties;
} => {
  const { theme, colorScheme, density, dir, resolvedVars } = useContext(ThemeContext) ?? DEFAULT_CONTEXT;
  return {
    'data-theme': theme,
    'data-color-scheme': colorScheme,
    ...(density ? { 'data-density': density } : {}),
    ...(dir ? { dir } : {}),
    style: { ...THEME_RESET_STYLE, ...resolvedVars },
  };
};

export interface ThemeProviderProps {
  /** Controlado. Si se omite, el componente maneja su propio estado (ver `defaultTheme`). */
  theme?: BipTheme;
  /** Valor inicial en modo no-controlado. @default 'square' */
  defaultTheme?: BipTheme;
  /** Controlado. Acepta 'system' para seguir prefers-color-scheme del SO. */
  colorScheme?: BipColorSchemePreference;
  /** Valor inicial en modo no-controlado. @default 'light' */
  defaultColorScheme?: BipColorSchemePreference;
  /**
   * Activa persistencia en localStorage bajo esta key — solo afecta los ejes
   * no-controlados. Combinar con `getThemeInitScript({ storageKey })` en el
   * <head> del documento para evitar el flash de tema por defecto en el
   * primer paint (ver README § Theming).
   */
  storageKey?: string;
  /** Overrides de marca comunes a ambos esquemas, con refinamiento opcional por esquema. */
  tokens?: BipTokenOverrides & { light?: BipTokenOverrides; dark?: BipTokenOverrides };
  /** Overrides de los tokens semánticos de radius — independiente de `theme`. */
  radius?: BipRadiusOverrides;
  /** Overrides del anillo de foco (width/offset/color) — ver `--focus-ring` en primitives.css. */
  focusRing?: BipFocusRingOverrides;
  /** Overrides de duración/easing de transiciones — ver primitives.css. */
  motion?: BipMotionOverrides;
  /**
   * 'compact' | 'comfortable' — estampa data-density en el wrapper (ver density.css).
   * A diferencia de theme/colorScheme, no es controlado/no-controlado con persistencia
   * propia: es un valor directo, como radius/focusRing/motion. @default sin fijar (cae
   * al default CSS, comfortable).
   */
  density?: BipDensity;
  /** Overrides de la horquilla de padding de controles — ver density.css. */
  spacing?: BipSpacingOverrides;
  /**
   * 'ltr' | 'rtl' — estampa el atributo HTML nativo `dir` en el wrapper (ver
   * styles/rtl.css § --rtl-x). Mismo tratamiento que `density`: valor directo, sin
   * modo controlado/no-controlado propio; un provider anidado sin `dir` hereda el
   * del padre. @default sin fijar (cae al default del navegador, ltr).
   */
  dir?: BipDirection;
  /** Escape hatch: cualquier custom property, p. ej. { '--color-selected': '#...' }. Gana sobre el resto de ejes. */
  cssVars?: Record<string, string>;
  /**
   * Diccionario de textos (aria-label, placeholders, formatos Intl) — ver `src/i18n`.
   * Acepta el diccionario completo (`enUS`) o un override parcial, que se fusiona sobre
   * el diccionario del provider padre si lo hay, o sobre `esMX` (default) si no. No
   * afecta `resolvedVars`/CSS — es contexto de React aparte, vía `LocaleContext`.
   */
  locale?: BipLocale | PartialBipLocale;
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
 *
 * `resolvedVars` acumula las vars del provider padre (si lo hay) más las
 * propias, y se aplican siempre en el wrapper — no se depende de la
 * herencia CSS del padre para que el valor sea correcto incluso si algo
 * en el medio rompe la cadena de herencia.
 *
 * theme/colorScheme son controlado-u-no-controlado (patrón React estándar):
 * si llega el prop, manda; si no, se usa estado interno sembrado por
 * `defaultTheme`/`defaultColorScheme`. `colorScheme='system'` se resuelve
 * en vivo vía useSystemColorScheme() pero NUNCA se estampa como tal en el
 * DOM — tokens.css solo entiende light/dark.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme: themeProp,
  defaultTheme = 'square',
  colorScheme: colorSchemeProp,
  defaultColorScheme = 'light',
  storageKey,
  tokens,
  radius,
  focusRing,
  motion,
  density: densityProp,
  spacing,
  dir: dirProp,
  cssVars,
  locale,
  children,
}) => {
  const [internalTheme, setInternalTheme] = useState<BipTheme>(defaultTheme);
  const [internalColorScheme, setInternalColorScheme] =
    useState<BipColorSchemePreference>(defaultColorScheme);

  // Hidratación desde localStorage — deliberadamente solo al montar/cambiar
  // storageKey, no en cada cambio de themeProp/colorSchemeProp (solo se leen
  // para decidir si el axis es controlado en ese instante).
  useEffect(() => {
    if (!storageKey) return;
    const saved = readStoredPreference(storageKey);
    if (!saved) return;
    if (themeProp === undefined && saved.theme) setInternalTheme(saved.theme);
    if (colorSchemeProp === undefined && saved.colorScheme) setInternalColorScheme(saved.colorScheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const theme = themeProp ?? internalTheme;
  const colorSchemePreference = colorSchemeProp ?? internalColorScheme;
  const systemColorScheme = useSystemColorScheme();
  const colorScheme: BipColorScheme =
    colorSchemePreference === 'system' ? systemColorScheme : colorSchemePreference;

  // Simétrico a la hidratación de arriba: un axis controlado nunca se escribe, para no
  // persistir un valor que el prop ya manda y que la próxima lectura ignoraría de todas
  // formas — evita además pisar en disco la última preferencia no-controlada conocida de
  // ESE axis con el valor que el padre le está imponiendo ahora.
  useEffect(() => {
    if (!storageKey) return;
    const value: StoredThemePreference = {};
    if (themeProp === undefined) value.theme = theme;
    if (colorSchemeProp === undefined) value.colorScheme = colorSchemePreference;
    if (Object.keys(value).length === 0) return;
    writeStoredPreference(storageKey, value);
  }, [storageKey, theme, colorSchemePreference, themeProp, colorSchemeProp]);

  const setTheme = useCallback((next: BipTheme) => setInternalTheme(next), []);
  const setColorScheme = useCallback(
    (next: BipColorSchemePreference) => setInternalColorScheme(next),
    []
  );
  const toggleColorScheme = useCallback(() => {
    setInternalColorScheme((prev) => {
      const resolved = prev === 'system' ? getSystemColorScheme() : prev;
      return resolved === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const parentContext = useContext(ThemeContext);

  // density/dir no tienen forma no-controlada propia (ver ThemeProviderProps) — si no
  // se fijan en esta instancia, heredan la del provider padre, igual que resolvedVars.
  const density = densityProp ?? parentContext?.density;
  const dir = dirProp ?? parentContext?.dir;

  // Los overrides (tokens/radius/focusRing/motion/spacing/cssVars) casi siempre
  // llegan como literales inline (`tokens={{ colorPrimary: '#...' }}`), que cambian
  // de identidad en cada render del padre aunque el contenido sea idéntico.
  // Comparar por valor (JSON.stringify) evita que resolvedVars — y con él,
  // todo el subárbol que lee sus vars — se recalcule en cada render.
  const overridesKey = JSON.stringify([tokens, radius, focusRing, motion, spacing, cssVars]);
  const resolvedVars = useMemo(
    () => ({
      ...(parentContext?.resolvedVars ?? {}),
      // cssVars se aplica al final (más abajo) para que gane sobre el resto,
      // por eso no se pasa aquí — resolveTokenVars también lo acepta cuando se
      // llama standalone (ver tests), pero el componente resuelve la precedencia él mismo.
      ...resolveTokenVars(tokens, colorScheme, undefined),
      ...resolveVarMap(radius, RADIUS_VAR_MAP),
      ...resolveVarMap(focusRing, FOCUS_RING_VAR_MAP),
      ...resolveVarMap(motion, MOTION_VAR_MAP),
      ...resolveVarMap(spacing, SPACING_VAR_MAP),
      ...cssVars,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- overridesKey ya cubre tokens/radius/focusRing/motion/spacing/cssVars por valor
    [parentContext, colorScheme, overridesKey]
  );

  const parentLocale = useContext(LocaleContext);
  const localeKey = JSON.stringify(locale);
  // mergeLocale funciona tanto para overrides parciales como para un diccionario completo
  // (p. ej. `locale={enUS}`) — cada clave de un objeto completo pisa la del padre igual.
  const resolvedLocale = useMemo(
    () => mergeLocale(parentLocale ?? esMX, locale as PartialBipLocale | undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- localeKey ya cubre `locale` por valor
    [parentLocale, localeKey]
  );

  const controls = useMemo<ThemeControls>(
    () => ({
      theme,
      colorScheme: colorSchemePreference,
      resolvedColorScheme: colorScheme,
      setTheme,
      setColorScheme,
      toggleColorScheme,
    }),
    [theme, colorSchemePreference, colorScheme, setTheme, setColorScheme, toggleColorScheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, density, dir, resolvedVars, controls }}>
      <LocaleContext.Provider value={resolvedLocale}>
        <div
          data-theme={theme}
          data-color-scheme={colorScheme}
          data-density={density}
          dir={dir}
          style={{ display: 'contents', ...THEME_RESET_STYLE, ...resolvedVars }}
        >
          {children}
        </div>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

export interface ThemeInitScriptOptions {
  /** Debe coincidir con el `storageKey` pasado a <ThemeProvider>. */
  storageKey?: string;
  defaultTheme?: BipTheme;
  defaultColorScheme?: BipColorSchemePreference;
}

/**
 * Devuelve el string de un script síncrono para inlinear en el <head> del
 * documento, ANTES de cualquier CSS/hidratación — es la única forma de
 * evitar el flash de tema por defecto (FOUC) en el primer paint. Lee
 * localStorage (si hay storageKey) y prefers-color-scheme, y estampa
 * data-theme/data-color-scheme en <html>. El selector doble en tokens.css
 * (`:root[data-color-scheme='dark'], [data-color-scheme='dark']`) ya
 * soporta que el atributo viva ahí.
 *
 * Uso (Next.js App Router, layout.tsx):
 *   <head>
 *     <script dangerouslySetInnerHTML={{ __html: getThemeInitScript({ storageKey: 'bip-theme' }) }} />
 *   </head>
 */
export const getThemeInitScript = (options: ThemeInitScriptOptions = {}): string => {
  const { storageKey, defaultTheme = 'square', defaultColorScheme = 'light' } = options;
  const storageRead = storageKey
    ? `var raw=localStorage.getItem(${JSON.stringify(storageKey)});if(raw){var saved=JSON.parse(raw);if(saved.theme)t=saved.theme;if(saved.colorScheme)c=saved.colorScheme;}`
    : '';
  return (
    `(function(){try{` +
    `var d=document.documentElement;` +
    `var t=${JSON.stringify(defaultTheme)};` +
    `var c=${JSON.stringify(defaultColorScheme)};` +
    storageRead +
    `if(c==='system'){c=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}` +
    `d.setAttribute('data-theme',t);` +
    `d.setAttribute('data-color-scheme',c);` +
    `}catch(e){}})();`
  );
};
