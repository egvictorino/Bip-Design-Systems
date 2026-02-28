import pymesPreset from '@pymes/ui-components/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@pymes/ui-components/dist/**/*.js',
  ],
  presets: [pymesPreset],
};
