import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from './CheckboxGroup';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup label="Notificaciones">
      <Checkbox label="Correo electrónico" defaultChecked />
      <Checkbox label="SMS" />
      <Checkbox label="Push" defaultChecked />
    </CheckboxGroup>
  ),
};

export const WithHelperText: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup label="Intereses" helperText="Elige todos los que apliquen">
      <Checkbox label="Tecnología" defaultChecked />
      <Checkbox label="Diseño" />
      <Checkbox label="Negocios" />
    </CheckboxGroup>
  ),
};

export const WithError: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup
      label="Términos y condiciones"
      error
      errorMessage="Debes aceptar al menos una opción para continuar"
    >
      <Checkbox label="Acepto los términos de servicio" />
      <Checkbox label="Acepto la política de privacidad" />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup label="Opciones no disponibles" disabled>
      <Checkbox label="Opción A" defaultChecked />
      <Checkbox label="Opción B" />
      <Checkbox label="Opción C" defaultChecked />
    </CheckboxGroup>
  ),
};

export const Small: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup label="Tamaño pequeño" size="sm">
      <Checkbox label="Opción 1" defaultChecked />
      <Checkbox label="Opción 2" />
    </CheckboxGroup>
  ),
};

export const Large: Story = {
  args: { children: null },
  render: () => (
    <CheckboxGroup label="Tamaño grande" size="lg">
      <Checkbox label="Opción 1" defaultChecked />
      <Checkbox label="Opción 2" />
    </CheckboxGroup>
  ),
};
