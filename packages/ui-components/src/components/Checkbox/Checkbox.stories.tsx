import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Acepto los términos y condiciones',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checkbox seleccionado',
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Suscribirse al boletín',
    helperText: 'Recibirás noticias y novedades cada semana',
  },
};

export const WithError: Story = {
  args: {
    label: 'Acepto los términos',
    error: true,
    errorMessage: 'Debes aceptar los términos para continuar',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Opción no disponible',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Opción seleccionada no disponible',
    disabled: true,
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Tamaño pequeño',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Tamaño grande',
  },
};

export const NoLabel: Story = {
  args: {},
};

export const Required: Story = {
  args: {
    label: 'Acepto los términos y condiciones',
    required: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Seleccionar todos',
    indeterminate: true,
  },
};

export const IndeterminateDisabled: Story = {
  args: {
    label: 'Seleccionar todos (deshabilitado)',
    indeterminate: true,
    disabled: true,
  },
};
