import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'white'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
};

export const Small: Story = {
  args: { size: 'sm', variant: 'primary' },
};

export const Large: Story = {
  args: { size: 'lg', variant: 'primary' },
};

export const Secondary: Story = {
  args: { size: 'md', variant: 'secondary' },
};

export const White: Story = {
  args: { size: 'md', variant: 'white' },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const AllSizes: Story = {
  args: { variant: 'primary' },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" variant="primary" />
      <Spinner size="md" variant="primary" />
      <Spinner size="lg" variant="primary" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: { size: 'md' },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="md" variant="primary" />
      <Spinner size="md" variant="secondary" />
      <div className="flex items-center justify-center rounded bg-interaction-primary-default p-4">
        <Spinner size="md" variant="white" />
      </div>
    </div>
  ),
};
