const config = {
  stories: ['../src/**/*.stories.{js,jsx,ts,tsx}', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.css = { postcss: './postcss.config.cjs' };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['react', 'react-dom', 'clsx'],
    };
    return config;
  },
};

export default config;