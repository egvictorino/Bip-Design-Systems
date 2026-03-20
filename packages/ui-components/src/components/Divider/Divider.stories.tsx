import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal', variant: 'solid' },
  render: (args) => (
    <div className="w-80">
      <p className="text-sm text-txt-secondary mb-4">Contenido superior</p>
      <Divider {...args} />
      <p className="text-sm text-txt-secondary mt-4">Contenido inferior</p>
    </div>
  ),
};

export const ConEtiqueta: Story = {
  args: { orientation: 'horizontal', variant: 'solid', label: 'O continúa con' },
  render: (args) => (
    <div className="w-80">
      <Divider {...args} />
    </div>
  ),
};

export const Punteado: Story = {
  args: { orientation: 'horizontal', variant: 'dashed' },
  render: (args) => (
    <div className="w-80">
      <p className="text-sm text-txt-secondary mb-4">Sección A</p>
      <Divider {...args} />
      <p className="text-sm text-txt-secondary mt-4">Sección B</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', variant: 'solid' },
  render: (args) => (
    <div className="flex items-center gap-4 h-10">
      <span className="text-sm text-txt">Pacientes</span>
      <Divider {...args} />
      <span className="text-sm text-txt">Citas</span>
      <Divider {...args} />
      <span className="text-sm text-txt">Facturas</span>
    </div>
  ),
};
