import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, './dist/**/*.js')],
  theme: {
    extend: {
      colors: {
        interaction: {
          primary: {
            default: '#1643A8',
            hover: '#10327D',
            pressed: '#0B2152',
          },
          secondary: {
            default: '#4B5468',
            hover: '#3A404B',
            pressed: '#282C33',
          },
          tertiary: {
            default: '#DEE4ED',
            hover: '#B6BBC3',
            pressed: '#8E9298',
          },
          disabled: '#EFEFEF',
          field: '#FCFCFC',
          'field-readonly': '#F2F2F2',
          selected: '#E4FCFF',
        },
        text: {
          primary: '#23232A',
          secondary: '#5E5E60',
          disabled: '#A6A7A8',
          white: '#FFFFFF',
        },
      },
    },
  },
};
