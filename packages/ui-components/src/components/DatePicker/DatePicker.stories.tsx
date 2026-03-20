import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: false },
    min: { control: false },
    max: { control: false },
    onChange: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Interactive wrapper ──────────────────────────────────────────────────────

const ControlledDatePicker = (props: Omit<React.ComponentProps<typeof DatePicker>, 'onChange'>) => {
  const [value, setValue] = useState<Date | null>(props.value ?? null);
  return (
    <div className="min-w-[240px]">
      <DatePicker {...props} value={value} onChange={setValue} />
      {value && (
        <p className="mt-2 text-xs text-text-secondary">
          Seleccionado: {value.toLocaleDateString('es-MX')}
        </p>
      )}
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <ControlledDatePicker placeholder="DD/MM/AAAA" />,
};

export const WithLabel: Story = {
  render: () => (
    <ControlledDatePicker label="Fecha de consulta" placeholder="Selecciona una fecha" />
  ),
};

export const WithValue: Story = {
  render: () => (
    <ControlledDatePicker label="Fecha de nacimiento" value={new Date(1990, 5, 15)} />
  ),
};

export const WithError: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha de cita"
      error
      errorMessage="La fecha es requerida"
      placeholder="DD/MM/AAAA"
    />
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha de nacimiento"
      helperText="Formato: día/mes/año"
      placeholder="DD/MM/AAAA"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <ControlledDatePicker label="Fecha" disabled value={new Date(2026, 2, 15)} />
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha de cita"
      helperText="Solo se pueden agendar citas del 1 al 30 de abril de 2026"
      min={new Date(2026, 3, 1)}
      max={new Date(2026, 3, 30)}
      value={new Date(2026, 3, 15)}
    />
  ),
};

export const SizeSm: Story = {
  render: () => <ControlledDatePicker label="Pequeño" size="sm" />,
};

export const SizeMd: Story = {
  render: () => <ControlledDatePicker label="Mediano" size="md" />,
};

export const SizeLg: Story = {
  render: () => <ControlledDatePicker label="Grande" size="lg" />,
};

export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-full max-w-sm">
      <ControlledDatePicker label="Fecha de ingreso" fullWidth placeholder="DD/MM/AAAA" />
    </div>
  ),
};
