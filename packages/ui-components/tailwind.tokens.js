/**
 * Design tokens — single source of truth for all color values.
 *
 * Imported by:
 *   - tailwind.preset.js  (Tailwind theme)
 *   - src/foundations/Colors.stories.tsx  (Storybook documentation)
 *
 * No Node.js dependencies — safe for both browser and Node.js contexts.
 */

export const colors = {
  interaction: {
    primary: {
      default: '#1643A8',
      hover:   '#10327D',
      pressed: '#0B2152',
    },
    secondary: {
      default: '#4B5468',
      hover:   '#3A404B',
      pressed: '#282C33',
    },
    tertiary: {
      default: '#DEE4ED',
      hover:   '#B6BBC3',
      pressed: '#8E9298',
    },
    disabled:        '#EFEFEF',
    field:           '#FCFCFC',
    'field-readonly': '#F2F2F2',
    selected:        '#E4FCFF',
  },
  text: {
    primary:   '#23232A',
    secondary: '#5E5E60',
    disabled:  '#A6A7A8',
    white:     '#FFFFFF',
  },
  feedback: {
    error: {
      default: '#EF4444', // red-500  — borders, rings, indicators, form text
      light:   '#FEF2F2', // red-50   — container backgrounds (Alert, Dropdown hover)
      subtle:  '#FEE2E2', // red-100  — Badge background, close button hover
      muted:   '#FECACA', // red-200  — Toggle unchecked track
      text:    '#B91C1C', // red-700  — text on light backgrounds (Alert, Badge)
    },
    success: {
      default: '#22C55E', // green-500
      light:   '#F0FDF4', // green-50
      subtle:  '#DCFCE7', // green-100
      text:    '#15803D', // green-700
    },
    warning: {
      default: '#EAB308', // yellow-500
      light:   '#FEFCE8', // yellow-50
      subtle:  '#FEF9C3', // yellow-100
      text:    '#A16207', // yellow-700
    },
    info: {
      light:   '#EFF6FF', // blue-50   — Alert info background
      subtle:  '#DBEAFE', // blue-100  — Badge primary background, close hover
      text:    '#1D4ED8', // blue-700  — Alert body text, Badge text
    },
  },
};
