import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const estadosMexico = [
  { value: 'nl', label: 'Nuevo León' },
  { value: 'mx', label: 'Ciudad de México' },
  { value: 'jal', label: 'Jalisco' },
  { value: 'mty', label: 'Monterrey' },
  { value: 'coah', label: 'Coahuila' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: 'Estado',
    placeholder: 'Selecciona un estado',
    options: estadosMexico,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Estado',
    placeholder: 'Selecciona un estado',
    options: estadosMexico,
  },
};

export const Bare: Story = {
  args: {
    variant: 'bare',
    label: 'Estado',
    placeholder: 'Selecciona un estado',
    options: estadosMexico,
  },
};

export const WithHelperText: Story = {
  args: {
    variant: 'outlined',
    label: 'Giro empresarial',
    placeholder: 'Selecciona el giro',
    helperText: 'Selecciona la categoría que mejor describe tu negocio',
    options: [
      { value: 'comercio', label: 'Comercio' },
      { value: 'servicios', label: 'Servicios' },
      { value: 'industria', label: 'Industria' },
      { value: 'tecnologia', label: 'Tecnología' },
    ],
  },
};

export const WithError: Story = {
  args: {
    variant: 'outlined',
    label: 'Estado',
    placeholder: 'Selecciona un estado',
    error: true,
    errorMessage: 'Debes seleccionar un estado',
    options: estadosMexico,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    label: 'País',
    options: [{ value: 'mx', label: 'México' }],
    value: 'mx',
    disabled: true,
  },
};

export const WithDisabledOptions: Story = {
  args: {
    variant: 'outlined',
    label: 'Plan',
    placeholder: 'Selecciona un plan',
    options: [
      { value: 'basico', label: 'Plan Básico' },
      { value: 'pro', label: 'Plan Profesional' },
      { value: 'enterprise', label: 'Plan Enterprise (próximamente)', disabled: true },
    ],
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'outlined',
    label: 'Municipio',
    placeholder: 'Selecciona un municipio',
    fullWidth: true,
    options: estadosMexico,
  },
};
