import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Odontogram } from './Odontogram';
import type { OdontogramValue } from './Odontogram';

// Minimal placeholder base64 PNG (8x8 gray square) for story demos
const PLACEHOLDER_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVQoU2NkYGD4z8BAAowDEgAA//8AzAADIgAAAABJRU5ErkJggg==';

const meta = {
  title: 'Components/Odontogram',
  component: Odontogram,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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

const SAMPLE_VALUE_WITH_NOTES: OdontogramValue = {
  11: {
    surfaces: { occlusal: 'caries', mesial: 'caries' },
    notes: 'Caries interproximal activa. Revisar en 3 meses.',
  },
  16: { condition: 'crown', notes: 'Corona provisional desde enero. Programar definitiva.' },
  18: { condition: 'missing' },
  36: {
    condition: 'implant',
    notes: 'Implante Nobel Biocare colocado 2024-06. Oseointegración completada.',
  },
  46: {
    surfaces: { occlusal: 'root_canal', buccal: 'restoration' },
    notes: 'Endodoncia completada. Restauración con composite.',
  },
};

// ─── Estilos para wrappers de stories interactivas ────────────────────────────

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const hintStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-txt-secondary)',
};

const jsonPreStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-txt-secondary)',
  fontFamily: 'ui-monospace, monospace',
  backgroundColor: 'var(--color-surface-2)',
  borderRadius: '0.25rem',
  padding: '0.5rem',
  maxWidth: '32rem',
};

// ─── Wrapper interactivo ──────────────────────────────────────────────────────

const InteractiveOdontogram = () => {
  const [value, setValue] = useState<OdontogramValue>({});

  return (
    <div style={wrapperStyle}>
      <p style={hintStyle}>
        Haz clic en un diente para abrir su panel de detalle. Ahí podrás elegir la condición a
        aplicar, marcar superficies, agregar notas e imágenes.
      </p>

      <Odontogram value={value} onChange={setValue} label="Odontograma interactivo" size="md" />

      {Object.keys(value).length > 0 && (
        <pre style={jsonPreStyle}>{JSON.stringify(value, null, 2)}</pre>
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
    <Odontogram label="Odontograma con condiciones" value={SAMPLE_VALUE} disabled />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Odontogram label="Vista de solo lectura" value={SAMPLE_VALUE} disabled />
  ),
};

export const EmptyReadOnly: Story = {
  render: () => (
    <Odontogram label="Odontograma vacío (solo lectura)" disabled />
  ),
};

export const SizeSm: Story = {
  render: () => (
    <Odontogram label="Tamaño pequeño" value={SAMPLE_VALUE} disabled size="sm" />
  ),
};

export const SizeMd: Story = {
  render: () => (
    <Odontogram label="Tamaño mediano" value={SAMPLE_VALUE} disabled size="md" />
  ),
};

export const SizeLg: Story = {
  render: () => (
    <Odontogram label="Tamaño grande" value={SAMPLE_VALUE} disabled size="lg" />
  ),
};

export const Interactive: Story = {
  render: () => <InteractiveOdontogram />,
};

export const PrimaryDentition: Story = {
  render: () => (
    <Odontogram label="Dentición primaria" dentition="primary" />
  ),
};

export const WithNotes: Story = {
  render: () => (
    <Odontogram
      label="Odontograma con notas"
      value={SAMPLE_VALUE_WITH_NOTES}
      disabled
    />
  ),
};

const WithNotesInteractiveDemo = () => {
  const [value, setValue] = useState<OdontogramValue>(SAMPLE_VALUE_WITH_NOTES);
  return (
    <div style={wrapperStyle}>
      <p style={hintStyle}>
        Haz clic en un diente para abrir el panel de detalle. Desde ahí puedes marcar condiciones,
        editar notas y gestionar imágenes.
      </p>
      <Odontogram
        value={value}
        onChange={setValue}
        label="Odontograma interactivo con notas"
        size="md"
      />
      {Object.keys(value).length > 0 && (
        <pre style={jsonPreStyle}>{JSON.stringify(value, null, 2)}</pre>
      )}
    </div>
  );
};

export const WithNotesInteractive: Story = {
  render: () => <WithNotesInteractiveDemo />,
};

export const WithImages: Story = {
  render: () => (
    <Odontogram
      label="Odontograma con imágenes"
      value={{
        11: {
          surfaces: { occlusal: 'caries' },
          images: [
            { type: 'radiograph', url: PLACEHOLDER_IMG },
            { type: 'photo', url: PLACEHOLDER_IMG },
          ],
        },
        16: { condition: 'crown', images: [{ type: 'photo', url: PLACEHOLDER_IMG }] },
        36: {
          condition: 'implant',
          images: [
            { type: 'radiograph', url: PLACEHOLDER_IMG },
            { type: 'radiograph', url: PLACEHOLDER_IMG },
            { type: 'other', url: PLACEHOLDER_IMG },
          ],
        },
        46: {
          surfaces: { occlusal: 'root_canal' },
          images: [{ type: 'other', url: PLACEHOLDER_IMG }],
        },
      }}
      disabled
    />
  ),
};

const WithImagesInteractiveDemo = () => {
  const [value, setValue] = useState<OdontogramValue>({});
  return (
    <div style={wrapperStyle}>
      <p style={hintStyle}>
        Haz clic en un diente y luego en &quot;Imágenes&quot; para adjuntar radiografías o fotografías.
      </p>
      <Odontogram
        value={value}
        onChange={setValue}
        label="Odontograma interactivo con imágenes"
        size="md"
      />
      {Object.keys(value).length > 0 && (
        <pre style={jsonPreStyle}>{JSON.stringify(value, null, 2)}</pre>
      )}
    </div>
  );
};

export const WithImagesInteractive: Story = {
  render: () => <WithImagesInteractiveDemo />,
};

export const WithNotesAndImages: Story = {
  render: () => (
    <Odontogram
      label="Odontograma con notas e imágenes combinadas"
      value={{
        11: {
          surfaces: { occlusal: 'caries', mesial: 'caries' },
          notes: 'Caries interproximal activa. Revisar en 3 meses.',
          images: [
            { type: 'radiograph', url: PLACEHOLDER_IMG },
            { type: 'photo', url: PLACEHOLDER_IMG },
          ],
        },
        16: {
          condition: 'crown',
          notes: 'Corona provisional desde enero. Programar definitiva.',
          images: [{ type: 'photo', url: PLACEHOLDER_IMG }],
        },
        36: {
          condition: 'implant',
          notes: 'Implante Nobel Biocare colocado 2024-06.',
          images: [{ type: 'radiograph', url: PLACEHOLDER_IMG }],
        },
      }}
      disabled
    />
  ),
};

export const AllConditions: Story = {
  render: () => (
    <Odontogram
      label="Referencia: todas las condiciones disponibles"
      value={{
        11: { condition: 'missing' },
        12: { surfaces: { occlusal: 'caries' } },
        13: { surfaces: { occlusal: 'restoration' } },
        14: { condition: 'crown' },
        15: { condition: 'implant' },
        16: { surfaces: { occlusal: 'fracture' } },
        17: { surfaces: { occlusal: 'root_canal' } },
        18: { condition: 'extraction_planned' },
        21: {},
      }}
      disabled
      size="lg"
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
      disabled
    />
  ),
};
