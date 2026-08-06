import React from 'react';
import '../src/index.css';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { BRAND_PRESETS } from '../src/foundations/brandPresets';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Same rule config as src/a11y.test.tsx's AXE_OPTIONS — color-contrast is disabled here
    // too because Storybook's addon-a11y runs axe in a real browser, but the toolbar's
    // theme/colorScheme/brand globals can put a story mid-transition when axe samples it;
    // contrast is already covered by src/lib/contrast.test.ts + Foundations/Theming.
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Tema visual (radius + tipografía)',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'square', title: 'Square' },
          { value: 'rounded', title: 'Rounded' },
        ],
        dynamicTitle: true,
      },
    },
    colorScheme: {
      description: 'Esquema de color (claro/oscuro)',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Override de marca (tokens.colorPrimary/colorSecondary) — ver src/foundations/brandPresets.ts',
      toolbar: {
        icon: 'paintbrush',
        items: Object.entries(BRAND_PRESETS).map(([value, preset]) => ({ value, title: preset.label })),
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Densidad de espaciado en controles (padding de Button/Input/Textarea/Select)',
      toolbar: {
        icon: 'ruler',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
        dynamicTitle: true,
      },
    },
    dir: {
      description: 'Dirección de texto — ver styles/rtl.css',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'square',
    colorScheme: 'light',
    brand: 'default',
    density: 'comfortable',
    dir: 'ltr',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        theme={context.globals.theme ?? 'square'}
        colorScheme={context.globals.colorScheme ?? 'light'}
        tokens={BRAND_PRESETS[context.globals.brand ?? 'default']?.tokens}
        density={context.globals.density ?? 'comfortable'}
        dir={context.globals.dir ?? 'ltr'}
      >
        {/* var(--color-surface-2) resuelve al esquema activo vía data-color-scheme
            estampado por ThemeProvider — el canvas acompaña al toolbar sin
            necesitar el addon de backgrounds. */}
        <div style={{ minHeight: '100vh', padding: '1rem', background: 'var(--color-surface-2)' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
