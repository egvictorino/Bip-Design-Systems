import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '../Button/index.js';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Abrir popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Contenido del popover. Se cierra con click afuera o Escape.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const Placements: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Popover>
        <PopoverTrigger>
          <Button variant="secondary">bottom-end</Button>
        </PopoverTrigger>
        <PopoverContent placement="bottom-end">
          <p>Alineado al final, abajo del trigger.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Button variant="secondary">top-start</Button>
        </PopoverTrigger>
        <PopoverContent placement="top-start">
          <p>Alineado al inicio, arriba del trigger.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
