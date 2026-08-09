import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    weight: { control: 'select', options: ['semibold', 'bold'] },
  },
  args: { children: 'Section title' },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { level: 1 },
};

export const AllLevels: Story = {
  args: { level: 1, children: null },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const SizeIndependentOfLevel: Story = {
  args: { level: 1, children: null },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Heading level={1} size="xs">
        h1 elemento, tamaño visual xs
      </Heading>
      <Heading level={4} size="2xl">
        h4 elemento, tamaño visual 2xl
      </Heading>
    </div>
  ),
};
