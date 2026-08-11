import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value:    { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant:  { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    striped:  { control: 'boolean' },
    animated: { control: 'boolean' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 65 },
};

export const WithLabel: Story = {
  args: { value: 75, label: 'Cargando archivos', showValue: true },
};

export const WithHelperText: Story = {
  args: {
    value: 40,
    label: 'Subiendo archivos',
    showValue: true,
    helperText: '2 de 5 archivos procesados',
    id: 'upload-progress',
  },
};

export const WithValueText: Story = {
  args: {
    value: 75,
    label: 'Instalando',
    showValue: true,
    valueText: '75 de 100 paquetes instalados',
    id: 'install-progress',
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
      <ProgressBar value={70} variant="default" label="Default"     showValue />
      <ProgressBar value={85} variant="success" label="Éxito"       showValue />
      <ProgressBar value={45} variant="warning" label="Advertencia" showValue />
      <ProgressBar value={30} variant="danger"   label="Error"       showValue />
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
      <ProgressBar value={60} size="sm" label="Small" />
      <ProgressBar value={60} size="md" label="Medium" />
      <ProgressBar value={60} size="lg" label="Large" />
    </div>
  ),
};

// ─── Striped ──────────────────────────────────────────────────────────────────

export const Striped: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
      <ProgressBar value={70} variant="default" label="Default striped"    striped showValue />
      <ProgressBar value={85} variant="success" label="Success striped"    striped showValue />
      <ProgressBar value={45} variant="warning" label="Warning striped"    striped showValue />
      <ProgressBar value={30} variant="danger"   label="Error striped"      striped showValue />
    </div>
  ),
};

export const StripedAnimated: Story = {
  args: { value: 60, label: 'Procesando', striped: true, animated: true, showValue: true },
};

// ─── Special states ───────────────────────────────────────────────────────────

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Procesando...' },
};

export const ZeroAndFull: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
      <ProgressBar value={0}   label="Sin progreso" showValue />
      <ProgressBar value={100} variant="success" label="Completado" showValue />
    </div>
  ),
};
