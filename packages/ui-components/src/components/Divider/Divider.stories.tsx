import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = { width: '320px' };
const textSecondary: React.CSSProperties = { fontSize: '0.875rem', color: 'var(--color-txt-secondary)' };

export const Horizontal: Story = {
  args: { orientation: 'horizontal', variant: 'solid' },
  render: (args) => (
    <div style={box}>
      <p style={{ ...textSecondary, marginBottom: '1rem' }}>Contenido superior</p>
      <Divider {...args} />
      <p style={{ ...textSecondary, marginTop: '1rem' }}>Contenido inferior</p>
    </div>
  ),
};

export const ConEtiqueta: Story = {
  args: { orientation: 'horizontal', variant: 'solid', label: 'O continúa con' },
  render: (args) => (
    <div style={box}>
      <Divider {...args} />
    </div>
  ),
};

export const Punteado: Story = {
  args: { orientation: 'horizontal', variant: 'dashed' },
  render: (args) => (
    <div style={box}>
      <p style={{ ...textSecondary, marginBottom: '1rem' }}>Sección A</p>
      <Divider {...args} />
      <p style={{ ...textSecondary, marginTop: '1rem' }}>Sección B</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', variant: 'solid' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '2.5rem' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--color-txt)' }}>Pacientes</span>
      <Divider {...args} />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-txt)' }}>Citas</span>
      <Divider {...args} />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-txt)' }}>Facturas</span>
    </div>
  ),
};
