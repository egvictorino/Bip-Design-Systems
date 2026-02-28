import bipPreset from '@bip/ui-components/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [bipPreset],
};
