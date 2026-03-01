import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    resize: { control: 'select', options: ['none', 'vertical', 'horizontal', 'both'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Descripción',
    placeholder: 'Escribe aquí...',
    rows: 4,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Comentarios',
    placeholder: 'Agrega tus comentarios...',
    rows: 4,
  },
};

export const Bare: Story = {
  args: {
    variant: 'bare',
    label: 'Notas',
    placeholder: 'Escribe tus notas...',
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    variant: 'outlined',
    label: 'Descripción del producto',
    placeholder: 'Describe el producto...',
    helperText: 'Máximo 500 caracteres',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    variant: 'outlined',
    label: 'Descripción',
    placeholder: 'Escribe aquí...',
    error: true,
    errorMessage: 'La descripción es obligatoria',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    label: 'Campo deshabilitado',
    value: 'Contenido no editable',
    disabled: true,
    rows: 4,
  },
};

export const ReadOnly: Story = {
  args: {
    variant: 'outlined',
    label: 'Términos y condiciones',
    value: 'Al usar este servicio, aceptas los términos y condiciones de uso de la plataforma.',
    readOnly: true,
    helperText: 'Este campo no puede editarse',
    rows: 4,
  },
};

export const NoResize: Story = {
  args: {
    variant: 'outlined',
    label: 'Sin redimensionar',
    placeholder: 'Este campo no se puede redimensionar',
    resize: 'none',
    rows: 4,
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'outlined',
    label: 'Dirección completa',
    placeholder: 'Calle, número, colonia...',
    fullWidth: true,
    rows: 3,
  },
};
