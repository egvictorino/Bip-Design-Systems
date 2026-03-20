const config = {
  stories: ['../src/**/*.stories.{js,jsx,ts,tsx}'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.css = { postcss: './postcss.config.js' };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['react', 'react-dom', 'clsx', 'tailwind-merge'],
    };
    return config;
  },
};

export default config;