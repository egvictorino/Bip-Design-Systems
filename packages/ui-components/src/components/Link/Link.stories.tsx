import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    underline: { control: 'select', options: ['always', 'hover', 'none'] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Enlace de ejemplo',
  },
};

export const UnderlineOnHover: Story = {
  args: {
    href: '#',
    underline: 'hover',
    children: 'Subrayado solo al pasar el mouse',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    external: true,
    children: 'Enlace externo',
  },
};

export const Disabled: Story = {
  args: {
    href: '#',
    disabled: true,
    children: 'Enlace deshabilitado',
  },
};
