import type { Meta, StoryObj } from '@storybook/react';
import { NotePopover } from './NotePopover';

const meta = {
  title: 'Components/Odontogram/NotePopover',
  component: NotePopover,
  // Renderiza vía createPortal a document.body — no tiene sentido centrar el canvas.
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    position: { control: false },
    onClose: { control: false },
    onSave: { control: false },
  },
} satisfies Meta<typeof NotePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

const POSITION = { top: 80, left: 80 };

export const Empty: Story = {
  args: {
    toothNumber: 21,
    initialNote: '',
    editable: true,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};

export const WithNote: Story = {
  args: {
    toothNumber: 21,
    initialNote: 'Sensibilidad al frío reportada por el paciente.',
    editable: true,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};

export const ReadOnly: Story = {
  args: {
    toothNumber: 21,
    initialNote: 'Sensibilidad al frío reportada por el paciente.',
    editable: false,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};
