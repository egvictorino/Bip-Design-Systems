import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Components/Text',
  component: Text,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    weight: { control: 'select', options: ['normal', 'medium', 'semibold', 'bold'] },
    color: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'utility',
        'disabled',
        'important',
        'danger',
        'success',
        'warning',
        'info',
        'link',
      ],
    },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    truncate: { control: 'boolean' },
  },
  args: { children: 'The quick brown fox jumps over the lazy dog.' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md', weight: 'normal', color: 'default' },
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {(['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <Text key={size} size={size}>
          {size} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {(
        [
          'default',
          'secondary',
          'utility',
          'disabled',
          'important',
          'danger',
          'success',
          'warning',
          'info',
          'link',
        ] as const
      ).map((color) => (
        <Text key={color} color={color}>
          {color}
        </Text>
      ))}
    </div>
  ),
};

export const Truncate: Story = {
  args: {
    truncate: true,
    children: 'This is a very long line of text that will be truncated with an ellipsis.',
  },
  render: (args) => (
    <div style={{ width: '200px' }}>
      <Text {...args} />
    </div>
  ),
};
