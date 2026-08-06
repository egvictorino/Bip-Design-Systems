import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarActions } from './Navbar';
import { Button } from '../Button';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'transparent'],
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Logo placeholder ─────────────────────────────────────────────────────────

const LogoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ color: 'var(--color-primary)' }}
    aria-hidden="true"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard">Dashboard</NavbarItem>
        <NavbarItem href="/clientes">Clientes</NavbarItem>
        <NavbarItem href="/facturas">Facturas</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button variant="secondary" size="sm">
          Configuración
        </Button>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const WithActiveItem: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes">Clientes</NavbarItem>
        <NavbarItem href="/facturas">Facturas</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const WithDisabledItem: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes">Clientes</NavbarItem>
        <NavbarItem href="/reportes" disabled>
          Reportes (próximamente)
        </NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const MinimalBrand: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
    </Navbar>
  ),
};

export const WithButtonItems: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand>
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem active>Inicio</NavbarItem>
        <NavbarItem>Productos</NavbarItem>
        <NavbarItem>Contacto</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button variant="secondary" size="sm">
          Iniciar sesión
        </Button>
        <Button size="sm">Registrarse</Button>
      </NavbarActions>
    </Navbar>
  ),
};

// ─── New stories ──────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" icon={<HomeIcon />} active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes" icon={<UsersIcon />}>
          Clientes
        </NavbarItem>
        <NavbarItem href="/facturas" icon={<FileIcon />}>
          Facturas
        </NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button variant="secondary" size="sm">
          Configuración
        </Button>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const Elevated: Story = {
  args: { children: null },
  render: () => (
    <Navbar variant="elevated">
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes">Clientes</NavbarItem>
        <NavbarItem href="/facturas">Facturas</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const Transparent: Story = {
  args: { children: null },
  render: () => (
    <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '0' }}>
      <Navbar variant="transparent">
        <NavbarBrand href="/">
          <LogoIcon />
          <span style={{ color: 'white' }}>MiApp</span>
        </NavbarBrand>
        <NavbarNav>
          <NavbarItem href="/dashboard" active>
            Dashboard
          </NavbarItem>
          <NavbarItem href="/clientes">Clientes</NavbarItem>
          <NavbarItem href="/facturas">Facturas</NavbarItem>
        </NavbarNav>
        <NavbarActions>
          <Button size="sm">Cerrar sesión</Button>
        </NavbarActions>
      </Navbar>
    </div>
  ),
};

export const MobilePreview: Story = {
  args: { children: null },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" icon={<HomeIcon />} active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes" icon={<UsersIcon />}>
          Clientes
        </NavbarItem>
        <NavbarItem href="/facturas" icon={<FileIcon />}>
          Facturas
        </NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button variant="secondary" size="sm">
          Configuración
        </Button>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const ManyItems: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" icon={<HomeIcon />} active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes" icon={<UsersIcon />}>
          Clientes
        </NavbarItem>
        <NavbarItem href="/facturas" icon={<FileIcon />}>
          Facturas
        </NavbarItem>
        <NavbarItem href="/configuracion" icon={<SettingsIcon />}>
          Configuración
        </NavbarItem>
        <NavbarItem href="/notificaciones" icon={<BellIcon />}>
          Notificaciones
        </NavbarItem>
        <NavbarItem href="/buscar" icon={<SearchIcon />}>
          Buscar
        </NavbarItem>
        <NavbarItem href="/reportes">Reportes</NavbarItem>
        <NavbarItem href="/ayuda">Ayuda</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const IconOnly: Story = {
  args: { children: null },
  render: () => (
    <Navbar>
      <NavbarBrand href="/">
        <LogoIcon />
        MiApp
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" icon={<HomeIcon />} aria-label="Dashboard" active />
        <NavbarItem href="/clientes" icon={<UsersIcon />} aria-label="Clientes" />
        <NavbarItem href="/facturas" icon={<FileIcon />} aria-label="Facturas" />
        <NavbarItem icon={<SettingsIcon />} aria-label="Configuración" />
        <NavbarItem icon={<BellIcon />} aria-label="Notificaciones" />
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  ),
};
