import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge } from '../Badge';

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sample data ──────────────────────────────────────────────────────────────

interface Paciente extends Record<string, unknown> {
  id: number;
  nombre: string;
  rfc: string;
  telefono: string;
  ultimaVisita: string;
  estado: string;
}

const pacientes: Paciente[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  nombre: ['María González', 'Juan Pérez', 'Ana López', 'Carlos Martínez', 'Laura Rodríguez'][
    i % 5
  ],
  rfc: `RFC${String(i + 1).padStart(6, '0')}`,
  telefono: `+52 81 ${1000 + i}-${2000 + i}`,
  ultimaVisita: `${String((i % 28) + 1).padStart(2, '0')}/03/2024`,
  estado: i % 4 === 0 ? 'Inactivo' : 'Activo',
}));

const columns = [
  { key: 'id', header: '#', width: '60px', sortable: true },
  { key: 'nombre', header: 'Nombre', sortable: true },
  { key: 'rfc', header: 'RFC' },
  { key: 'telefono', header: 'Teléfono' },
  { key: 'ultimaVisita', header: 'Última visita', sortable: true },
  {
    key: 'estado',
    header: 'Estado',
    render: (value: unknown) => (
      <Badge variant={value === 'Activo' ? 'success' : 'neutral'}>{value as string}</Badge>
    ),
  },
];

export const Default: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={pacientes}
      keyExtractor={(row) => row.id}
      pageSize={8}
    />
  ),
};

export const Cargando: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={[]}
      loading={true}
      pageSize={5}
    />
  ),
};

export const SinDatos: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={[]}
      emptyMessage="No se encontraron pacientes"
    />
  ),
};

export const Striped: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={pacientes.slice(0, 5)}
      striped
      keyExtractor={(row) => row.id}
    />
  ),
};

export const Compacto: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={pacientes.slice(0, 6)}
      compact
      keyExtractor={(row) => row.id}
    />
  ),
};

export const ConBusqueda: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={pacientes}
      keyExtractor={(row) => row.id}
      pageSize={8}
      searchable
      searchKeys={['nombre', 'rfc', 'telefono']}
      searchPlaceholder="Buscar por nombre, RFC o teléfono..."
    />
  ),
};
