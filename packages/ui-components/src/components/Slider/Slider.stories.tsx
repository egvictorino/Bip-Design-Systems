import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Volumen',
    defaultValue: 40,
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    label: 'Brillo',
    showValue: true,
    defaultValue: 65,
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Presupuesto',
    error: true,
    errorMessage: 'El valor está fuera del rango permitido.',
    defaultValue: 10,
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'No disponible',
    disabled: true,
    defaultValue: 30,
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};
