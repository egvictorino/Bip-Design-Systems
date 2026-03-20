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

const ControlledStory = () => {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <div className="w-80 flex flex-col gap-4">
      <DateRangePicker
        label="Periodo de reporte"
        value={range}
        onChange={setRange}
        helperText="Selecciona una fecha de inicio y fin"
      />
      <p className="text-xs text-txt-secondary">
        Desde: {range.from?.toLocaleDateString('es-MX') ?? '—'} &nbsp;|&nbsp;
        Hasta: {range.to?.toLocaleDateString('es-MX') ?? '—'}
      </p>
    </div>
  );
};

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
        <div className="w-80">
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
    <div className="w-80">
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
    <div className="w-80">
      <DateRangePicker {...args} />
    </div>
  ),
};
