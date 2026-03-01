import type { Meta } from '@storybook/react';
import { useState } from 'react';
import { colors } from '../../tailwind.tokens.js';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const ColorSwatch = ({ name, value }: { name: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={handleCopy}>
      <div
        className="w-24 h-24 rounded border border-gray-300 shadow-sm group-hover:shadow-lg transition-shadow"
        style={{ backgroundColor: value }}
      />
      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">{copied ? 'Copied!' : value}</p>
      </div>
    </div>
  );
};

const ColorGroup = ({ title, colors: swatches }: { title: string; colors: Record<string, string> }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-text-primary">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Object.entries(swatches).map(([name, value]) => (
        <ColorSwatch key={name} name={name} value={value} />
      ))}
    </div>
  </div>
);

export const Overview = () => {
  const { interaction, text, feedback } = colors;

  const interactionColors: Record<string, string> = {
    'Primary Default':    interaction.primary.default,
    'Primary Hover':      interaction.primary.hover,
    'Primary Pressed':    interaction.primary.pressed,
    'Secondary Default':  interaction.secondary.default,
    'Secondary Hover':    interaction.secondary.hover,
    'Secondary Pressed':  interaction.secondary.pressed,
    'Tertiary Default':   interaction.tertiary.default,
    'Tertiary Hover':     interaction.tertiary.hover,
    'Tertiary Pressed':   interaction.tertiary.pressed,
    'Disabled':           interaction.disabled,
    'Field':              interaction.field,
    'Field Readonly':     interaction['field-readonly'],
    'Selected':           interaction.selected,
  };

  const textColors: Record<string, string> = {
    'Primary':   text.primary,
    'Secondary': text.secondary,
    'Disabled':  text.disabled,
    'White':     text.white,
  };

  const feedbackErrorColors: Record<string, string> = {
    'Error Default': feedback.error.default,
    'Error Light':   feedback.error.light,
    'Error Subtle':  feedback.error.subtle,
    'Error Muted':   feedback.error.muted,
    'Error Text':    feedback.error.text,
  };

  const feedbackSuccessColors: Record<string, string> = {
    'Success Default': feedback.success.default,
    'Success Light':   feedback.success.light,
    'Success Subtle':  feedback.success.subtle,
    'Success Text':    feedback.success.text,
  };

  const feedbackWarningColors: Record<string, string> = {
    'Warning Default': feedback.warning.default,
    'Warning Light':   feedback.warning.light,
    'Warning Subtle':  feedback.warning.subtle,
    'Warning Text':    feedback.warning.text,
  };

  const feedbackInfoColors: Record<string, string> = {
    'Info Light':  feedback.info.light,
    'Info Subtle': feedback.info.subtle,
    'Info Text':   feedback.info.text,
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-text-primary">Color Palette</h1>
      <h4 className="text-xl font-semibold mb-4 text-text-secondary">Version 0.0.1</h4>
      <p className="text-lg text-text-primary mb-12">
        The following colors are the core colors used in the design system.
        <br />
        Follow the guidelines for usage to maintain consistency across the product.
      </p>
      <p className="text-sm text-text-secondary mb-12">
        Click on any color swatch to copy its hex code to your clipboard.
      </p>
      <ColorGroup title="Interaction Colors" colors={interactionColors} />
      <ColorGroup title="Text Colors" colors={textColors} />
      <ColorGroup title="Feedback — Error" colors={feedbackErrorColors} />
      <ColorGroup title="Feedback — Success" colors={feedbackSuccessColors} />
      <ColorGroup title="Feedback — Warning" colors={feedbackWarningColors} />
      <ColorGroup title="Feedback — Info" colors={feedbackInfoColors} />
    </div>
  );
};
