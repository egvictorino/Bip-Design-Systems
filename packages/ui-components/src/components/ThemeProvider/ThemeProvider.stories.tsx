import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useThemeControls } from './ThemeProvider';
import { Button } from '../Button';
import { Card, CardHeader, CardBody } from '../Card';
import { Badge } from '../Badge';
import { Avatar } from '../Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { Alert } from '../Alert';
import { Input } from '../Input';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs';

const meta = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {
  args: { children: null, theme: 'square' },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <ThemeProvider theme="square">
        <Card>
          <CardHeader>Square</CardHeader>
          <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Avatar name="Ana López" />
            <Button>Botón</Button>
            <Badge variant="success">Activo</Badge>
          </CardBody>
        </Card>
      </ThemeProvider>
      <ThemeProvider theme="rounded">
        <Card>
          <CardHeader>Rounded</CardHeader>
          <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Avatar name="Ana López" />
            <Button>Botón</Button>
            <Badge variant="success">Activo</Badge>
          </CardBody>
        </Card>
      </ThemeProvider>
    </div>
  ),
};

const PortalThemingDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ThemeProvider theme="rounded">
      <Button onClick={() => setIsOpen(true)}>Abrir modal (rounded)</Button>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>Modal en tema rounded</ModalHeader>
        <ModalBody>
          El Modal usa createPortal hacia document.body; este contenido debe
          verse redondeado igual que el resto del árbol, confirmando que el
          portal hereda el tema activo.
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </ThemeProvider>
  );
};

export const PortalTheming: Story = {
  args: { children: null, theme: 'rounded' },
  render: () => <PortalThemingDemo />,
};

const ColorSchemeCard = ({
  theme,
  colorScheme,
}: {
  theme: 'square' | 'rounded';
  colorScheme: 'light' | 'dark';
}) => (
  <ThemeProvider theme={theme} colorScheme={colorScheme}>
    <div style={{ background: 'var(--color-surface-2)', padding: '1rem' }}>
      <Card>
        <CardHeader>
          {theme} · {colorScheme}
        </CardHeader>
        <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Avatar name="Ana López" />
          <Button>Botón</Button>
          <Badge variant="success">Activo</Badge>
        </CardBody>
      </Card>
    </div>
  </ThemeProvider>
);

export const ColorSchemes: Story = {
  args: { children: null, theme: 'square' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <ColorSchemeCard theme="square" colorScheme="light" />
      <ColorSchemeCard theme="square" colorScheme="dark" />
      <ColorSchemeCard theme="rounded" colorScheme="light" />
      <ColorSchemeCard theme="rounded" colorScheme="dark" />
    </div>
  ),
};

/**
 * Estilo `ConfigProvider` de Ant Design: la app consumidora pasa un color de
 * marca vía `tokens` y toda la librería se recolorea — hover/press/focus/
 * text/light/subtle se derivan automáticamente (ver tokens.css § semilla vs
 * derivado). Combina con el toolbar de `colorScheme` para ver el refinamiento
 * por esquema aplicado en el bloque dark.
 */
const CustomBrandDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [colorPrimary, setColorPrimary] = useState('#e2007a');
  const [colorDanger, setColorDanger] = useState('#d6336c');

  return (
    <ThemeProvider theme="rounded" tokens={{ colorPrimary, colorDanger }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'var(--color-surface-2)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            colorPrimary
            <input
              type="color"
              value={colorPrimary}
              onChange={(e) => setColorPrimary(e.target.value)}
            />
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            colorDanger
            <input
              type="color"
              value={colorDanger}
              onChange={(e) => setColorDanger(e.target.value)}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="danger">Peligro</Button>
          <Badge variant="success">Activo</Badge>
          <Avatar name="Ana López" />
        </div>

        <Input label="Nombre" placeholder="Ej. Ana López" />

        <Alert variant="danger">Este es un mensaje de error con la marca personalizada.</Alert>

        <Tabs defaultValue="uno" style={{ width: '420px' }}>
          <TabList>
            <Tab value="uno">Pestaña uno</Tab>
            <Tab value="dos">Pestaña dos</Tab>
          </TabList>
          <TabPanel value="uno">Contenido de la pestaña activa.</TabPanel>
          <TabPanel value="dos">Otro contenido.</TabPanel>
        </Tabs>

        <div>
          <Button onClick={() => setIsOpen(true)}>Abrir modal (marca custom)</Button>
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalHeader>Modal con marca personalizada</ModalHeader>
            <ModalBody>
              El Modal se porta hacia document.body pero recibe las vars de
              marca resueltas vía useThemeAttributes(), así que el botón
              primario abajo usa el mismo color-primary custom.
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => setIsOpen(false)}>Confirmar</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </ThemeProvider>
  );
};

export const CustomBrand: Story = {
  args: { children: null, theme: 'rounded' },
  render: () => <CustomBrandDemo />,
};

/**
 * Modo no-controlado: sin `theme`/`colorScheme` en props, ThemeProvider
 * maneja su propio estado (defaultTheme/defaultColorScheme) y expone
 * setTheme/setColorScheme/toggleColorScheme vía useThemeControls() — así se
 * construye un botón de toggle sin levantar estado en la app consumidora.
 * `storageKey` persiste la preferencia en localStorage entre recargas
 * (recarga esta story para comprobarlo).
 */
const ToggleDemo = () => {
  const { theme, colorScheme, resolvedColorScheme, setTheme, toggleColorScheme } =
    useThemeControls();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button onClick={toggleColorScheme}>
          {resolvedColorScheme === 'dark' ? '🌙 Dark' : '☀️ Light'} (preferencia: {colorScheme})
        </Button>
        <Button
          variant="secondary"
          onClick={() => setTheme(theme === 'square' ? 'rounded' : 'square')}
        >
          Tema: {theme}
        </Button>
      </div>
      <Card>
        <CardHeader>Persistencia con storageKey</CardHeader>
        <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Avatar name="Ana López" />
          <Button>Botón</Button>
          <Badge variant="success">Activo</Badge>
        </CardBody>
      </Card>
    </div>
  );
};

export const UncontrolledWithPersistence: Story = {
  args: { children: null, theme: 'square' },
  render: () => (
    <ThemeProvider defaultTheme="square" defaultColorScheme="light" storageKey="bip-storybook-theme">
      <ToggleDemo />
    </ThemeProvider>
  ),
};

/**
 * `colorScheme="system"` sigue prefers-color-scheme del SO en vivo (cambia
 * el modo oscuro del sistema operativo con esta story abierta) — nunca se
 * estampa 'system' en el DOM, siempre el valor resuelto light/dark.
 */
const SystemDemo = () => {
  const { colorScheme, resolvedColorScheme } = useThemeControls();
  return (
    <Card>
      <CardHeader>
        colorScheme=&quot;{colorScheme}&quot; → resuelto: {resolvedColorScheme}
      </CardHeader>
      <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Avatar name="Ana López" />
        <Button>Botón</Button>
        <Badge variant="primary">Sigue al SO</Badge>
      </CardBody>
    </Card>
  );
};

export const SystemColorScheme: Story = {
  args: { children: null, theme: 'square' },
  render: () => (
    <ThemeProvider theme="square" colorScheme="system">
      <SystemDemo />
    </ThemeProvider>
  ),
};
