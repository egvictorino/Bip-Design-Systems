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

const panelText: React.CSSProperties = { fontSize: '0.875rem', color: 'var(--color-txt-secondary)' };
const panelTopPad = { paddingTop: '1rem' };
const panelTopPadSm = { paddingTop: '0.75rem' };
const panelPad = { padding: '1rem' };

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="general" style={{ width: '520px' }}>
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="seguridad">Seguridad</Tab>
        <Tab value="notificaciones">Notificaciones</Tab>
      </TabList>
      <TabPanel value="general" style={panelTopPad}>
        <p style={panelText}>Configuración general de la cuenta.</p>
      </TabPanel>
      <TabPanel value="seguridad" style={panelTopPad}>
        <p style={panelText}>Opciones de seguridad y contraseña.</p>
      </TabPanel>
      <TabPanel value="notificaciones" style={panelTopPad}>
        <p style={panelText}>Preferencias de notificaciones.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Pill: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="ventas" variant="pill" style={{ width: '520px' }}>
      <TabList>
        <Tab value="ventas">Ventas</Tab>
        <Tab value="compras">Compras</Tab>
        <Tab value="inventario">Inventario</Tab>
      </TabList>
      <TabPanel value="ventas" style={panelTopPad}>
        <p style={panelText}>Reporte de ventas del período.</p>
      </TabPanel>
      <TabPanel value="compras" style={panelTopPad}>
        <p style={panelText}>Reporte de compras del período.</p>
      </TabPanel>
      <TabPanel value="inventario" style={panelTopPad}>
        <p style={panelText}>Estado actual del inventario.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Boxed: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="activos" variant="boxed" style={{ width: '520px' }}>
      <TabList>
        <Tab value="activos">Activos</Tab>
        <Tab value="inactivos">Inactivos</Tab>
        <Tab value="archivados">Archivados</Tab>
      </TabList>
      <TabPanel value="activos" style={panelTopPad}>
        <p style={panelText}>Registros activos en el sistema.</p>
      </TabPanel>
      <TabPanel value="inactivos" style={panelTopPad}>
        <p style={panelText}>Registros desactivados temporalmente.</p>
      </TabPanel>
      <TabPanel value="archivados" style={panelTopPad}>
        <p style={panelText}>Registros archivados permanentemente.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '520px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', fontWeight: 500 }}>Small</p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" style={panelTopPadSm}>
            <p style={panelText}>Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" style={panelTopPadSm}>
            <p style={panelText}>Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" style={panelTopPadSm}>
            <p style={panelText}>Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', fontWeight: 500 }}>
          Medium (default)
        </p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" style={panelTopPadSm}>
            <p style={panelText}>Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" style={panelTopPadSm}>
            <p style={panelText}>Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" style={panelTopPadSm}>
            <p style={panelText}>Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', fontWeight: 500 }}>Large</p>
        <Tabs defaultValue="tab1" size="lg">
          <TabList>
            <Tab value="tab1">General</Tab>
            <Tab value="tab2">Seguridad</Tab>
            <Tab value="tab3">Notificaciones</Tab>
          </TabList>
          <TabPanel value="tab1" style={panelTopPadSm}>
            <p style={panelText}>Configuración general.</p>
          </TabPanel>
          <TabPanel value="tab2" style={panelTopPadSm}>
            <p style={panelText}>Opciones de seguridad.</p>
          </TabPanel>
          <TabPanel value="tab3" style={panelTopPadSm}>
            <p style={panelText}>Preferencias de notificaciones.</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="info" orientation="vertical" style={{ width: '600px' }}>
      <TabList>
        <Tab value="info">Información</Tab>
        <Tab value="historial">Historial</Tab>
        <Tab value="documentos">Documentos</Tab>
        <Tab value="pagos">Pagos</Tab>
      </TabList>
      <TabPanel value="info" style={panelPad}>
        <p style={panelText}>Datos generales del cliente y su cuenta.</p>
      </TabPanel>
      <TabPanel value="historial" style={panelPad}>
        <p style={panelText}>Historial completo de transacciones.</p>
      </TabPanel>
      <TabPanel value="documentos" style={panelPad}>
        <p style={panelText}>Documentos adjuntos al expediente.</p>
      </TabPanel>
      <TabPanel value="pagos" style={panelPad}>
        <p style={panelText}>Métodos de pago y facturación.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const VerticalPill: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="ventas" orientation="vertical" variant="pill" style={{ width: '600px' }}>
      <TabList>
        <Tab value="ventas">Ventas</Tab>
        <Tab value="compras">Compras</Tab>
        <Tab value="inventario">Inventario</Tab>
      </TabList>
      <TabPanel value="ventas" style={panelPad}>
        <p style={panelText}>Reporte de ventas del período.</p>
      </TabPanel>
      <TabPanel value="compras" style={panelPad}>
        <p style={panelText}>Reporte de compras del período.</p>
      </TabPanel>
      <TabPanel value="inventario" style={panelPad}>
        <p style={panelText}>Estado actual del inventario.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const AnimatedIndicator: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="general" animated style={{ width: '520px' }}>
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="seguridad">Seguridad</Tab>
        <Tab value="notificaciones">Notificaciones</Tab>
        <Tab value="facturacion">Facturación</Tab>
      </TabList>
      <TabPanel value="general" style={panelTopPad}>
        <p style={panelText}>Configuración general de la cuenta.</p>
      </TabPanel>
      <TabPanel value="seguridad" style={panelTopPad}>
        <p style={panelText}>Opciones de seguridad y contraseña.</p>
      </TabPanel>
      <TabPanel value="notificaciones" style={panelTopPad}>
        <p style={panelText}>Preferencias de notificaciones.</p>
      </TabPanel>
      <TabPanel value="facturacion" style={panelTopPad}>
        <p style={panelText}>Datos de facturación y métodos de pago.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="activos" style={{ width: '520px' }}>
      <TabList>
        <Tab value="activos">Activos</Tab>
        <Tab value="pendientes">Pendientes</Tab>
        <Tab value="archivados" disabled>
          Archivados
        </Tab>
      </TabList>
      <TabPanel value="activos" style={panelTopPad}>
        <p style={panelText}>Contratos activos.</p>
      </TabPanel>
      <TabPanel value="pendientes" style={panelTopPad}>
        <p style={panelText}>Contratos pendientes de aprobación.</p>
      </TabPanel>
      <TabPanel value="archivados" style={panelTopPad}>
        <p style={panelText}>Contratos archivados.</p>
      </TabPanel>
    </Tabs>
  ),
};

const ControlledTabsStory = () => {
  const [activeTab, setActiveTab] = useState('info');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '520px' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
        Pestaña activa: <span style={{ fontWeight: 500, color: 'var(--color-txt)' }}>{activeTab}</span>
      </p>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="info">Información</Tab>
          <Tab value="historial">Historial</Tab>
          <Tab value="documentos">Documentos</Tab>
        </TabList>
        <TabPanel value="info" style={panelTopPad}>
          <p style={panelText}>Datos generales del cliente.</p>
        </TabPanel>
        <TabPanel value="historial" style={panelTopPad}>
          <p style={panelText}>Historial de transacciones.</p>
        </TabPanel>
        <TabPanel value="documentos" style={panelTopPad}>
          <p style={panelText}>Documentos adjuntos.</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledTabsStory />,
};

const tabBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
};

export const WithBadge: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="abiertos" style={{ width: '520px' }}>
      <TabList>
        <Tab value="abiertos">
          <span style={tabBadgeStyle}>
            Abiertos
            <Badge variant="primary" size="sm">12</Badge>
          </span>
        </Tab>
        <Tab value="cerrados">
          <span style={tabBadgeStyle}>
            Cerrados
            <Badge variant="neutral" size="sm">48</Badge>
          </span>
        </Tab>
        <Tab value="cancelados">
          <span style={tabBadgeStyle}>
            Cancelados
            <Badge variant="error" size="sm">3</Badge>
          </span>
        </Tab>
      </TabList>
      <TabPanel value="abiertos" style={panelTopPad}>
        <p style={panelText}>Tickets abiertos en espera de atención.</p>
      </TabPanel>
      <TabPanel value="cerrados" style={panelTopPad}>
        <p style={panelText}>Tickets resueltos y cerrados.</p>
      </TabPanel>
      <TabPanel value="cancelados" style={panelTopPad}>
        <p style={panelText}>Tickets cancelados por el usuario.</p>
      </TabPanel>
    </Tabs>
  ),
};
