import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Activo',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Completado',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pendiente',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Rechazado',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Borrador',
  },
};

export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true,
    children: 'En línea',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Nuevo',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Destacado',
  },
};

export const AllVariants: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">Activo</Badge>
      <Badge variant="success">Completado</Badge>
      <Badge variant="warning">Pendiente</Badge>
      <Badge variant="error">Rechazado</Badge>
      <Badge variant="neutral">Borrador</Badge>
    </div>
  ),
};

export const AllWithDot: Story = {
  args: { children: 'Badge' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary" dot>Activo</Badge>
      <Badge variant="success" dot>Completado</Badge>
      <Badge variant="warning" dot>Pendiente</Badge>
      <Badge variant="error" dot>Rechazado</Badge>
      <Badge variant="neutral" dot>Borrador</Badge>
    </div>
  ),
};
