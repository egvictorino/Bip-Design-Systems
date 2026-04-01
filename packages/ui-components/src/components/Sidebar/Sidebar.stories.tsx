import type { Meta, StoryObj } from '@storybook/react';
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarSubMenu,
  SidebarFooter,
  SidebarTrigger,
} from './Sidebar';

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      clipRule="evenodd"
    />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} style={{ flexShrink: 0 }} aria-hidden="true">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
);

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultContent = () => (
  <>
    <SidebarHeader>
      <SidebarBrand>BipUI</SidebarBrand>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup label="Principal">
        <SidebarItem href="#" icon={<HomeIcon />}>Dashboard</SidebarItem>
        <SidebarItem href="#" icon={<UsersIcon />}>Usuarios</SidebarItem>
        <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
      </SidebarGroup>
      <SidebarGroup label="Configuración">
        <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarGroup>
        <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
      </SidebarGroup>
    </SidebarFooter>
  </>
);

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <DefaultContent />
      </Sidebar>
    </div>
  ),
};

export const WithActiveItem: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<UsersIcon />}>Usuarios</SidebarItem>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />}>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<UsersIcon />} disabled>Usuarios</SidebarItem>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};

export const Collapsed: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar defaultCollapsed>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />}>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<UsersIcon />} active>Usuarios</SidebarItem>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const MobileOpen: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar isOpen onClose={() => {}}>
        <DefaultContent />
      </Sidebar>
    </div>
  ),
};

export const WithSubMenu: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarSubMenu label="Archivos" icon={<FolderIcon />} defaultOpen>
              <SidebarItem href="#">Documentos</SidebarItem>
              <SidebarItem href="#">Imágenes</SidebarItem>
              <SidebarItem href="#">Videos</SidebarItem>
            </SidebarSubMenu>
            <SidebarSubMenu label="Usuarios" icon={<UsersIcon />}>
              <SidebarItem href="#">Lista de usuarios</SidebarItem>
              <SidebarItem href="#">Roles y permisos</SidebarItem>
            </SidebarSubMenu>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const WithBadge: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<BellIcon />} badge={5}>Notificaciones</SidebarItem>
            <SidebarItem href="#" icon={<UsersIcon />} badge={103}>Mensajes</SidebarItem>
            <SidebarSubMenu label="Reportes" icon={<ChartIcon />} badge={2}>
              <SidebarItem href="#">Ventas</SidebarItem>
              <SidebarItem href="#">Inventario</SidebarItem>
            </SidebarSubMenu>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const DarkVariant: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar variant="dark">
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<BellIcon />} badge={5}>Notificaciones</SidebarItem>
            <SidebarSubMenu label="Usuarios" icon={<UsersIcon />} defaultOpen>
              <SidebarItem href="#">Lista de usuarios</SidebarItem>
              <SidebarItem href="#">Roles y permisos</SidebarItem>
            </SidebarSubMenu>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const PrimaryVariant: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar variant="primary">
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<BellIcon />} badge={3}>Notificaciones</SidebarItem>
            <SidebarSubMenu label="Usuarios" icon={<UsersIcon />} defaultOpen>
              <SidebarItem href="#">Lista de usuarios</SidebarItem>
              <SidebarItem href="#">Roles y permisos</SidebarItem>
            </SidebarSubMenu>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};

export const AllFeatures: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 500, position: 'relative' }}>
      <Sidebar variant="dark">
        <SidebarHeader>
          <SidebarBrand>BipUI</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Principal">
            <SidebarItem href="#" icon={<HomeIcon />} active>Dashboard</SidebarItem>
            <SidebarItem href="#" icon={<BellIcon />} badge={12}>Notificaciones</SidebarItem>
            <SidebarSubMenu label="Archivos" icon={<FolderIcon />} badge={2} defaultOpen>
              <SidebarItem href="#">Documentos</SidebarItem>
              <SidebarItem href="#">Imágenes</SidebarItem>
              <SidebarItem href="#" disabled>Videos (próximamente)</SidebarItem>
            </SidebarSubMenu>
            <SidebarSubMenu label="Usuarios" icon={<UsersIcon />} badge={103}>
              <SidebarItem href="#">Lista de usuarios</SidebarItem>
              <SidebarItem href="#">Roles y permisos</SidebarItem>
            </SidebarSubMenu>
            <SidebarItem href="#" icon={<ChartIcon />}>Reportes</SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Configuración">
            <SidebarItem href="#" icon={<SettingsIcon />}>Ajustes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarItem icon={<LogoutIcon />}>Cerrar sesión</SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};
