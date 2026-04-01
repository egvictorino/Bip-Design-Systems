import { useState } from 'react';
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
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'url'] },
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

export const FullWidth: Story = {
  args: {
    variant: 'outlined',
    label: 'Direccion',
    type: 'text',
    placeholder: 'Calle y numero',
    fullWidth: true,
  },
};

// ─── Nuevas stories ───────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const WithStartIcon: Story = {
  args: {
    variant: 'outlined',
    label: 'Buscar',
    placeholder: 'Escribe para buscar...',
    startIcon: <SearchIcon />,
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'outlined',
    label: 'Correo',
    type: 'email',
    placeholder: 'correo@ejemplo.com',
    endIcon: <MailIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'outlined',
    label: 'Buscar correo',
    type: 'email',
    placeholder: 'correo@ejemplo.com',
    startIcon: <SearchIcon />,
    endIcon: <MailIcon />,
  },
};

export const Password: Story = {
  args: {
    variant: 'outlined',
    label: 'Contraseña',
    type: 'password',
    placeholder: '••••••••',
    helperText: 'El toggle muestra/oculta la contraseña',
  },
};

export const Clearable: Story = {
  render: () => {
    const ClearableStory = () => {
      const [value, setValue] = useState('Texto de ejemplo');
      return (
        <Input
          variant="outlined"
          label="Campo con limpiar"
          placeholder="Escribe algo..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
        />
      );
    };
    return <ClearableStory />;
  },
};

export const Required: Story = {
  args: {
    variant: 'outlined',
    label: 'Campo requerido',
    type: 'text',
    placeholder: 'Este campo es obligatorio',
    required: true,
  },
};

export const Url: Story = {
  args: {
    variant: 'outlined',
    label: 'Sitio web',
    type: 'url',
    placeholder: 'https://ejemplo.com',
    helperText: 'Incluye https://',
  },
};
