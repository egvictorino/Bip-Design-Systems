import React from 'react';
import '../src/index.css';
import { ThemeProvider } from '../src/components/ThemeProvider';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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
  },
  initialGlobals: {
    theme: 'square',
    colorScheme: 'light',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        theme={context.globals.theme ?? 'square'}
        colorScheme={context.globals.colorScheme ?? 'light'}
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
