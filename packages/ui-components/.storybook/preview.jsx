import React from 'react';
import '../src/index.css';
import { ThemeProvider } from '../src/components/ThemeProvider';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#fafafa' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#191919' },
      ],
    },
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
  },
  initialGlobals: {
    theme: 'square',
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={context.globals.theme ?? 'square'}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
