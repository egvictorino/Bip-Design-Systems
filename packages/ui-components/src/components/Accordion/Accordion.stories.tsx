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
    variant: {
      control: 'radio',
      options: ['default', 'bordered', 'ghost'],
      description: 'Variante visual del accordion',
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
    <div style={{ width: '100%', maxWidth: '32rem' }}>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>¿Qué es Bip Design Systems?</AccordionTrigger>
          <AccordionContent>
            Bip Design Systems es una librería de componentes React diseñada para aplicaciones de pymes.
            Incluye componentes accesibles, tematizables y listos para producción, estilizados con CSS
            Modules y tokens de diseño como CSS Custom Properties.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>¿Cómo instalo la librería?</AccordionTrigger>
          <AccordionContent>
            Instala el paquete con <code>pnpm add @bip-design-systems/ui-components</code> e importa{' '}
            <code>@bip-design-systems/ui-components/style.css</code> en el entry point de tu app. No se
            requiere ninguna configuración adicional de CSS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Puedo personalizar los tokens de diseño?</AccordionTrigger>
          <AccordionContent>
            Sí. Todos los tokens de diseño se definen como CSS Custom Properties en{' '}
            <code>tokens.css</code> (bajo <code>:root</code>). Edítalos directamente o ejecuta{' '}
            <code>pnpm sync:tokens</code> para regenerarlos desde Figma. Los cambios se propagan
            automáticamente a todos los componentes.
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
    <div style={{ width: '100%', maxWidth: '32rem' }}>
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
    <div style={{ width: '100%', maxWidth: '32rem' }}>
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
    <div style={{ width: '100%', maxWidth: '32rem' }}>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>
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

// ─── Bordered ─────────────────────────────────────────────────────────────────

export const Bordered: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '100%', maxWidth: '32rem' }}>
      <Accordion type="single" collapsible variant="bordered" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>¿Qué es Bip Design Systems?</AccordionTrigger>
          <AccordionContent>
            Bip Design Systems es una librería de componentes React diseñada para aplicaciones de pymes.
            Incluye componentes accesibles, tematizables y listos para producción, estilizados con CSS
            Modules y tokens de diseño como CSS Custom Properties.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>¿Cómo instalo la librería?</AccordionTrigger>
          <AccordionContent>
            Instala el paquete con <code>pnpm add @bip-design-systems/ui-components</code> e importa{' '}
            <code>@bip-design-systems/ui-components/style.css</code> en el entry point de tu app. No se
            requiere ninguna configuración adicional de CSS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Puedo personalizar los tokens de diseño?</AccordionTrigger>
          <AccordionContent>
            Sí. Todos los tokens de diseño se definen como CSS Custom Properties en{' '}
            <code>tokens.css</code> (bajo <code>:root</code>). Edítalos directamente o ejecuta{' '}
            <code>pnpm sync:tokens</code> para regenerarlos desde Figma. Los cambios se propagan
            automáticamente a todos los componentes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── Ghost ────────────────────────────────────────────────────────────────────

export const Ghost: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '100%', maxWidth: '32rem' }}>
      <Accordion type="single" collapsible variant="ghost" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>¿Qué es Bip Design Systems?</AccordionTrigger>
          <AccordionContent>
            Bip Design Systems es una librería de componentes React diseñada para aplicaciones de pymes.
            Incluye componentes accesibles, tematizables y listos para producción, estilizados con CSS
            Modules y tokens de diseño como CSS Custom Properties.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>¿Cómo instalo la librería?</AccordionTrigger>
          <AccordionContent>
            Instala el paquete con <code>pnpm add @bip-design-systems/ui-components</code> e importa{' '}
            <code>@bip-design-systems/ui-components/style.css</code> en el entry point de tu app. No se
            requiere ninguna configuración adicional de CSS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Puedo personalizar los tokens de diseño?</AccordionTrigger>
          <AccordionContent>
            Sí. Todos los tokens de diseño se definen como CSS Custom Properties en{' '}
            <code>tokens.css</code> (bajo <code>:root</code>). Edítalos directamente o ejecuta{' '}
            <code>pnpm sync:tokens</code> para regenerarlos desde Figma. Los cambios se propagan
            automáticamente a todos los componentes.
          </AccordionContent>
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
      <div style={{ width: '100%', maxWidth: '32rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['item-1', 'item-2', 'item-3'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setOpen(v)}
              style={{
                borderRadius: '0.25rem',
                border: '1px solid var(--color-primary)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                color: 'var(--color-primary)',
                background: 'transparent',
                cursor: 'pointer',
              }}
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

