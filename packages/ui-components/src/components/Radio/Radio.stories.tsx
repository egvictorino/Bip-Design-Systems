import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Opción A',
    name: 'demo',
  },
};

export const Selected: Story = {
  args: {
    label: 'Opción seleccionada',
    name: 'demo-selected',
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Envío express',
    helperText: 'Entrega en 24 horas',
    name: 'shipping',
  },
};

export const WithError: Story = {
  args: {
    label: 'Selecciona una opción',
    error: true,
    errorMessage: 'Debes seleccionar una opción para continuar',
    name: 'demo-error',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opción no disponible',
    disabled: true,
    name: 'demo-disabled',
  },
};

export const DisabledSelected: Story = {
  args: {
    label: 'Opción seleccionada no disponible',
    disabled: true,
    defaultChecked: true,
    name: 'demo-disabled-selected',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Tamaño pequeño',
    name: 'demo-sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Tamaño grande',
    name: 'demo-lg',
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio name="plan" label="Plan básico" helperText="$9.99 / mes" defaultChecked />
      <Radio name="plan" label="Plan profesional" helperText="$29.99 / mes" />
      <Radio name="plan" label="Plan empresarial" helperText="$99.99 / mes" />
    </div>
  ),
};
