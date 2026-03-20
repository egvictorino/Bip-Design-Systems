import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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

export const Variants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar value={70} variant="default" label="Default" showValue />
      <ProgressBar value={85} variant="success" label="Éxito" showValue />
      <ProgressBar value={45} variant="warning" label="Advertencia" showValue />
      <ProgressBar value={30} variant="error" label="Error" showValue />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar value={60} size="sm" label="Small" />
      <ProgressBar value={60} size="md" label="Medium" />
      <ProgressBar value={60} size="lg" label="Large" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Procesando...' },
};

export const ZeroAndFull: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <ProgressBar value={0} label="Sin progreso" showValue />
      <ProgressBar value={100} variant="success" label="Completado" showValue />
    </div>
  ),
};
