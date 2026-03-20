#!/usr/bin/env node

/**
 * Sincroniza tokens de Figma → CSS variables + Tailwind tokens + cn.ts
 *
 * Genera 3 archivos:
 *   1. src/tokens.css           — CSS custom properties (:root)
 *   2. tailwind.tokens.js       — colores semánticos con var(--*)
 *   3. src/lib/cn.ts            — tailwind-merge configurado
 *
 * Uso: pnpm sync:tokens
 */

const fs = require('fs');
const path = require('path');

const INPUT_PATH = './MyStyleD/tokens/global.json';
const UI_PKG = './packages/ui-components';
const TOKENS_CSS_PATH = `${UI_PKG}/src/tokens.css`;
const TOKENS_JS_PATH = `${UI_PKG}/tailwind.tokens.js`;
const CN_PATH = `${UI_PKG}/src/lib/cn.ts`;

if (!fs.existsSync(INPUT_PATH)) {
  console.error(`❌ No se encontró: ${INPUT_PATH}`);
  console.error('   Copia tu figmaTokens.json a MyStyleD/tokens/global.json');
  process.exit(1);
}

const figmaTokens = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
const raw = figmaTokens.global || figmaTokens;

// ─── Mapeo semántico: Figma → nombre corto ────────────────────────────
// Cada categoría de Figma se mapea a nombres semánticos para Tailwind.
// La clave es "CategoríaFigma.NombreFigma", el valor es el nombre corto.
const SEMANTIC_MAP = {
  // ── Interaction ──
  'Interaction.Primary':          'primary',
  'Interaction.Primary-Hover':    'primary-hover',
  'Interaction.Primary-Press':    'primary-press',
  'Interaction.Secondary':        'secondary',
  'Interaction.Secondary-Hover':  'secondary-hover',
  'Interaction.Secondary-Press':  'secondary-press',
  'Interaction.Dangger':          'danger',
  'Interaction.Dangger-hover':    'danger-hover',
  'Interaction.Dangger-Press':    'danger-press',
  'Interaction.Disabled':         'disabled',
  'Interaction.Field':            'field',
  'Interaction.Field-Readonly':   'field-readonly',
  'Interaction.Selected':         'selected',
  'Interaction.Active':           'active',
  'Interaction.Unique':           'unique',

  // ── Text ──
  'Text.Primary':       'txt',
  'Text.Black':         'txt-black',
  'Text.Secondary':     'txt-secondary',
  'Text.Utility':       'txt-utility',
  'Text.Disabled':      'txt-disabled',
  'Text.White':         'txt-white',
  'Text.Important':     'txt-important',
  'Text.Link-Default':  'link',
  'Text.Link-Hover':    'link-hover',
  'Text.Link-Press':    'link-press',

  // ── Surface ──
  'Surface.L1':    'surface-1',
  'Surface.L2':    'surface-2',
  'Surface.L3':    'surface-3',
  'Surface.L4':    'surface-4',
  'Surface.Scrim': 'scrim',

  // ── Border ──
  'Border.Light':     'edge',
  'Border.Medium':    'edge-medium',
  'Border.Heavy':     'edge-heavy',
  'Border.Disabled':  'edge-disabled',
  'Border.Focus':     'edge-focus',
  'Border.Hover':     'edge-hover',
  'Border.Important': 'edge-important',
  'Border.Warning':   'edge-warning',
  'Border.Success':   'edge-success',
  'Border.Unique':    'edge-unique',
};

// ─── Extraer tokens desde JSON de Figma ───────────────────────────────
function extractTokens(data) {
  const tokens = {}; // { semanticName: hexValue }

  for (const [category, group] of Object.entries(data)) {
    if (typeof group !== 'object') continue;

    for (const [name, token] of Object.entries(group)) {
      if (!token || !token.$value || token.$type !== 'color') continue;

      const mapKey = `${category}.${name}`;
      const semantic = SEMANTIC_MAP[mapKey];

      if (semantic) {
        tokens[semantic] = token.$value;
      } else {
        // Token no mapeado — generar nombre automático
        const auto = `${category.toLowerCase()}-${name.toLowerCase()}`;
        console.warn(`⚠️  Token sin mapeo: ${mapKey} → generado como "${auto}"`);
        tokens[auto] = token.$value;
      }
    }
  }

  return tokens;
}

const tokens = extractTokens(raw);

// ─── Tokens estáticos (no vienen de Figma) ────────────────────────────
// Feedback colors — variantes para estados de error, éxito, advertencia, info.
// Agregar aquí cuando Figma los incluya en el export.
const STATIC_TOKENS = {
  // Error / Danger
  'danger-light':    '#fef2f2',  // bg para containers
  'danger-subtle':   '#fee2e2',  // bg para badges, hover close
  'danger-muted':    '#fecaca',  // bg toggle unchecked
  'danger-text':     '#b91c1c',  // texto sobre fondos claros

  // Success
  'success':         '#22c55e',
  'success-light':   '#f0fdf4',
  'success-subtle':  '#dcfce7',
  'success-text':    '#15803d',

  // Warning
  'warning':         '#eab308',
  'warning-light':   '#fefce8',
  'warning-subtle':  '#fef9c3',
  'warning-text':    '#a16207',

  // Info
  'info':            '#3347ff',
  'info-light':      '#eff6ff',
  'info-subtle':     '#dbeafe',
  'info-text':       '#1d4ed8',
};

// Merge: Figma tokens + estáticos
Object.assign(tokens, STATIC_TOKENS);

// ─── 1. Generar tokens.css ────────────────────────────────────────────
function generateCSS(tokens) {
  const groups = {
    'Interaction':  ['primary', 'secondary', 'danger', 'disabled', 'field', 'selected', 'active', 'unique'],
    'Text':         ['txt', 'link'],
    'Surface':      ['surface', 'scrim'],
    'Border':       ['edge'],
    'Feedback':     ['success', 'warning', 'info'],
  };

  let css = `/**
 * Design tokens — CSS custom properties
 * GENERADO AUTOMÁTICAMENTE — no editar manualmente
 * Comando: pnpm sync:tokens
 */

:root {\n`;

  for (const [section, prefixes] of Object.entries(groups)) {
    css += `  /* ${section} */\n`;

    const sectionTokens = Object.entries(tokens)
      .filter(([name]) => prefixes.some(p => name === p || name.startsWith(p + '-')))
      .sort(([a], [b]) => a.localeCompare(b));

    for (const [name, value] of sectionTokens) {
      css += `  --color-${name}: ${value};\n`;
    }

    css += '\n';
  }

  css += '}\n';
  return css;
}

// ─── 2. Generar tailwind.tokens.js ────────────────────────────────────
function generateTailwindTokens(tokens) {
  const groups = [
    { comment: 'Interaction', filter: (n) => ['primary', 'secondary', 'danger', 'disabled', 'field', 'field-readonly', 'selected', 'active', 'unique'].some(p => n === p || n.startsWith(p + '-')) && !n.startsWith('txt') && !n.startsWith('edge') && !n.startsWith('surface') && !n.startsWith('link') && !n.startsWith('scrim') && !n.startsWith('success') && !n.startsWith('warning') && !n.startsWith('info') },
    { comment: 'Text', filter: (n) => n.startsWith('txt') || n === 'link' || n.startsWith('link-') },
    { comment: 'Surface', filter: (n) => n.startsWith('surface') || n === 'scrim' },
    { comment: 'Border', filter: (n) => n.startsWith('edge') },
    { comment: 'Feedback', filter: (n) => ['success', 'warning', 'info'].some(p => n === p || n.startsWith(p + '-')) },
  ];

  let js = `/**
 * Design tokens — Tailwind color config via CSS custom properties
 * GENERADO AUTOMÁTICAMENTE — no editar manualmente
 * Comando: pnpm sync:tokens
 *
 * Uso en componentes:
 *   bg-primary hover:bg-primary-hover active:bg-primary-press
 *   text-txt text-txt-secondary
 *   border-edge focus:border-edge-focus
 *   bg-surface-1 bg-surface-2
 *
 * Imported by:
 *   - tailwind.preset.js  (Tailwind theme)
 *   - src/foundations/Colors.stories.tsx  (Storybook documentation)
 */

export const colors = {\n`;

  for (const { comment, filter } of groups) {
    const group = Object.keys(tokens).filter(filter).sort();
    if (group.length === 0) continue;

    js += `  // ${comment}\n`;

    for (const name of group) {
      const pad = Math.max(20 - name.length - 2, 1);
      const key = name.includes('-') ? `'${name}'` : name;
      js += `  ${key}:${' '.repeat(pad)}'var(--color-${name})',\n`;
    }

    js += '\n';
  }

  js += '};\n';
  return js;
}

// ─── 3. Generar cn.ts ─────────────────────────────────────────────────
function generateCn(tokens) {
  const allNames = Object.keys(tokens);

  const interactionTokens = allNames.filter(n =>
    ['primary', 'secondary', 'danger', 'disabled', 'field', 'field-readonly', 'selected', 'active', 'unique']
      .some(p => n === p || n.startsWith(p + '-'))
    && !n.startsWith('txt') && !n.startsWith('edge') && !n.startsWith('surface') && !n.startsWith('link') && !n.startsWith('scrim') && !n.startsWith('success') && !n.startsWith('warning') && !n.startsWith('info')
  );
  const textTokens = allNames.filter(n => n.startsWith('txt') || n === 'link' || n.startsWith('link-'));
  const surfaceTokens = allNames.filter(n => n.startsWith('surface') || n === 'scrim');
  const borderTokens = allNames.filter(n => n.startsWith('edge'));
  const feedbackTokens = allNames.filter(n => ['success', 'warning', 'info'].some(p => n === p || n.startsWith(p + '-')));

  const fmt = (arr) => arr.map(t => `'${t}'`).join(', ');

  return `import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind-merge con tokens semánticos del proyecto.
 * GENERADO AUTOMÁTICAMENTE — no editar manualmente
 * Comando: pnpm sync:tokens
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'bg-color': [{ bg: [${fmt(interactionTokens)}, ${fmt(textTokens)}, ${fmt(surfaceTokens)}, ${fmt(feedbackTokens)}] }],
      'text-color': [{ text: [${fmt(textTokens)}, ${fmt(interactionTokens)}, ${fmt(feedbackTokens)}] }],
      'border-color': [{ border: [${fmt(interactionTokens)}, ${fmt(borderTokens)}, ${fmt(feedbackTokens)}] }],
      'ring-color': [{ ring: [${fmt(interactionTokens)}, ${fmt(borderTokens)}, ${fmt(feedbackTokens)}] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
`;
}

// ─── Escribir archivos ───────────────────────────────────────────────
fs.writeFileSync(TOKENS_CSS_PATH, generateCSS(tokens));
fs.writeFileSync(TOKENS_JS_PATH, generateTailwindTokens(tokens));
fs.writeFileSync(CN_PATH, generateCn(tokens));

console.log(`✨ Tokens sincronizados (${Object.keys(tokens).length} tokens)`);
console.log(`   📄 ${TOKENS_CSS_PATH}  — CSS custom properties`);
console.log(`   📄 ${TOKENS_JS_PATH}  — Tailwind colors`);
console.log(`   📄 ${CN_PATH}  — tailwind-merge config`);
console.log('');
console.log('Uso en componentes:');
console.log('   bg-primary hover:bg-primary-hover active:bg-primary-press');
console.log('   text-txt text-txt-secondary text-txt-white');
console.log('   border-edge focus:border-edge-focus');
console.log('   bg-surface-1 bg-danger');

