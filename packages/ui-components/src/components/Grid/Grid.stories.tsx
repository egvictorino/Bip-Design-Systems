import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta = {
  title: 'Components/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'select', options: ['responsive', 1, 2, 3, 4, 5, 6, 12] },
    gap: { control: 'select', options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'] },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const swatch: React.CSSProperties = {
  padding: '1.5rem',
  borderRadius: 'var(--radius-control)',
  backgroundColor: 'var(--color-surface-2)',
  border: '1px solid var(--color-edge)',
  color: 'var(--color-txt)',
  fontSize: '0.875rem',
  textAlign: 'center',
};

export const Responsive: Story = {
  args: { columns: 'responsive', gap: '4', children: null },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={swatch}>
          {i + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const FixedColumns: Story = {
  args: { columns: 3, gap: '4', children: null },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={swatch}>
          {i + 1}
        </div>
      ))}
    </Grid>
  ),
};
