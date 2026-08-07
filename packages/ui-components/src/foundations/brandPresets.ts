import type { BipTokenOverrides } from '../components/ThemeProvider/index.js';

/**
 * Presets de marca para el toolbar de Storybook y la story
 * `Foundations/Theming` — cada uno se pasa tal cual como prop `tokens` de
 * <ThemeProvider>. `canary` es deliberadamente un amarillo claro: es el caso
 * que hace evidente cualquier regresión de contraste (texto blanco fijo
 * quedaría ilegible), porque --color-txt-on-primary debería recalcularse a
 * oscuro automáticamente vía pickReadableText().
 */
export interface BrandPreset {
  label: string;
  tokens: BipTokenOverrides | undefined;
}

export const BRAND_PRESETS: Record<string, BrandPreset> = {
  default: { label: 'Default (sin override)', tokens: undefined },
  pink: { label: 'Pink', tokens: { colorPrimary: '#e2007a' } },
  ocean: { label: 'Ocean', tokens: { colorPrimary: '#0369a1', colorSecondary: '#0ea5e9' } },
  canary: { label: 'Canary (contraste)', tokens: { colorPrimary: '#ffe066' } },
};

export type BrandPresetKey = keyof typeof BRAND_PRESETS;
