import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from './Table';
import { Badge } from '../Badge';
import { Button } from '../Button';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean' },
    compact: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    caption: { control: 'text' },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const clientes = [
  { id: 1, nombre: 'María González', email: 'maria@empresa.mx', estado: 'Activo', monto: '$12,500' },
  { id: 2, nombre: 'Carlos Ramírez', email: 'carlos@negocio.mx', estado: 'Pendiente', monto: '$8,200' },
  { id: 3, nombre: 'Ana Torres', email: 'ana@startup.mx', estado: 'Activo', monto: '$31,000' },
  { id: 4, nombre: 'Luis Hernández', email: 'luis@pyme.mx', estado: 'Inactivo', monto: '$0' },
  { id: 5, nombre: 'Sofía Méndez', email: 'sofia@corp.mx', estado: 'Activo', monto: '$7,800' },
];

type Estado = 'Activo' | 'Pendiente' | 'Inactivo';

const estadoVariant: Record<Estado, 'success' | 'warning' | 'neutral'> = {
  Activo: 'success',
  Pendiente: 'warning',
  Inactivo: 'neutral',
};

const ClientesTable = ({ striped = false, compact = false }: { striped?: boolean; compact?: boolean }) => (
  <Table striped={striped} compact={compact}>
    <TableHead>
      <TableRow>
        <TableHeader>Nombre</TableHeader>
        <TableHeader>Correo electrónico</TableHeader>
        <TableHeader>Estado</TableHeader>
        <TableHeader align="right">Monto</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      {clientes.map((c) => (
        <TableRow key={c.id}>
          <TableCell>{c.nombre}</TableCell>
          <TableCell>{c.email}</TableCell>
          <TableCell>
            <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
          </TableCell>
          <TableCell align="right">{c.monto}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Default: Story = {
  args: { children: null },
  render: () => <ClientesTable />,
};

export const Striped: Story = {
  args: { striped: true, children: null },
  render: () => <ClientesTable striped />,
};

export const Compact: Story = {
  args: { compact: true, children: null },
  render: () => <ClientesTable compact />,
};

export const StripedCompact: Story = {
  args: { striped: true, compact: true, children: null },
  render: () => <ClientesTable striped compact />,
};

export const WithCaption: Story = {
  args: { children: null },
  render: () => (
    <Table caption="Clientes registrados">
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader align="right">Monto</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {clientes.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.nombre}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>
              <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
            </TableCell>
            <TableCell align="right">{c.monto}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithStickyHeader: Story = {
  args: { children: null },
  render: () => (
    <div style={{ height: 300, overflow: 'auto', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Correo electrónico</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader align="right">Monto</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...clientes, ...clientes, ...clientes].map((c, i) => (
            <TableRow key={i}>
              <TableCell>{c.nombre}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
              </TableCell>
              <TableCell align="right">{c.monto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

const montoNumerico = (monto: string) => Number(monto.replace(/[$,]/g, ''));

const WithSortingTableStory = () => {
  const [sort, setSort] = useState<{ col: 'nombre' | 'monto' | null; dir: 'asc' | 'desc' }>({
    col: null,
    dir: 'asc',
  });

  const handleSort = (col: 'nombre' | 'monto') => {
    setSort((prev) => {
      if (prev.col !== col) return { col, dir: 'asc' };
      if (prev.dir === 'asc') return { col, dir: 'desc' };
      return { col: null, dir: 'asc' };
    });
  };

  const sortedClientes = useMemo(
    () =>
      [...clientes].sort((a, b) => {
        if (!sort.col) return 0;
        if (sort.col === 'nombre') {
          const cmp = a.nombre.localeCompare(b.nombre, 'es-MX');
          return sort.dir === 'asc' ? cmp : -cmp;
        }
        const cmp = montoNumerico(a.monto) - montoNumerico(b.monto);
        return sort.dir === 'asc' ? cmp : -cmp;
      }),
    [sort]
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader
            sortable
            sortDirection={sort.col === 'nombre' ? sort.dir : null}
            onSort={() => handleSort('nombre')}
          >
            Nombre
          </TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader
            sortable
            sortDirection={sort.col === 'monto' ? sort.dir : null}
            onSort={() => handleSort('monto')}
            align="right"
          >
            Monto
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedClientes.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.nombre}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>
              <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
            </TableCell>
            <TableCell align="right">{c.monto}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const WithSorting: Story = {
  args: { children: null },
  render: () => <WithSortingTableStory />,
};

export const WithActions: Story = {
  args: { children: null },
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader align="right">Acciones</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {clientes.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <div>
                <p style={{ fontWeight: 500, color: 'var(--color-txt)' }}>{c.nombre}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>{c.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
            </TableCell>
            <TableCell align="right">
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button variant="soul" size="sm">
                  Editar
                </Button>
                <Button variant="bare" size="sm">
                  Eliminar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  args: { children: null },
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableEmpty colSpan={3} />
      </TableBody>
    </Table>
  ),
};

export const EmptyCustomMessage: Story = {
  args: { children: null },
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableEmpty colSpan={3}>
          <p style={{ padding: '2rem 0' }}>No se encontraron resultados para tu búsqueda.</p>
        </TableEmpty>
      </TableBody>
    </Table>
  ),
};

const WithSelectionStory = () => {
  const [selectedId, setSelectedId] = useState<number | null>(1);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Nombre</TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader align="right">Monto</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {clientes.map((c) => (
          <TableRow
            key={c.id}
            selected={selectedId === c.id}
            clickable
            onClick={() => setSelectedId(c.id)}
          >
            <TableCell>{c.nombre}</TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>
              <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
            </TableCell>
            <TableCell align="right">{c.monto}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const WithSelection: Story = {
  args: { children: null },
  render: () => <WithSelectionStory />,
};
