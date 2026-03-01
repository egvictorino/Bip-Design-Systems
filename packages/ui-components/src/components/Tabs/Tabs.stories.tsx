import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { Badge } from '../Badge';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['line', 'pill'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="general" className="w-[520px]">
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="seguridad">Seguridad</Tab>
        <Tab value="notificaciones">Notificaciones</Tab>
      </TabList>
      <TabPanel value="general" className="pt-4">
        <p className="text-sm text-text-secondary">Configuración general de la cuenta.</p>
      </TabPanel>
      <TabPanel value="seguridad" className="pt-4">
        <p className="text-sm text-text-secondary">Opciones de seguridad y contraseña.</p>
      </TabPanel>
      <TabPanel value="notificaciones" className="pt-4">
        <p className="text-sm text-text-secondary">Preferencias de notificaciones.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Pill: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="ventas" variant="pill" className="w-[520px]">
      <TabList>
        <Tab value="ventas">Ventas</Tab>
        <Tab value="compras">Compras</Tab>
        <Tab value="inventario">Inventario</Tab>
      </TabList>
      <TabPanel value="ventas" className="pt-4">
        <p className="text-sm text-text-secondary">Reporte de ventas del período.</p>
      </TabPanel>
      <TabPanel value="compras" className="pt-4">
        <p className="text-sm text-text-secondary">Reporte de compras del período.</p>
      </TabPanel>
      <TabPanel value="inventario" className="pt-4">
        <p className="text-sm text-text-secondary">Estado actual del inventario.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="activos" className="w-[520px]">
      <TabList>
        <Tab value="activos">Activos</Tab>
        <Tab value="pendientes">Pendientes</Tab>
        <Tab value="archivados" disabled>
          Archivados
        </Tab>
      </TabList>
      <TabPanel value="activos" className="pt-4">
        <p className="text-sm text-text-secondary">Contratos activos.</p>
      </TabPanel>
      <TabPanel value="pendientes" className="pt-4">
        <p className="text-sm text-text-secondary">Contratos pendientes de aprobación.</p>
      </TabPanel>
      <TabPanel value="archivados" className="pt-4">
        <p className="text-sm text-text-secondary">Contratos archivados.</p>
      </TabPanel>
    </Tabs>
  ),
};

const ControlledTabsStory = () => {
  const [activeTab, setActiveTab] = useState('info');
  return (
    <div className="flex flex-col gap-3 w-[520px]">
      <p className="text-xs text-text-secondary">
        Pestaña activa:{' '}
        <span className="font-medium text-text-primary">{activeTab}</span>
      </p>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="info">Información</Tab>
          <Tab value="historial">Historial</Tab>
          <Tab value="documentos">Documentos</Tab>
        </TabList>
        <TabPanel value="info" className="pt-4">
          <p className="text-sm text-text-secondary">Datos generales del cliente.</p>
        </TabPanel>
        <TabPanel value="historial" className="pt-4">
          <p className="text-sm text-text-secondary">Historial de transacciones.</p>
        </TabPanel>
        <TabPanel value="documentos" className="pt-4">
          <p className="text-sm text-text-secondary">Documentos adjuntos.</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledTabsStory />,
};

export const WithBadge: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="abiertos" className="w-[520px]">
      <TabList>
        <Tab value="abiertos">
          <span className="inline-flex items-center gap-1.5">
            Abiertos
            <Badge variant="primary" size="sm">
              12
            </Badge>
          </span>
        </Tab>
        <Tab value="cerrados">
          <span className="inline-flex items-center gap-1.5">
            Cerrados
            <Badge variant="neutral" size="sm">
              48
            </Badge>
          </span>
        </Tab>
        <Tab value="cancelados">
          <span className="inline-flex items-center gap-1.5">
            Cancelados
            <Badge variant="error" size="sm">
              3
            </Badge>
          </span>
        </Tab>
      </TabList>
      <TabPanel value="abiertos" className="pt-4">
        <p className="text-sm text-text-secondary">Tickets abiertos en espera de atención.</p>
      </TabPanel>
      <TabPanel value="cerrados" className="pt-4">
        <p className="text-sm text-text-secondary">Tickets resueltos y cerrados.</p>
      </TabPanel>
      <TabPanel value="cancelados" className="pt-4">
        <p className="text-sm text-text-secondary">Tickets cancelados por el usuario.</p>
      </TabPanel>
    </Tabs>
  ),
};
