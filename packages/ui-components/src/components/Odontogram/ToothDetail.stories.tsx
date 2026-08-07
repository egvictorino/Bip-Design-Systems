import type { Meta, StoryObj } from '@storybook/react';
import { ToothDetail } from './ToothDetail';
import type { ToothData } from './types';

const meta = {
  title: 'Components/Odontogram/ToothDetail',
  component: ToothDetail,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    arch: { control: 'select', options: ['upper', 'lower'] },
    data: { control: false },
    onChange: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof ToothDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_DATA: ToothData = {
  surfaces: { occlusal: 'caries', mesial: 'restoration' },
  notes: 'Sensibilidad al frío reportada por el paciente.',
};

export const Editable: Story = {
  args: {
    toothNumber: 16,
    arch: 'upper',
    data: SAMPLE_DATA,
    readOnly: false,
    onChange: () => {},
    onClose: () => {},
  },
};

export const ReadOnly: Story = {
  args: {
    toothNumber: 16,
    arch: 'upper',
    data: SAMPLE_DATA,
    readOnly: true,
    onChange: () => {},
    onClose: () => {},
  },
};
