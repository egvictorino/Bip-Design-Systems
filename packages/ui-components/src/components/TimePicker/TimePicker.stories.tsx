import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    onChange: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    step: { control: 'select', options: [5, 10, 15, 30] },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Interactive wrapper ──────────────────────────────────────────────────────

const ControlledTimePicker = (props: Omit<React.ComponentProps<typeof TimePicker>, 'onChange'>) => {
  const [value, setValue] = useState<string | undefined>(props.value);
  return (
    <div className="min-w-[200px]">
      <TimePicker {...props} value={value} onChange={setValue} />
      {value && (
        <p className="mt-2 text-xs text-text-secondary">Seleccionado: {value}</p>
      )}
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <ControlledTimePicker placeholder="HH:MM" />,
};

export const WithLabel: Story = {
  render: () => <ControlledTimePicker label="Hora de consulta" placeholder="09:00" />,
};

export const WithValue: Story = {
  render: () => <ControlledTimePicker label="Hora de inicio" value="09:30" />,
};

export const WithError: Story = {
  render: () => (
    <ControlledTimePicker
      label="Hora de cita"
      error
      errorMessage="La hora es requerida"
      placeholder="HH:MM"
    />
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <ControlledTimePicker
      label="Hora de apertura"
      helperText="Formato 24 horas"
      placeholder="HH:MM"
    />
  ),
};

export const Disabled: Story = {
  render: () => <ControlledTimePicker label="Hora" disabled value="14:00" />,
};

export const Step15: Story = {
  render: () => (
    <ControlledTimePicker label="Hora (cada 15 min)" step={15} placeholder="HH:MM" />
  ),
};

export const Step30: Story = {
  render: () => (
    <ControlledTimePicker label="Hora (cada 30 min)" step={30} placeholder="HH:MM" />
  ),
};

export const SizeSm: Story = {
  render: () => <ControlledTimePicker label="Pequeño" size="sm" />,
};

export const SizeMd: Story = {
  render: () => <ControlledTimePicker label="Mediano" size="md" />,
};

export const SizeLg: Story = {
  render: () => <ControlledTimePicker label="Grande" size="lg" />,
};

export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-full max-w-sm">
      <ControlledTimePicker label="Hora de inicio" fullWidth placeholder="HH:MM" />
    </div>
  ),
};

const AppointmentFormStory = () => {
  const [start, setStart] = useState<string | undefined>('09:00');
  const [end, setEnd] = useState<string | undefined>('09:30');
  return (
    <div className="flex flex-col gap-4 w-64">
      <TimePicker
        label="Hora de inicio"
        value={start}
        onChange={setStart}
        step={15}
        fullWidth
      />
      <TimePicker
        label="Hora de fin"
        value={end}
        onChange={setEnd}
        step={15}
          fullWidth
        />
      </div>
  );
};

export const AppointmentForm: Story = {
  parameters: { layout: 'padded' },
  render: () => <AppointmentFormStory />,
};
