import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    lines: { control: 'number' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variantes individuales ───────────────────────────────────────────────────

export const Text: Story = {
  args: { variant: 'text' },
};

export const TextBlock: Story = {
  args: { variant: 'text', lines: 4 },
};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const Rect: Story = {
  args: { variant: 'rect' },
};

// ─── Composiciones realistas ──────────────────────────────────────────────────

export const ProfileCard: Story = {
  args: { variant: 'text' },
  render: () => (
    <div className="w-72 rounded-lg border border-interaction-tertiary-default p-4 flex flex-col gap-4">
      {/* Header: avatar + nombre */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" />
        <div className="flex-1 flex flex-col gap-2">
          {/* Wrapper div controla el ancho en lugar de className */}
          <div className="w-2/3"><Skeleton /></div>
          <div className="w-1/3"><Skeleton /></div>
        </div>
      </div>
      {/* Imagen — h-40 > h-32 (default rect), override funciona correctamente */}
      <Skeleton variant="rect" className="h-40" />
      {/* Descripción */}
      <Skeleton lines={3} />
    </div>
  ),
};

export const DataRows: Story = {
  args: { variant: 'text' },
  render: () => (
    <div className="w-[480px] flex flex-col divide-y divide-interaction-tertiary-default">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton variant="circle" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="w-2/3"><Skeleton /></div>
            <div className="w-1/2"><Skeleton /></div>
          </div>
          {/* h-6 > h-4 funciona; w-16 controlado por el wrapper */}
          <div className="w-16">
            <Skeleton className="h-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormLoading: Story = {
  args: { variant: 'text' },
  render: () => (
    <div className="w-96 flex flex-col gap-5">
      {/* Campo 1 */}
      <div className="flex flex-col gap-1.5">
        <div className="w-24"><Skeleton /></div>
        {/* h-9 > h-4 funciona correctamente */}
        <Skeleton className="h-9 rounded-sm" />
      </div>
      {/* Campo 2 */}
      <div className="flex flex-col gap-1.5">
        <div className="w-32"><Skeleton /></div>
        <Skeleton className="h-9 rounded-sm" />
      </div>
      {/* Campo 3 - textarea */}
      <div className="flex flex-col gap-1.5">
        <div className="w-20"><Skeleton /></div>
        {/* h-24 > h-4 funciona correctamente */}
        <Skeleton className="h-24 rounded-sm" />
      </div>
      {/* Botón — w-28 controlado por wrapper */}
      <div className="w-28">
        <Skeleton className="h-9 rounded-sm" />
      </div>
    </div>
  ),
};
