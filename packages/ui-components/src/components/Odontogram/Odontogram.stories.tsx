import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Odontogram, CONDITION_LABELS } from './Odontogram';
import type { OdontogramValue, ToothCondition } from './Odontogram';

const meta = {
  title: 'Components/Odontogram',
  component: Odontogram,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    activeTool: {
      control: 'select',
      options: Object.keys(CONDITION_LABELS) as ToothCondition[],
    },
    dentition: { control: 'select', options: ['permanent', 'primary'] },
  },
} satisfies Meta<typeof Odontogram>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────

const SAMPLE_VALUE: OdontogramValue = {
  11: { surfaces: { occlusal: 'caries', mesial: 'caries' } },
  12: { surfaces: { occlusal: 'restoration' } },
  16: { condition: 'crown' },
  18: { condition: 'missing' },
  21: { surfaces: { occlusal: 'restoration', distal: 'restoration' } },
  26: { condition: 'crown' },
  28: { condition: 'missing' },
  36: { condition: 'implant' },
  37: { condition: 'missing' },
  46: { surfaces: { occlusal: 'root_canal', buccal: 'restoration' } },
  47: { surfaces: { occlusal: 'fracture' } },
  48: { condition: 'extraction_planned' },
};

// ─── Wrapper interactivo ──────────────────────────────────────────────────────

const InteractiveOdontogram = () => {
  const [value, setValue] = useState<OdontogramValue>({});
  const [activeTool, setActiveTool] = useState<ToothCondition>('caries');

  const conditions = Object.entries(CONDITION_LABELS) as [ToothCondition, string][];

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {conditions.map(([condition, label]) => (
          <button
            key={condition}
            onClick={() => setActiveTool(condition)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
              activeTool === condition
                ? 'border-interaction-primary-default bg-interaction-primary-default text-text-white'
                : 'border-gray-300 bg-white text-text-secondary hover:border-interaction-primary-default'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Odontogram
        value={value}
        onChange={setValue}
        activeTool={activeTool}
        label="Odontograma interactivo"
        size="md"
      />

      {Object.keys(value).length > 0 && (
        <div className="text-xs text-text-secondary font-mono bg-gray-50 rounded p-2 max-w-lg">
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <Odontogram />,
};

export const WithLabel: Story = {
  render: () => <Odontogram label="Odontograma del paciente" />,
};

export const WithData: Story = {
  render: () => (
    <Odontogram
      label="Odontograma con condiciones"
      value={SAMPLE_VALUE}
      readOnly
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Odontogram
      label="Vista de solo lectura"
      value={SAMPLE_VALUE}
      readOnly
    />
  ),
};

export const SizeSm: Story = {
  render: () => (
    <Odontogram label="Tamaño pequeño" value={SAMPLE_VALUE} readOnly size="sm" />
  ),
};

export const SizeMd: Story = {
  render: () => (
    <Odontogram label="Tamaño mediano" value={SAMPLE_VALUE} readOnly size="md" />
  ),
};

export const SizeLg: Story = {
  render: () => (
    <Odontogram label="Tamaño grande" value={SAMPLE_VALUE} readOnly size="lg" />
  ),
};

export const Interactive: Story = {
  render: () => <InteractiveOdontogram />,
};

export const PrimaryDentition: Story = {
  render: () => (
    <Odontogram
      label="Dentición primaria"
      dentition="primary"
    />
  ),
};

export const PrimaryDentitionWithData: Story = {
  render: () => (
    <Odontogram
      label="Dentición primaria con condiciones"
      dentition="primary"
      value={{
        51: { surfaces: { occlusal: 'caries' } },
        55: { condition: 'missing' },
        61: { surfaces: { occlusal: 'restoration' } },
        65: { condition: 'crown' },
        74: { surfaces: { occlusal: 'caries', mesial: 'caries' } },
        84: { condition: 'extraction_planned' },
      }}
      readOnly
    />
  ),
};
