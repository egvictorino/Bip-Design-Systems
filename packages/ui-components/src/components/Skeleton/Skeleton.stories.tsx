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
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    animation: { control: 'select', options: ['pulse', 'wave', 'none'] },
    width: { control: 'text' },
    height: { control: 'text' },
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

// ─── Tamaños ──────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>{size}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Skeleton variant="circle" size={size} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Skeleton variant="text" size={size} />
              <Skeleton variant="text" size={size} width="60%" />
            </div>
          </div>
          <Skeleton variant="rect" size={size} />
        </div>
      ))}
    </div>
  ),
};

// ─── Animaciones ──────────────────────────────────────────────────────────────

export const AllAnimations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      {(['pulse', 'wave', 'none'] as const).map((animation) => (
        <div key={animation} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
            {animation}
          </span>
          <Skeleton variant="rect" animation={animation} />
        </div>
      ))}
    </div>
  ),
};

export const AnimationWave: Story = {
  args: { variant: 'rect', animation: 'wave' },
};

export const AnimationNone: Story = {
  args: { variant: 'rect', animation: 'none' },
};

// ─── Dimensiones personalizadas ───────────────────────────────────────────────

export const CustomDimensions: Story = {
  args: { variant: 'circle', width: '80px', height: '80px' },
};

export const CustomWidth: Story = {
  args: { variant: 'text', width: '60%' },
};

// ─── Composiciones realistas ──────────────────────────────────────────────────

export const ProfileCard: Story = {
  args: { variant: 'text' },
  render: () => (
    <div
      style={{
        width: '18rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--color-edge)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header: avatar + nombre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Skeleton variant="circle" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton width="66%" />
          <Skeleton width="33%" />
        </div>
      </div>
      {/* Imagen */}
      <Skeleton variant="rect" height="10rem" />
      {/* Descripción */}
      <Skeleton lines={3} />
    </div>
  ),
};

export const DataRows: Story = {
  args: { variant: 'text' },
  render: () => (
    <div
      style={{
        width: '30rem',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid var(--color-edge)',
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--color-edge)',
          }}
        >
          <Skeleton variant="circle" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Skeleton width="66%" />
            <Skeleton width="50%" />
          </div>
          <Skeleton width="4rem" height="1.5rem" />
        </div>
      ))}
    </div>
  ),
};

export const FormLoading: Story = {
  args: { variant: 'text' },
  render: () => (
    <div style={{ width: '24rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Campo 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <Skeleton width="6rem" />
        <Skeleton height="2.25rem" />
      </div>
      {/* Campo 2 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <Skeleton width="8rem" />
        <Skeleton height="2.25rem" />
      </div>
      {/* Campo 3 - textarea */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <Skeleton width="5rem" />
        <Skeleton height="6rem" />
      </div>
      {/* Botón */}
      <Skeleton width="7rem" height="2.25rem" />
    </div>
  ),
};
