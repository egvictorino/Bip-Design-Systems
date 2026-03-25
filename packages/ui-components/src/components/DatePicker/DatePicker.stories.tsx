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
    disabledDates: { control: false },
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
    <div style={{ minWidth: 240 }}>
      <DatePicker {...props} value={value} onChange={setValue} />
      {value && (
        <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
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
    <div style={{ width: '100%', maxWidth: 384 }}>
      <ControlledDatePicker label="Fecha de ingreso" fullWidth placeholder="DD/MM/AAAA" />
    </div>
  ),
};

// ─── Nuevas stories (mejoras) ─────────────────────────────────────────────────

/** Muestra el botón X para limpiar la fecha seleccionada */
export const WithClearButton: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha de nacimiento"
      helperText="Selecciona una fecha y luego usa el botón X para limpiarla"
      value={new Date(2026, 2, 15)}
    />
  ),
};

/** Fechas específicas deshabilitadas (fines de semana de marzo 2026) */
export const WithDisabledDates: Story = {
  render: () => {
    const weekends: Date[] = [];
    for (let d = 1; d <= 31; d++) {
      const date = new Date(2026, 2, d);
      const day = date.getDay();
      if (day === 0 || day === 6) weekends.push(date);
    }
    return (
      <ControlledDatePicker
        label="Día hábil"
        helperText="Los fines de semana están deshabilitados"
        disabledDates={weekends}
        value={new Date(2026, 2, 16)} // lunes
      />
    );
  },
};

/** Selector rápido de mes/año — clic en el encabezado del mes */
export const MonthYearPicker: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha"
      helperText="Haz clic en el encabezado del mes para navegar rápido"
      value={new Date(2026, 2, 15)}
    />
  ),
};

/** Navegación con teclado — flechas, Enter, Home/End, PageUp/Down */
export const KeyboardNavigation: Story = {
  render: () => (
    <ControlledDatePicker
      label="Fecha"
      helperText="Abre el calendario y navega con ↑ ↓ ← → · Enter selecciona · Esc cierra"
      value={new Date(2026, 2, 15)}
    />
  ),
};
