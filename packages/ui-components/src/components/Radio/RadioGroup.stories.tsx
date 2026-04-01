import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup label="Plan de suscripción">
      <Radio name="plan" label="Plan básico" defaultChecked />
      <Radio name="plan" label="Plan profesional" />
      <Radio name="plan" label="Plan empresarial" />
    </RadioGroup>
  ),
};

export const WithHelperText: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup label="Método de envío" helperText="El tiempo de entrega puede variar según tu ubicación">
      <Radio name="shipping" label="Envío estándar" helperText="3-5 días hábiles" defaultChecked />
      <Radio name="shipping" label="Envío express" helperText="1-2 días hábiles" />
      <Radio name="shipping" label="Envío mismo día" helperText="Solo en zonas metropolitanas" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup
      label="Forma de pago"
      error
      errorMessage="Debes seleccionar una forma de pago para continuar"
    >
      <Radio name="payment" label="Tarjeta de crédito" />
      <Radio name="payment" label="Tarjeta de débito" />
      <Radio name="payment" label="Transferencia bancaria" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup label="Opciones no disponibles" disabled>
      <Radio name="disabled" label="Opción A" defaultChecked />
      <Radio name="disabled" label="Opción B" />
      <Radio name="disabled" label="Opción C" />
    </RadioGroup>
  ),
};

export const Small: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup label="Tamaño pequeño" size="sm">
      <Radio name="size-sm" label="Opción 1" defaultChecked />
      <Radio name="size-sm" label="Opción 2" />
    </RadioGroup>
  ),
};

export const Large: Story = {
  args: { children: null },
  render: () => (
    <RadioGroup label="Tamaño grande" size="lg">
      <Radio name="size-lg" label="Opción 1" defaultChecked />
      <Radio name="size-lg" label="Opción 2" />
    </RadioGroup>
  ),
};
