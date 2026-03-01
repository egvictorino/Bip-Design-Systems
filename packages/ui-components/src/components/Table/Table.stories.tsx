import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './Table';
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
  args: { children: '' },
  render: () => <ClientesTable />,
};

export const Striped: Story = {
  args: { striped: true, children: '' },
  render: () => <ClientesTable striped />,
};

export const Compact: Story = {
  args: { compact: true, children: '' },
  render: () => <ClientesTable compact />,
};

export const StripedCompact: Story = {
  args: { striped: true, compact: true, children: '' },
  render: () => <ClientesTable striped compact />,
};

const WithSortingTableStory = () => {
  const [sortCol, setSortCol] = useState<'nombre' | 'monto' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: 'nombre' | 'monto') => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader
            sortable
            sortDirection={sortCol === 'nombre' ? sortDir : null}
            onSort={() => handleSort('nombre')}
          >
            Nombre
          </TableHeader>
          <TableHeader>Correo electrónico</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader
            sortable
            sortDirection={sortCol === 'monto' ? sortDir : null}
            onSort={() => handleSort('monto')}
            align="right"
          >
            Monto
          </TableHeader>
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
};

export const WithSorting: Story = {
  args: { children: '' },
  render: () => <WithSortingTableStory />,
};

export const WithActions: Story = {
  args: { children: '' },
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
                <p className="font-medium text-text-primary">{c.nombre}</p>
                <p className="text-xs text-text-secondary">{c.email}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={estadoVariant[c.estado as Estado]}>{c.estado}</Badge>
            </TableCell>
            <TableCell align="right">
              <div className="flex justify-end gap-2">
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
  args: { children: '' },
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
        <TableRow>
          <TableCell colSpan={3}>
            <p className="py-8 text-center text-text-secondary">No hay registros que mostrar.</p>
          </TableCell>
        </TableRow>
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
            onClick={() => setSelectedId(c.id)}
            className="cursor-pointer"
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
  args: { children: '' },
  render: () => <WithSelectionStory />,
};
