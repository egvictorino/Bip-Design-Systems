import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './DateRangePicker';

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Controlled wrapper ───────────────────────────────────────────────────────

const ControlledStory = () => {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <div style={{ width: '20rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateRangePicker
        label="Periodo de reporte"
        value={range}
        onChange={setRange}
        helperText="Selecciona una fecha de inicio y fin"
      />
      <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
        Desde: {range.from?.toLocaleDateString('es-MX') ?? '—'} &nbsp;|&nbsp;
        Hasta: {range.to?.toLocaleDateString('es-MX') ?? '—'}
      </p>
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {},
  render: () => <ControlledStory />,
};

export const ConValor: Story = {
  args: {},
  render: () => {
    const Story = () => {
      const [range, setRange] = useState<DateRange>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 0, 31),
      });
      return (
        <div style={{ width: '20rem' }}>
          <DateRangePicker label="Periodo" value={range} onChange={setRange} />
        </div>
      );
    };
    return <Story />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Periodo',
    disabled: true,
    value: { from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) },
  },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};

export const ConError: Story = {
  args: {
    label: 'Periodo de facturación',
    error: true,
    errorMessage: 'El rango no puede ser mayor a 90 días',
  },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};

export const ConMinMax: Story = {
  args: {},
  render: () => {
    const Story = () => {
      const [range, setRange] = useState<DateRange>({ from: null, to: null });
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), 1);
      const max = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      return (
        <div style={{ width: '20rem' }}>
          <DateRangePicker
            label="Periodo (limitado a 3 meses)"
            value={range}
            onChange={setRange}
            min={min}
            max={max}
            helperText={`Entre ${min.toLocaleDateString('es-MX')} y ${max.toLocaleDateString('es-MX')}`}
          />
        </div>
      );
    };
    return <Story />;
  },
};

export const ConDisabledDates: Story = {
  args: {},
  render: () => {
    const Story = () => {
      const [range, setRange] = useState<DateRange>({ from: null, to: null });
      // Disable all Saturdays and Sundays of January 2024
      const disabledDates = [
        new Date(2024, 0, 6), new Date(2024, 0, 7),
        new Date(2024, 0, 13), new Date(2024, 0, 14),
        new Date(2024, 0, 20), new Date(2024, 0, 21),
        new Date(2024, 0, 27), new Date(2024, 0, 28),
      ];
      return (
        <div style={{ width: '20rem' }}>
          <DateRangePicker
            label="Solo días hábiles"
            value={range}
            onChange={setRange}
            disabledDates={disabledDates}
            helperText="Fines de semana deshabilitados"
          />
        </div>
      );
    };
    return <Story />;
  },
};

export const SizeSm: Story = {
  args: { size: 'sm', label: 'Periodo' },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};

export const SizeMd: Story = {
  args: { size: 'md', label: 'Periodo' },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};

export const SizeLg: Story = {
  args: { size: 'lg', label: 'Periodo' },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, label: 'Periodo de reporte' },
  render: (args) => (
    <div style={{ width: '32rem' }}>
      <DateRangePicker {...args} />
    </div>
  ),
};
