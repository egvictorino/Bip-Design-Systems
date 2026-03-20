import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarActions } from './Navbar';
import { Button } from '../Button';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
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
    className="text-primary"
    aria-hidden="true"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

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
