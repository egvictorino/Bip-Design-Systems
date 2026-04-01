import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    variant: { control: 'select', options: ['default', 'light', 'info', 'success', 'warning', 'error'] },
    delay: { control: 'number' },
    closeDelay: { control: 'number' },
    open: { control: 'boolean' },
    onOpenChange: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Posiciones ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    content: 'Este es un tooltip',
    position: 'top',
    children: <Button variant="secondary">Pasa el cursor aquí</Button>,
  },
};

export const Top: Story = {
  args: {
    content: 'Tooltip arriba',
    position: 'top',
    children: <Button variant="secondary">Arriba</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip abajo',
    position: 'bottom',
    children: <Button variant="secondary">Abajo</Button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip a la izquierda',
    position: 'left',
    children: <Button variant="secondary">Izquierda</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip a la derecha',
    position: 'right',
    children: <Button variant="secondary">Derecha</Button>,
  },
};

export const AllPositions: Story = {
  args: { content: 'Tooltip', position: 'top', children: <span /> },
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-16">
      <div />
      <div className="flex justify-center">
        <Tooltip content="Arriba" position="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>
      </div>
      <div />
      <div className="flex justify-center">
        <Tooltip content="Izquierda" position="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>
      </div>
      <div />
      <div className="flex justify-center">
        <Tooltip content="Derecha" position="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
      </div>
      <div />
      <div className="flex justify-center">
        <Tooltip content="Abajo" position="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>
      </div>
      <div />
    </div>
  ),
};

// ─── Alineación ───────────────────────────────────────────────────────────────

export const Alignment: Story = {
  args: { content: 'Tooltip', position: 'top', children: <span /> },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-12 p-16 items-center">
      <div className="flex gap-8">
        <Tooltip content="align=start" position="top" align="start" open={true}>
          <Button variant="secondary" size="sm">Top start</Button>
        </Tooltip>
        <Tooltip content="align=center" position="top" align="center" open={true}>
          <Button variant="secondary" size="sm">Top center</Button>
        </Tooltip>
        <Tooltip content="align=end" position="top" align="end" open={true}>
          <Button variant="secondary" size="sm">Top end</Button>
        </Tooltip>
      </div>
      <div className="flex gap-8 mt-8">
        <Tooltip content="align=start" position="bottom" align="start" open={true}>
          <Button variant="secondary" size="sm">Bottom start</Button>
        </Tooltip>
        <Tooltip content="align=center" position="bottom" align="center" open={true}>
          <Button variant="secondary" size="sm">Bottom center</Button>
        </Tooltip>
        <Tooltip content="align=end" position="bottom" align="end" open={true}>
          <Button variant="secondary" size="sm">Bottom end</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// ─── Variantes ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  args: { content: 'Tooltip', position: 'top', children: <span /> },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap gap-12 p-16 justify-center">
      {(['default', 'light', 'info', 'success', 'warning', 'error'] as const).map((v) => (
        <Tooltip key={v} content={`Variant: ${v}`} position="top" variant={v} open={true}>
          <Button variant="secondary" size="sm">{v}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

// ─── Delay ────────────────────────────────────────────────────────────────────

export const WithDelay: Story = {
  args: {
    content: 'Aparece después de 500ms',
    delay: 500,
    children: <Button variant="secondary">Hover con delay</Button>,
  },
};

export const WithCloseDelay: Story = {
  args: {
    content: 'Tarda 300ms en cerrarse',
    closeDelay: 300,
    children: <Button variant="secondary">Hover y aleja el cursor</Button>,
  },
};

// ─── Modo controlado ──────────────────────────────────────────────────────────

export const Controlled: Story = {
  args: { content: '', children: <span /> },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Tooltip
          content="Tooltip controlado externamente"
          open={open}
          onOpenChange={setOpen}
        >
          <Button variant="secondary">Trigger (hover también funciona)</Button>
        </Tooltip>
        <Button variant="primary" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Cerrar tooltip' : 'Abrir tooltip'}
        </Button>
      </div>
    );
  },
};

// ─── Casos de uso ─────────────────────────────────────────────────────────────

export const OnIcon: Story = {
  args: { content: 'Más información', position: 'top', children: <span /> },
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-txt">Monto total</span>
      <Tooltip content="Suma de todas las transacciones del período" position="top">
        <button
          type="button"
          className="rounded-full text-txt-secondary hover:text-txt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Más información sobre monto total"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    content: 'Este campo es requerido para completar el proceso de facturación',
    position: 'bottom',
    children: <Button variant="secondary">Ver explicación</Button>,
  },
};
