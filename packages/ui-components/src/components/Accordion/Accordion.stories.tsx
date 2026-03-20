import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Modo de apertura de items',
    },
    collapsible: {
      control: 'boolean',
      description: 'Permite cerrar el item activo (solo aplica en type="single")',
    },
  },
  args: { children: null },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div className="w-full max-w-lg">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>¿Qué es BipUI?</AccordionTrigger>
          <AccordionContent>
            BipUI es una librería de componentes React diseñada para aplicaciones SaaS de alto
            rendimiento. Incluye componentes accesibles, tematizables y listos para producción.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>¿Cómo instalo la librería?</AccordionTrigger>
          <AccordionContent>
            Instala el paquete con <code>pnpm add @bip/ui-components</code> y configura el preset
            de Tailwind en tu proyecto consumidor.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Puedo personalizar los tokens de diseño?</AccordionTrigger>
          <AccordionContent>
            Sí. Todos los colores y espaciados se definen en <code>tailwind.tokens.js</code>. Edita
            ese archivo y los cambios se propagan automáticamente a todos los componentes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── Multiple ─────────────────────────────────────────────────────────────────

export const Multiple: Story = {
  args: { children: null },
  render: () => (
    <div className="w-full max-w-lg">
      <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Sección 1 — abierta por defecto</AccordionTrigger>
          <AccordionContent>
            En modo múltiple, varios items pueden estar abiertos al mismo tiempo de forma
            independiente.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Sección 2 — abierta por defecto</AccordionTrigger>
          <AccordionContent>
            Cada item gestiona su propio estado de apertura sin afectar a los demás.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Sección 3 — cerrada por defecto</AccordionTrigger>
          <AccordionContent>
            Este item empieza cerrado. Puedes abrirlo sin que los anteriores se cierren.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── WithDisabledItem ─────────────────────────────────────────────────────────

export const WithDisabledItem: Story = {
  args: { children: null },
  render: () => (
    <div className="w-full max-w-lg">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Sección disponible</AccordionTrigger>
          <AccordionContent>
            Esta sección está disponible y puede abrirse normalmente.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Sección bloqueada (requiere plan Pro)</AccordionTrigger>
          <AccordionContent>Este contenido no es accesible.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Otra sección disponible</AccordionTrigger>
          <AccordionContent>Contenido accesible normalmente.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── Collapsible vs NonCollapsible ────────────────────────────────────────────

export const NonCollapsible: Story = {
  args: { children: null },
  render: () => (
    <div className="w-full max-w-lg">
      <p className="mb-3 text-sm text-text-secondary">
        <code>collapsible=false</code>: siempre hay al menos un item abierto.
      </p>
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Siempre visible</AccordionTrigger>
          <AccordionContent>
            Al hacer clic en un item ya abierto con <code>collapsible=false</code>, el item
            permanece abierto.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Sección 2</AccordionTrigger>
          <AccordionContent>Abrir esta sección cierra la anterior.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  args: { children: null },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState<string>('item-1');

    return (
      <div className="w-full max-w-lg space-y-4">
        <div className="flex gap-2">
          {['item-1', 'item-2', 'item-3'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setOpen(v)}
              className="rounded border border-interaction-primary-default px-3 py-1 text-xs text-interaction-primary-default"
            >
              Abrir {v}
            </button>
          ))}
        </div>
        <Accordion type="single" value={open} onChange={(v) => setOpen(v as string)}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Controlado externamente desde los botones superiores.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>El estado vive en el componente padre.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Útil para sincronizar el accordion con routing o URL params.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

