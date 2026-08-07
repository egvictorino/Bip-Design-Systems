import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] },
    gap: {
      control: 'select',
      options: ['0', '0-5', '1', '1-5', '2', '3', '4', '5', '6', '8', '10', '12', '16'],
    },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const swatch: React.CSSProperties = {
  padding: '1rem',
  borderRadius: 'var(--radius-control)',
  backgroundColor: 'var(--color-surface-2)',
  border: '1px solid var(--color-edge)',
  color: 'var(--color-txt)',
  fontSize: '0.875rem',
};

export const Column: Story = {
  args: { direction: 'column', gap: '4', children: null },
  render: (args) => (
    <Stack {...args}>
      <div style={swatch}>uno</div>
      <div style={swatch}>dos</div>
      <div style={swatch}>tres</div>
    </Stack>
  ),
};

export const Row: Story = {
  args: { direction: 'row', gap: '3', align: 'center', children: null },
  render: (args) => (
    <Stack {...args}>
      <div style={swatch}>uno</div>
      <div style={swatch}>dos</div>
      <div style={swatch}>tres</div>
    </Stack>
  ),
};

export const SpaceBetween: Story = {
  args: { direction: 'row', justify: 'between', gap: '2', children: null },
  render: (args) => (
    <Stack {...args} style={{ width: '400px' }}>
      <div style={swatch}>izquierda</div>
      <div style={swatch}>derecha</div>
    </Stack>
  ),
};
