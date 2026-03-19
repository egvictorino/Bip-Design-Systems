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

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex items-end gap-4">
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
    <div className="flex items-center gap-4">
      <Avatar shape="circle" name="Ana López" size="lg" />
      <Avatar shape="square" name="Ana López" size="lg" />
    </div>
  ),
};

export const WithStatus: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Ana" status="online" size="md" />
        <span className="text-xs text-txt-secondary">online</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Bob" status="offline" size="md" />
        <span className="text-xs text-txt-secondary">offline</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Carlos" status="away" size="md" />
        <span className="text-xs text-txt-secondary">away</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Avatar name="Diana" status="busy" size="md" />
        <span className="text-xs text-txt-secondary">busy</span>
      </div>
    </div>
  ),
};

export const InitialsColors: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap gap-3">
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
