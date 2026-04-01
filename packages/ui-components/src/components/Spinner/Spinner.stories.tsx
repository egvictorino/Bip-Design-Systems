import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'white', 'danger', 'success', 'info'] },
    speed: { control: 'select', options: ['slow', 'normal', 'fast'] },
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

export const ExtraSmall: Story = {
  args: { size: 'xs', variant: 'primary' },
};

export const Small: Story = {
  args: { size: 'sm', variant: 'primary' },
};

export const Large: Story = {
  args: { size: 'lg', variant: 'primary' },
};

export const ExtraLarge: Story = {
  args: { size: 'xl', variant: 'primary' },
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

export const Danger: Story = {
  args: { size: 'md', variant: 'danger' },
};

export const Success: Story = {
  args: { size: 'md', variant: 'success' },
};

export const Info: Story = {
  args: { size: 'md', variant: 'info' },
};

export const SlowSpeed: Story = {
  args: { size: 'md', variant: 'primary', speed: 'slow' },
};

export const FastSpeed: Story = {
  args: { size: 'md', variant: 'primary', speed: 'fast' },
};

export const AllSizes: Story = {
  args: { variant: 'primary' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Spinner size="xs" variant="primary" />
      <Spinner size="sm" variant="primary" />
      <Spinner size="md" variant="primary" />
      <Spinner size="lg" variant="primary" />
      <Spinner size="xl" variant="primary" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: { size: 'md' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Spinner size="md" variant="primary" />
      <Spinner size="md" variant="secondary" />
      <Spinner size="md" variant="danger" />
      <Spinner size="md" variant="success" />
      <Spinner size="md" variant="info" />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.25rem',
          backgroundColor: 'var(--color-primary)',
          padding: '1rem',
        }}
      >
        <Spinner size="md" variant="white" />
      </div>
    </div>
  ),
};

export const AllSpeeds: Story = {
  args: { size: 'md', variant: 'primary' },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <Spinner size="md" variant="primary" speed="slow" />
      <Spinner size="md" variant="primary" />
      <Spinner size="md" variant="primary" speed="fast" />
    </div>
  ),
};
