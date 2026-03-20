import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { colors } from '../../tailwind.tokens.js';
import pkg from '../../package.json';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── ColorSwatch ──────────────────────────────────────────────────────────────

const ColorSwatch = ({ name, value }: { name: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API not available (HTTP context or permission denied)
    }
  };

  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 cursor-pointer group bg-transparent border-0 p-0"
      onClick={handleCopy}
      aria-label={`Copiar color ${name}: ${value}`}
    >
      <div
        className="w-24 h-24 rounded border border-gray-300 shadow-sm group-hover:shadow-lg transition-shadow"
        style={{ backgroundColor: value }}
      />
      <div className="text-center">
        <p className="text-sm font-semibold text-txt">{name}</p>
        <p className="text-xs text-txt-secondary">{copied ? '¡Copiado!' : value}</p>
      </div>
    </button>
  );
};

// ─── ColorGroup ───────────────────────────────────────────────────────────────

const ColorGroup = ({
  title,
  colors: swatches,
}: {
  title: string;
  colors: Record<string, string>;
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-txt">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Object.entries(swatches).map(([name, value]) => (
        <ColorSwatch key={name} name={name} value={value} />
      ))}
    </div>
  </div>
);

// ─── Story ────────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => {
    // Agrupar tokens por prefijo semántico
    const groups: Record<string, Record<string, string>> = {
      Interaction: {},
      Text: {},
      Surface: {},
      Border: {},
    };

    for (const [name, value] of Object.entries(colors)) {
      if (['primary', 'secondary', 'danger', 'disabled', 'field', 'selected', 'active', 'unique'].some(
        p => name === p || name.startsWith(p + '-')
      )) {
        groups.Interaction[name] = value;
      } else if (name.startsWith('txt') || name === 'link' || name.startsWith('link-')) {
        groups.Text[name] = value;
      } else if (name.startsWith('surface') || name === 'scrim') {
        groups.Surface[name] = value;
      } else if (name.startsWith('edge')) {
        groups.Border[name] = value;
      }
    }

    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Color Palette</h1>
        <p className="text-xl font-semibold mb-4 text-gray-500">Versión {pkg.version}</p>
        <p className="text-lg text-gray-900 mb-4">
          Los siguientes colores son los colores base del design system.
          <br />
          Sigue las guías de uso para mantener consistencia en todo el producto.
        </p>
        <p className="text-sm text-gray-500 mb-12">
          Haz clic en cualquier muestra para copiar el código hex al portapapeles.
          <br />
          Los valores mostrados son CSS custom properties — los hex se resuelven en runtime.
        </p>
        {Object.entries(groups).map(([title, swatches]) => (
          <ColorGroup key={title} title={title} colors={swatches} />
        ))}
      </div>
    );
  },
};
