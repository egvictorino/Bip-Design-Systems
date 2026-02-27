import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Clientes', href: '/clientes' },
      { label: 'María González' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Facturas' },
    ],
  },
};

export const DeepNesting: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Ventas', href: '/ventas' },
      { label: 'Facturas', href: '/ventas/facturas' },
      { label: 'Agosto 2025', href: '/ventas/facturas/agosto-2025' },
      { label: 'FAC-2025-0842' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Reportes', href: '/reportes' },
      { label: 'Ingresos' },
    ],
    separator: <span className="text-text-disabled select-none">/</span>,
  },
};

export const SingleLevel: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};
