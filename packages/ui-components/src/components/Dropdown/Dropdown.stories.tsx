import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider } from './Dropdown';
import { Button } from '../Button';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Shared icons ─────────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 010 1.798c-.45.678-1.367 1.932-2.637 3.023C11.671 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 010-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2zM1.679 7.932a.12.12 0 000 .136c.411.622 1.241 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.125-.967 1.955-2.095 2.366-2.717a.12.12 0 000-.136c-.411-.622-1.241-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.125.967-1.955 2.095-2.366 2.717zM8 10a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 00-.064.108l-.558 1.953 1.953-.558a.253.253 0 00.108-.064zm1.238-3.763a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z" />
    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.741-1.576l-.66-6.6a.75.75 0 011.492-.15zM6.5 1.75V3h3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25z" />
  </svg>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary">Acciones</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Ver detalle</DropdownItem>
        <DropdownItem>Editar</DropdownItem>
        <DropdownItem>Duplicar</DropdownItem>
        <DropdownDivider />
        <DropdownItem danger>Eliminar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  args: { children: null },
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary">Acciones</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem icon={<EyeIcon />}>Ver detalle</DropdownItem>
        <DropdownItem icon={<EditIcon />}>Editar</DropdownItem>
        <DropdownItem icon={<CopyIcon />}>Duplicar</DropdownItem>
        <DropdownDivider />
        <DropdownItem icon={<TrashIcon />} danger>
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const AlignEnd: Story = {
  args: { children: null },
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <button
          type="button"
          className="rounded p-1.5 text-txt-secondary hover:bg-surface-3 hover:text-txt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          aria-label="Más opciones"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </DropdownTrigger>
      <DropdownMenu placement="bottom-end">
        <DropdownItem icon={<EyeIcon />}>Ver detalle</DropdownItem>
        <DropdownItem icon={<EditIcon />}>Editar</DropdownItem>
        <DropdownDivider />
        <DropdownItem icon={<TrashIcon />} danger>
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const WithDisabledItems: Story = {
  args: { children: null },
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary">Acciones</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Ver detalle</DropdownItem>
        <DropdownItem disabled>Editar (sin permisos)</DropdownItem>
        <DropdownItem disabled>Duplicar (sin permisos)</DropdownItem>
        <DropdownDivider />
        <DropdownItem danger disabled>
          Eliminar (sin permisos)
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};

export const BareButton: Story = {
  args: { children: null },
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bare">Filtrar por</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Todos</DropdownItem>
        <DropdownItem>Activos</DropdownItem>
        <DropdownItem>Inactivos</DropdownItem>
        <DropdownItem>Archivados</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
};
