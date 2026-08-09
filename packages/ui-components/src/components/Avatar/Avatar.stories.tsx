import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape:  { control: 'select', options: ['circle', 'square'] },
    status: { control: 'select', options: ['online', 'offline', 'away', 'busy'] },
    src:    { control: 'text' },
    name:   { control: 'text' },
    alt:    { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    name: 'Ana López',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: { name: 'Juan García', size: 'md' },
};

export const WithIcon: Story = {
  args: { size: 'md' },
};

const statusLabel: React.CSSProperties = { fontSize: '0.75rem', color: 'var(--color-txt-secondary)' };

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
      <Avatar size="xs" name="Ana López" />
      <Avatar size="sm" name="Ana López" />
      <Avatar size="md" name="Ana López" />
      <Avatar size="lg" name="Ana López" />
      <Avatar size="xl" name="Ana López" />
    </div>
  ),
};

export const Shapes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar shape="circle" name="Ana López" size="lg" />
      <Avatar shape="square" name="Ana López" size="lg" />
    </div>
  ),
};

export const WithStatus: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <Avatar name="Ana" status="online" size="md" />
        <span style={statusLabel}>online</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <Avatar name="Bob" status="offline" size="md" />
        <span style={statusLabel}>offline</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <Avatar name="Carlos" status="away" size="md" />
        <span style={statusLabel}>away</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <Avatar name="Diana" status="busy" size="md" />
        <span style={statusLabel}>busy</span>
      </div>
    </div>
  ),
};

export const InitialsColors: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      {[
        'Ana López',
        'Bob García',
        'Carlos Ruiz',
        'Diana Mora',
        'Eduardo Vega',
        'Fernanda Cruz',
        'Gustavo Díaz',
        'Helena Soto',
      ].map((name) => (
        <Avatar key={name} name={name} size="md" />
      ))}
    </div>
  ),
};

export const ImageFallback: Story = {
  args: {
    src: 'https://url-que-no-existe.example.com/broken.jpg',
    name: 'Juan García',
    size: 'md',
  },
};

export const Group: Story = {
  args: {},
  render: () => (
    <AvatarGroup max={4}>
      <Avatar name="Ana López" />
      <Avatar name="Bob García" />
      <Avatar name="Carlos Ruiz" />
      <Avatar name="Diana Mora" />
      <Avatar name="Eduardo Vega" />
      <Avatar name="Fernanda Cruz" />
    </AvatarGroup>
  ),
};

export const GroupWithImages: Story = {
  args: {},
  render: () => (
    <AvatarGroup max={3} size="lg">
      <Avatar src="https://i.pravatar.cc/150?img=1" name="Ana" />
      <Avatar src="https://i.pravatar.cc/150?img=2" name="Bob" />
      <Avatar src="https://i.pravatar.cc/150?img=3" name="Carlos" />
      <Avatar name="Diana" />
    </AvatarGroup>
  ),
};
