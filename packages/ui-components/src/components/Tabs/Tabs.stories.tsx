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
    variant: { control: 'select', options: ['line', 'pill', 'boxed'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    animated: { control: 'boolean' },
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
        <p className="text-sm text-txt-secondary">Configuración general de la cuenta.</p>
      </TabPanel>
      <TabPanel value="seguridad" className="pt-4">
        <p className="text-sm text-txt-secondary">Opciones de seguridad y contraseña.</p>
      </TabPanel>
      <TabPanel value="notificaciones" className="pt-4">
        <p className="text-sm text-txt-secondary">Preferencias de notificaciones.</p>
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
        <p className="text-sm text-txt-secondary">Reporte de ventas del período.</p>
      </TabPanel>
      <TabPanel value="compras" className="pt-4">
        <p className="text-sm text-txt-secondary">Reporte de compras del período.</p>
      </TabPanel>
      <TabPanel value="inventario" className="pt-4">
        <p className="text-sm text-txt-secondary">Estado actual del inventario.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Boxed: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="activos" variant="boxed" className="w-[520px]">
      <TabList>
        <Tab value="activos">Activos</Tab>
        <Tab value="inactivos">Inactivos</Tab>
        <Tab value="archivados">Archivados</Tab>
      </TabList>
      <TabPanel value="activos" className="pt-4">
        <p className="text-sm text-txt-secondary">Registros activos en el sistema.</p>
      </TabPanel>
      <TabPanel value="inactivos" className="pt-4">
        <p className="text-sm text-txt-secondary">Registros desactivados temporalmente.</p>
      </TabPanel>
      <TabPanel value="archivados" className="pt-4">
        <p className="text-sm text-txt-secondary">Registros archivados permanentemente.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-8 w-[520px]">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-txt-secondary font-medium">Small</p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" className="pt-3">
            <p className="text-sm text-txt-secondary">Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" className="pt-3">
            <p className="text-sm text-txt-secondary">Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" className="pt-3">
            <p className="text-sm text-txt-secondary">Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-txt-secondary font-medium">Medium (default)</p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" className="pt-3">
            <p className="text-sm text-txt-secondary">Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" className="pt-3">
            <p className="text-sm text-txt-secondary">Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" className="pt-3">
            <p className="text-sm text-txt-secondary">Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-txt-secondary font-medium">Large</p>
        <Tabs defaultValue="tab1" size="lg">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" className="pt-3">
            <p className="text-sm text-txt-secondary">Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" className="pt-3">
            <p className="text-sm text-txt-secondary">Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" className="pt-3">
            <p className="text-sm text-txt-secondary">Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="info" orientation="vertical" className="w-[600px]">
      <TabList>
        <Tab value="info">Información</Tab>
        <Tab value="historial">Historial</Tab>
        <Tab value="documentos">Documentos</Tab>
        <Tab value="pagos">Pagos</Tab>
      </TabList>
      <TabPanel value="info" className="p-4">
        <p className="text-sm text-txt-secondary">Datos generales del cliente y su cuenta.</p>
      </TabPanel>
      <TabPanel value="historial" className="p-4">
        <p className="text-sm text-txt-secondary">Historial completo de transacciones.</p>
      </TabPanel>
      <TabPanel value="documentos" className="p-4">
        <p className="text-sm text-txt-secondary">Documentos adjuntos al expediente.</p>
      </TabPanel>
      <TabPanel value="pagos" className="p-4">
        <p className="text-sm text-txt-secondary">Métodos de pago y facturación.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const VerticalPill: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="ventas" orientation="vertical" variant="pill" className="w-[600px]">
      <TabList>
        <Tab value="ventas">Ventas</Tab>
        <Tab value="compras">Compras</Tab>
        <Tab value="inventario">Inventario</Tab>
      </TabList>
      <TabPanel value="ventas" className="p-4">
        <p className="text-sm text-txt-secondary">Reporte de ventas del período.</p>
      </TabPanel>
      <TabPanel value="compras" className="p-4">
        <p className="text-sm text-txt-secondary">Reporte de compras del período.</p>
      </TabPanel>
      <TabPanel value="inventario" className="p-4">
        <p className="text-sm text-txt-secondary">Estado actual del inventario.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const AnimatedIndicator: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="general" animated className="w-[520px]">
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="seguridad">Seguridad</Tab>
        <Tab value="notificaciones">Notificaciones</Tab>
        <Tab value="facturacion">Facturación</Tab>
      </TabList>
      <TabPanel value="general" className="pt-4">
        <p className="text-sm text-txt-secondary">Configuración general de la cuenta.</p>
      </TabPanel>
      <TabPanel value="seguridad" className="pt-4">
        <p className="text-sm text-txt-secondary">Opciones de seguridad y contraseña.</p>
      </TabPanel>
      <TabPanel value="notificaciones" className="pt-4">
        <p className="text-sm text-txt-secondary">Preferencias de notificaciones.</p>
      </TabPanel>
      <TabPanel value="facturacion" className="pt-4">
        <p className="text-sm text-txt-secondary">Datos de facturación y métodos de pago.</p>
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
        <p className="text-sm text-txt-secondary">Contratos activos.</p>
      </TabPanel>
      <TabPanel value="pendientes" className="pt-4">
        <p className="text-sm text-txt-secondary">Contratos pendientes de aprobación.</p>
      </TabPanel>
      <TabPanel value="archivados" className="pt-4">
        <p className="text-sm text-txt-secondary">Contratos archivados.</p>
      </TabPanel>
    </Tabs>
  ),
};

const ControlledTabsStory = () => {
  const [activeTab, setActiveTab] = useState('info');
  return (
    <div className="flex flex-col gap-3 w-[520px]">
      <p className="text-xs text-txt-secondary">
        Pestaña activa:{' '}
        <span className="font-medium text-txt">{activeTab}</span>
      </p>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="info">Información</Tab>
          <Tab value="historial">Historial</Tab>
          <Tab value="documentos">Documentos</Tab>
        </TabList>
        <TabPanel value="info" className="pt-4">
          <p className="text-sm text-txt-secondary">Datos generales del cliente.</p>
        </TabPanel>
        <TabPanel value="historial" className="pt-4">
          <p className="text-sm text-txt-secondary">Historial de transacciones.</p>
        </TabPanel>
        <TabPanel value="documentos" className="pt-4">
          <p className="text-sm text-txt-secondary">Documentos adjuntos.</p>
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
        <p className="text-sm text-txt-secondary">Tickets abiertos en espera de atención.</p>
      </TabPanel>
      <TabPanel value="cerrados" className="pt-4">
        <p className="text-sm text-txt-secondary">Tickets resueltos y cerrados.</p>
      </TabPanel>
      <TabPanel value="cancelados" className="pt-4">
        <p className="text-sm text-txt-secondary">Tickets cancelados por el usuario.</p>
      </TabPanel>
    </Tabs>
  ),
};
