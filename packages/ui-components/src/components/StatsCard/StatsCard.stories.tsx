import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from './StatsCard';

const iconStyle = { width: '1.25rem', height: '1.25rem' };

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle} aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={iconStyle} aria-hidden="true">
    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003z" />
  </svg>
);

const meta = {
  title: 'Components/StatsCard',
  component: StatsCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'elevated'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    trend: { control: 'number' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Citas hoy',
    value: 12,
    trend: 8,
    description: 'vs. ayer',
  },
};

export const Negativo: Story = {
  args: {
    title: 'Ingresos del mes',
    value: '$48,200',
    trend: -3,
    description: 'vs. mes anterior',
  },
};

export const TrendNeutro: Story = {
  args: {
    title: 'Consultas',
    value: 45,
    trend: 0,
    description: 'igual que ayer',
  },
};

export const SinTrend: Story = {
  args: {
    title: 'Pacientes activos',
    value: 284,
    description: 'Total registrados',
    icon: <UserIcon />,
  },
};

export const Loading: Story = {
  args: {
    title: 'Citas hoy',
    value: 0,
    loading: true,
    icon: <CalendarIcon />,
  },
};

export const Variantes: Story = {
  args: { title: '', value: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' }}>
      <StatsCard title="Outlined" value={42} trend={5} description="variante outlined" variant="outlined" />
      <StatsCard title="Filled" value={42} trend={5} description="variante filled" variant="filled" />
      <StatsCard title="Elevated" value={42} trend={5} description="variante elevated" variant="elevated" />
    </div>
  ),
};

export const Tamaños: Story = {
  args: { title: '', value: '' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' }}>
      <StatsCard title="Small" value="$12,400" trend={3} description="tamaño sm" size="sm" />
      <StatsCard title="Medium" value="$12,400" trend={3} description="tamaño md" size="md" />
      <StatsCard title="Large" value="$12,400" trend={3} description="tamaño lg" size="lg" />
    </div>
  ),
};

export const Dashboard: Story = {
  args: { title: '', value: '' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '600px' }}>
      <StatsCard title="Citas hoy" value={12} trend={8} description="vs. ayer" icon={<CalendarIcon />} />
      <StatsCard title="Pacientes nuevos" value={3} trend={50} description="esta semana" icon={<UserIcon />} />
      <StatsCard title="Ingresos del mes" value="$48,200" trend={-3} description="vs. mes anterior" />
      <StatsCard title="Citas pendientes" value={7} description="sin confirmar" />
    </div>
  ),
};

export const DashboardLoading: Story = {
  args: { title: '', value: '' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '600px' }}>
      <StatsCard title="Citas hoy" value={0} loading icon={<CalendarIcon />} />
      <StatsCard title="Pacientes nuevos" value={0} loading icon={<UserIcon />} />
      <StatsCard title="Ingresos del mes" value={0} loading />
      <StatsCard title="Citas pendientes" value={0} loading />
    </div>
  ),
};
