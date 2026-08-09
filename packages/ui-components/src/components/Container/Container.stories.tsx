import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const content: React.CSSProperties = {
  padding: '1.5rem',
  borderRadius: 'var(--radius-control)',
  backgroundColor: 'var(--color-surface-2)',
  border: '1px solid var(--color-edge)',
  color: 'var(--color-txt)',
  fontSize: '0.875rem',
};

export const Default: Story = {
  args: { maxWidth: 'lg', children: null },
  render: (args) => (
    <Container {...args}>
      <div style={content}>Contenido centrado, ancho máximo lg (1024px).</div>
    </Container>
  ),
};
