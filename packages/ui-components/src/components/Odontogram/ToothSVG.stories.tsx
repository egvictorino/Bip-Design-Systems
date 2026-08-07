import type { Meta, StoryObj } from '@storybook/react';
import { ToothSVG } from './ToothSVG';
import type { ToothData } from './types';

const meta = {
  title: 'Components/Odontogram/ToothSVG',
  component: ToothSVG,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    arch: { control: 'select', options: ['upper', 'lower'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    data: { control: false },
    onSurfaceClick: { control: false },
  },
} satisfies Meta<typeof ToothSVG>;

export default meta;
type Story = StoryObj<typeof meta>;

const HEALTHY: ToothData = {};
const WITH_SURFACES: ToothData = { surfaces: { occlusal: 'caries', mesial: 'restoration' } };
const MISSING: ToothData = { condition: 'missing' };

export const Healthy: Story = {
  args: {
    toothNumber: 11,
    arch: 'upper',
    data: HEALTHY,
    size: 'lg',
    interactive: true,
    onSurfaceClick: () => {},
  },
};

export const WithSurfaceConditions: Story = {
  args: {
    toothNumber: 16,
    arch: 'upper',
    data: WITH_SURFACES,
    size: 'lg',
    interactive: true,
    onSurfaceClick: () => {},
  },
};

export const Missing: Story = {
  args: {
    toothNumber: 46,
    arch: 'lower',
    data: MISSING,
    size: 'lg',
    interactive: true,
    onSurfaceClick: () => {},
  },
};
