import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Email',
    type: 'email',
    placeholder: 'correo@ejemplo.com',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingresa tu nombre',
  },
};

export const Bare: Story = {
  args: {
    variant: 'bare',
    label: 'Buscar',
    type: 'text',
    placeholder: 'Escribe para buscar...',
  },
};

export const WithHelperText: Story = {
  args: {
    variant: 'outlined',
    label: 'Password',
    type: 'password',
    placeholder: '********',
    helperText: 'Debe tener al menos 8 caracteres',
  },
};

export const WithError: Story = {
  args: {
    variant: 'outlined',
    label: 'Email',
    type: 'email',
    placeholder: 'correo@ejemplo.com',
    error: true,
    errorMessage: 'El formato del email no es valido',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    label: 'Campo deshabilitado',
    type: 'text',
    placeholder: 'No editable',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    variant: 'outlined',
    label: 'RFC',
    value: 'ABC123456789',
    readOnly: true,
    helperText: 'Este campo no puede editarse',
  },
};

export const NumberInput: Story = {
  args: {
    variant: 'outlined',
    label: 'Cantidad',
    type: 'number',
    placeholder: '0',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'outlined',
    label: 'Direccion',
    type: 'text',
    placeholder: 'Calle y numero',
    fullWidth: true,
  },
};
