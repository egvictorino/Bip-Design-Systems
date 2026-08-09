import type { Meta, StoryObj } from '@storybook/react';
import { ImagePopover } from './ImagePopover';
import type { ToothImage } from './types';

// Placeholder base64 PNG (8x8 gray square) para demos — mismo que Odontogram.stories.tsx
const PLACEHOLDER_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVQoU2NkYGD4z8BAAowDEgAA//8AzAADIgAAAABJRU5ErkJggg==';

const meta = {
  title: 'Components/Odontogram/ImagePopover',
  component: ImagePopover,
  // Renderiza vía createPortal a document.body — no tiene sentido centrar el canvas.
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    position: { control: false },
    initialImages: { control: false },
    onClose: { control: false },
    onSave: { control: false },
  },
} satisfies Meta<typeof ImagePopover>;

export default meta;
type Story = StoryObj<typeof meta>;

const POSITION = { top: 80, left: 80 };

const SAMPLE_IMAGES: ToothImage[] = [
  { type: 'radiograph', url: PLACEHOLDER_IMG },
  { type: 'photo', url: PLACEHOLDER_IMG },
];

export const Empty: Story = {
  args: {
    toothNumber: 26,
    initialImages: [],
    editable: true,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};

export const WithImages: Story = {
  args: {
    toothNumber: 26,
    initialImages: SAMPLE_IMAGES,
    editable: true,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};

export const ReadOnly: Story = {
  args: {
    toothNumber: 26,
    initialImages: SAMPLE_IMAGES,
    editable: false,
    position: POSITION,
    onClose: () => {},
    onSave: () => {},
  },
};
