import type { Meta } from '@storybook/react';
import { useState } from 'react';

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

const ColorGroup = ({ title, colors }: { title: string; colors: Record<string, string> }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-text-primary">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Object.entries(colors).map(([name, value]) => (
        <ColorSwatch key={name} name={name} value={value} />
      ))}
    </div>
  </div>
);

export const Overview = () => {
  const interactionColors = {
    'Primary Default': '#1643A8',
    'Primary Hover': '#10327D',
    'Primary Pressed': '#0B2152',
    'Secondary Default': '#4B5468',
    'Secondary Hover': '#3A404B',
    'Secondary Pressed': '#282C33',
    'Tertiary Default': '#DEE4ED',
    'Tertiary Hover': '#B6BBC3',
    'Tertiary Pressed': '#8E9298',
    'Disabled': '#EFEFEF',
    'Field': '#FCFCFC',
    'Field Readonly': '#F2F2F2',
    'Selected': '#E4FCFF',
  };


  const textColors = {
    'Primary': '#23232A',
    'Secondary': '#5E5E60',
    'Disabled': '#A6A7A8',
    'White': '#FFFFFF',
  };
  

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-text-primary">Color Palette</h1>
      <h4 className="text-xl font-semibold mb-4 text-text-secondary">Version 0.0.1</h4>
      <p className="text-lg text-text-primary mb-12">
        The following colores are the core colors used in the design system.<br></br>
        Follow the guidelines for usage to maintain consistency across the product. 
      </p>
    
    <p className="text-sm text-text-secondary mb-12">Click on any color swatch to copy its hex code to your clipboard.</p>
      <ColorGroup title="Interaction Colors" colors={interactionColors} />
      <ColorGroup title="Text Colors" colors={textColors} />
    </div>
  );
};