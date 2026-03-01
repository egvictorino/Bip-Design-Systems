import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { colors } from './tailwind.tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, './dist/**/*.js')],
  theme: {
    extend: { colors },
  },
};
