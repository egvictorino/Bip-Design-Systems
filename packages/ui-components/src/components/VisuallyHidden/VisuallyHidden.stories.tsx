import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Texto solo para lectores de pantalla' },
  render: (args) => (
    <div>
      <p>Contenido visible en pantalla.</p>
      <VisuallyHidden {...args} />
    </div>
  ),
};
