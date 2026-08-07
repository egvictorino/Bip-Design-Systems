import { readdirSync } from 'fs';
import { resolve } from 'path';
import type { ReactElement } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion';
import { Alert } from './components/Alert';
import { Avatar } from './components/Avatar';
import { Badge } from './components/Badge';
import { Breadcrumb } from './components/Breadcrumb';
import { Button } from './components/Button';
import { Calendar } from './components/Calendar';
import { Card, CardBody } from './components/Card';
import { Checkbox } from './components/Checkbox';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DataTable } from './components/DataTable';
import { DatePicker } from './components/DatePicker';
import { DateRangePicker } from './components/DateRangePicker';
import { Divider } from './components/Divider';
import { DrawerPanel } from './components/DrawerPanel';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from './components/Dropdown';
import { EmptyState } from './components/EmptyState';
import { FileUpload } from './components/FileUpload';
import { Input } from './components/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './components/Modal';
import { MultiSelect } from './components/MultiSelect';
import { Navbar, NavbarBrand, NavbarNav, NavbarItem } from './components/Navbar';
import { NumberInput } from './components/NumberInput';
import { Odontogram } from './components/Odontogram';
import { Pagination } from './components/Pagination';
import { ProgressBar } from './components/ProgressBar';
import { Radio } from './components/Radio';
import { SearchInput } from './components/SearchInput';
import { Select } from './components/Select';
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
} from './components/Sidebar';
import { Skeleton } from './components/Skeleton';
import { Spinner } from './components/Spinner';
import { StatsCard } from './components/StatsCard';
import { Stepper, StepperStep } from './components/Stepper';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './components/Table';
import { Tabs, TabList, Tab, TabPanel } from './components/Tabs';
import { Textarea } from './components/Textarea';
import { TimePicker } from './components/TimePicker';
import { Timeline, TimelineItem } from './components/Timeline';
import { ToastProvider, useToast, type ToastConfig } from './components/Toast';
import { Toggle } from './components/Toggle';
import { Tooltip } from './components/Tooltip';

const noop = () => {};

/**
 * axe's color-contrast rule can't be trusted under happy-dom — getComputedStyle doesn't
 * resolve CSS custom properties/color-mix() with real-browser fidelity. This suite verifies
 * markup/ARIA correctness; rendered contrast is covered elsewhere, in a real browser:
 * - src/styles/contrast-tokens.test.ts — WCAG AA on the literal hex values in tokens.css
 *   (the fill seeds and their --color-txt-on-*), via the same contrastRatio() this rule
 *   would otherwise duplicate.
 * - visual/a11y-browser.spec.ts — axe with color-contrast ENABLED, in actual Chromium via
 *   @axe-core/playwright, against every component in both color schemes. That's the one
 *   that found the real, previously-undetected violations that motivated this split:
 *   --color-txt-secondary (light) never cleared AA against any surface in the system,
 *   --color-primary/--color-active used directly as text (not fill) failed in dark mode,
 *   --color-success-text/--color-warning-text were marginal, and a few components used
 *   --color-txt-disabled on text that was never actually in a disabled state.
 */
const AXE_OPTIONS = { rules: { 'color-contrast': { enabled: false } } };

const ToastTrigger = ({ config }: { config: ToastConfig }) => {
  const { addToast } = useToast();
  return (
    <button type="button" onClick={() => addToast(config)}>
      Show toast
    </button>
  );
};

/**
 * One entry per component directory under src/components. Each render fn returns the
 * canonical markup axe should scan; render() targets a JSDOM/happy-dom container, but for
 * components that createPortal into document.body (Modal, ConfirmDialog, DrawerPanel, Toast)
 * the test below scans `baseElement` instead of `container`.
 */
const REGISTRY: Record<string, () => ReactElement> = {
  Accordion: () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Sección expandida</AccordionTrigger>
        <AccordionContent>Contenido visible por defecto.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Sección colapsada</AccordionTrigger>
        <AccordionContent>Contenido oculto.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  Alert: () => <Alert variant="info">Este es un mensaje informativo.</Alert>,
  Avatar: () => <Avatar name="Juan García" size="md" />,
  Badge: () => <Badge variant="primary">Activo</Badge>,
  Breadcrumb: () => (
    <Breadcrumb
      items={[{ label: 'Inicio', href: '#' }, { label: 'Pacientes', href: '#' }, { label: 'Detalle' }]}
    />
  ),
  Button: () => <Button variant="primary">Guardar</Button>,
  Calendar: () => (
    <div style={{ height: 700 }}>
      <Calendar events={[]} resources={[]} view="month" date={new Date('2026-08-06')} />
    </div>
  ),
  Card: () => (
    <Card variant="elevated">
      <CardBody>Contenido de la tarjeta.</CardBody>
    </Card>
  ),
  Checkbox: () => <Checkbox label="Acepto los términos y condiciones" />,
  ConfirmDialog: () => (
    <ConfirmDialog
      isOpen
      onClose={noop}
      onConfirm={noop}
      title="Confirmar acción"
      description="¿Estás seguro de continuar?"
      variant="info"
    />
  ),
  DataTable: () => (
    <DataTable
      columns={[
        { key: 'name', header: 'Nombre' },
        { key: 'status', header: 'Estado' },
      ]}
      data={[{ name: 'María López', status: 'Activo' }]}
      keyExtractor={(row) => String(row.name)}
    />
  ),
  DatePicker: () => <DatePicker label="Fecha de cita" placeholder="DD/MM/AAAA" />,
  DateRangePicker: () => <DateRangePicker label="Periodo de reporte" />,
  Divider: () => <Divider orientation="horizontal" variant="solid" />,
  DrawerPanel: () => (
    <DrawerPanel open onClose={noop} title="Detalle del paciente">
      Contenido del panel.
    </DrawerPanel>
  ),
  Dropdown: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary">Acciones</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Ver detalle</DropdownItem>
        <DropdownItem>Eliminar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
  EmptyState: () => <EmptyState title="No hay resultados" description="Ajusta los filtros e intenta de nuevo." />,
  FileUpload: () => <FileUpload />,
  Input: () => <Input variant="outlined" label="Correo" type="email" placeholder="correo@ejemplo.com" />,
  Modal: () => (
    <Modal isOpen onClose={noop} size="md">
      <ModalHeader>Título del modal</ModalHeader>
      <ModalBody>Contenido del modal.</ModalBody>
      <ModalFooter>
        <Button variant="primary">Aceptar</Button>
      </ModalFooter>
    </Modal>
  ),
  MultiSelect: () => (
    <MultiSelect
      label="Frutas"
      placeholder="Seleccionar frutas..."
      options={[
        { value: 'manzana', label: 'Manzana' },
        { value: 'pera', label: 'Pera' },
      ]}
    />
  ),
  Navbar: () => (
    <Navbar aria-label="Navegación principal">
      <NavbarBrand>BipUI</NavbarBrand>
      <NavbarNav>
        <NavbarItem href="#" active>
          Inicio
        </NavbarItem>
        <NavbarItem href="#">Pacientes</NavbarItem>
      </NavbarNav>
    </Navbar>
  ),
  NumberInput: () => <NumberInput label="Cantidad" placeholder="0" />,
  Odontogram: () => <Odontogram />,
  Pagination: () => <Pagination currentPage={5} totalPages={10} onPageChange={noop} />,
  ProgressBar: () => <ProgressBar value={65} />,
  Radio: () => <Radio label="Opción A" name="a11y-radio-demo" />,
  SearchInput: () => <SearchInput placeholder="Buscar paciente..." variant="outlined" size="md" />,
  Select: () => (
    <Select
      variant="outlined"
      label="Estado"
      placeholder="Selecciona un estado"
      options={[
        { value: 'cdmx', label: 'Ciudad de México' },
        { value: 'jal', label: 'Jalisco' },
      ]}
    />
  ),
  Sidebar: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" active>
              Dashboard
            </SidebarItem>
            <SidebarItem href="#">Pacientes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>v1.0</SidebarFooter>
      </Sidebar>
    </div>
  ),
  Skeleton: () => <Skeleton variant="text" />,
  Spinner: () => <Spinner size="md" variant="primary" />,
  StatsCard: () => <StatsCard title="Citas hoy" value={12} trend={8} description="vs. ayer" />,
  Stepper: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={noop}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Confirmación" />
        <StepperStep value={2} label="Pago" />
      </Stepper>
    </div>
  ),
  Table: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Estado</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>María López</TableCell>
          <TableCell>Activo</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  Tabs: () => (
    <Tabs defaultValue="general" style={{ width: 520 }}>
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="historial">Historial</Tab>
      </TabList>
      <TabPanel value="general">Contenido general.</TabPanel>
      <TabPanel value="historial">Contenido de historial.</TabPanel>
    </Tabs>
  ),
  Textarea: () => <Textarea variant="outlined" label="Descripción" placeholder="Escribe aquí..." rows={4} />,
  TimePicker: () => <TimePicker placeholder="HH:MM" />,
  Timeline: () => (
    <div style={{ width: 400 }}>
      <Timeline>
        <TimelineItem date="2026-08-06" title="Cita registrada" description="Consulta general" />
      </Timeline>
    </div>
  ),
  Toggle: () => <Toggle label="Activar notificaciones" />,
  Tooltip: () => (
    <Tooltip content="Este es un tooltip" position="top" open>
      <Button variant="secondary">Pasa el cursor aquí</Button>
    </Tooltip>
  ),
};

/**
 * ThemeProvider is a context-only wrapper with no UI of its own to scan — every other
 * component dir under src/components must have a REGISTRY (or PORTAL_REGISTRY) entry.
 */
const SKIP_LIST = new Set(['ThemeProvider']);

describe('accesibilidad automática (axe) por componente', () => {
  Object.entries(REGISTRY).forEach(([name, renderComponent]) => {
    it(`${name} no tiene violaciones de a11y`, async () => {
      const { container } = render(renderComponent());
      const results = await axe(container, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });
  });

  it('DropdownMenu abierto no tiene violaciones de a11y', async () => {
    const { container } = render(
      <Dropdown>
        <DropdownTrigger>
          <Button variant="secondary">Acciones</Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Ver detalle</DropdownItem>
          <DropdownItem>Eliminar</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Acciones' }));
    const results = await axe(container, AXE_OPTIONS);
    expect(results).toHaveNoViolations();
  });

  describe('componentes portalizados (document.body)', () => {
    it('Modal no tiene violaciones de a11y', async () => {
      const { baseElement } = render(REGISTRY.Modal());
      const results = await axe(baseElement, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });

    it('ConfirmDialog no tiene violaciones de a11y', async () => {
      const { baseElement } = render(REGISTRY.ConfirmDialog());
      const results = await axe(baseElement, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });

    it('DrawerPanel no tiene violaciones de a11y', async () => {
      const { baseElement } = render(REGISTRY.DrawerPanel());
      const results = await axe(baseElement, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });

    it('Toast no tiene violaciones de a11y', async () => {
      const { baseElement } = render(
        <ToastProvider>
          <ToastTrigger config={{ variant: 'success', title: 'Guardado', message: 'Los cambios se guardaron.' }} />
        </ToastProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));
      const results = await axe(baseElement, AXE_OPTIONS);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('cobertura del registro de a11y', () => {
  it('todo componente en src/components tiene una entrada en REGISTRY, en la suite de portales, o en SKIP_LIST', () => {
    const componentsDir = resolve(__dirname, 'components');
    const dirs = readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const PORTAL_TESTED = new Set(['Modal', 'ConfirmDialog', 'DrawerPanel', 'Toast']);
    const covered = new Set([...Object.keys(REGISTRY), ...PORTAL_TESTED, ...SKIP_LIST]);

    const missing = dirs.filter((dir) => !covered.has(dir));

    expect(missing, `Componentes sin cobertura de a11y: ${missing.join(', ')}`).toEqual([]);
  });
});
