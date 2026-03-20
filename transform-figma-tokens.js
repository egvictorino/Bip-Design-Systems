#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Leer tokens de Figma
const figmaTokensPath = path.resolve(__dirname, 'Downloads', 'figmaTokens.json');
const tailwindTokensPath = path.resolve(__dirname, 'packages/ui-components/tailwind.tokens.js');

let figmaTokens = {};
try {
  const data = fs.readFileSync(figmaTokensPath, 'utf8');
  figmaTokens = JSON.parse(data);
} catch (err) {
  console.error('Error reading figmaTokens.json:', err.message);
  process.exit(1);
}

// Transformar tokens
const transformedTokens = {
  interaction: {},
  text: {},
  surface: {},
  border: {},
  feedback: {},
};

const global_tokens = figmaTokens.global || {};

// Procesar Text
if (global_tokens.Text) {
  Object.entries(global_tokens.Text).forEach(([key, token]) => {
    const normalizedKey = normalizeName(key);
    if (normalizedKey === 'black') transformedTokens.text.primary = token.$value;
    else if (normalizedKey === 'primary') transformedTokens.text.primary = token.$value;
    else if (normalizedKey === 'secondary') transformedTokens.text.secondary = token.$value;
    else if (normalizedKey === 'utility' || normalizedKey === 'disabled') transformedTokens.text.disabled = token.$value;
    else if (normalizedKey === 'white') transformedTokens.text.white = token.$value;
  });
}

// Procesar Interaction
if (global_tokens.Interaction) {
  const interaction = { primary: {}, secondary: {}, tertiary: {} };
  
  Object.entries(global_tokens.Interaction).forEach(([key, token]) => {
    const normalized = normalizeName(key);
    
    if (normalized.startsWith('primary')) {
      if (normalized.includes('hover')) interaction.primary.hover = token.$value;
      else if (normalized.includes('press')) interaction.primary.pressed = token.$value;
      else interaction.primary.default = token.$value;
    } else if (normalized.startsWith('secondary')) {
      if (normalized.includes('hover')) interaction.secondary.hover = token.$value;
      else if (normalized.includes('press')) interaction.secondary.pressed = token.$value;
      else interaction.secondary.default = token.$value;
    } else if (normalized.includes('disabled')) {
      interaction.disabled = token.$value;
    } else if (normalized.includes('field') && normalized.includes('readonly')) {
      interaction['field-readonly'] = token.$value;
    } else if (normalized.includes('field')) {
      interaction.field = token.$value;
    } else if (normalized.includes('selected')) {
      interaction.selected = token.$value;
    } else if (normalized.includes('danger') || normalized.includes('danger')) {
      if (!interaction.danger) interaction.danger = {};
      if (normalized.includes('hover')) interaction.danger.hover = token.$value;
      else if (normalized.includes('press')) interaction.danger.pressed = token.$value;
      else interaction.danger.default = token.$value;
    }
  });
  
  transformedTokens.interaction = interaction;
}

// Procesar Surface
if (global_tokens.Surface) {
  const surface = {};
  Object.entries(global_tokens.Surface).forEach(([key, token]) => {
    surface[normalizeName(key)] = token.$value;
  });
  transformedTokens.surface = surface;
}

// Procesar Border
if (global_tokens.Border) {
  const border = {};
  Object.entries(global_tokens.Border).forEach(([key, token]) => {
    border[normalizeName(key)] = token.$value;
  });
  transformedTokens.border = border;
}

// Procesar Feedback
if (global_tokens.Feedback) {
  const feedback = {};
  Object.entries(global_tokens.Feedback).forEach(([key, container]) => {
    if (typeof container === 'object' && container.$value) {
      feedback[normalizeName(key)] = container.$value;
    }
  });
  transformedTokens.feedback = feedback;
}

// Generar archivo de salida
const output = generateTokensFile(transformedTokens);

fs.writeFileSync(tailwindTokensPath, output);
console.log('✓ Tokens transformados exitosamente a:', tailwindTokensPath);

function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/[-\s]/g, '-')
    .replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());
}

function generateTokensFile(tokens) {
  return `/**
 * Design tokens — transformed from Figma tokens
 * 
 * Imported by:
 *   - tailwind.preset.js  (Tailwind theme)
 *   - src/foundations/Colors.stories.tsx  (Storybook documentation)
 *
 * No Node.js dependencies — safe for both browser and Node.js contexts.
 */

export const colors = ${JSON.stringify(tokens, null, 2)};
`;
}
