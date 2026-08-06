import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { SortDirection } from './DataTable';
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

// ─── Existing stories ──────────────────────────────────────────────────────────

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

// ─── New stories ───────────────────────────────────────────────────────────────

const ConSeleccionRender = () => {
  const [selected, setSelected] = useState<Paciente[]>([]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DataTable<Paciente>
        columns={columns}
        data={pacientes}
        keyExtractor={(row) => row.id}
        pageSize={8}
        selectable
        onSelectionChange={setSelected}
        bulkActions={[
          {
            label: 'Exportar',
            variant: 'secondary',
            onClick: (rows) => alert(`Exportando ${rows.length} paciente(s)`),
          },
          {
            label: 'Eliminar',
            variant: 'danger',
            onClick: (rows) => alert(`Eliminando ${rows.length} paciente(s)`),
          },
        ]}
      />
      <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>
        {selected.length} paciente(s) seleccionado(s)
      </p>
    </div>
  );
};

export const ConSeleccion: Story = {
  args: { columns: [], data: [] },
  render: () => <ConSeleccionRender />,
};

const ConServerSideRender = () => {
  const TOTAL = 100;
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [query, setQuery] = useState('');

  // Simulate server: filter + sort + paginate in-memory
  const allData = pacientes.concat(
    Array.from({ length: TOTAL - pacientes.length }, (_, i) => ({
      id: pacientes.length + i + 1,
      nombre: ['Roberto Silva', 'Fernanda Torres', 'Diego Reyes'][(i) % 3],
      rfc: `RFC${String(pacientes.length + i + 1).padStart(6, '0')}`,
      telefono: `+52 81 9${i + 100}-${i + 200}`,
      ultimaVisita: `${String((i % 28) + 1).padStart(2, '0')}/02/2024`,
      estado: i % 3 === 0 ? 'Inactivo' : 'Activo',
    }))
  );

  const filtered = query
    ? allData.filter((p) =>
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.rfc.toLowerCase().includes(query.toLowerCase())
      )
    : allData;

  const sorted =
    sortKey && sortDir
      ? [...filtered].sort((a, b) => {
          const av = String(a[sortKey as keyof Paciente]);
          const bv = String(b[sortKey as keyof Paciente]);
          const cmp = av.localeCompare(bv, 'es-MX', { numeric: true });
          return sortDir === 'asc' ? cmp : -cmp;
        })
      : filtered;

  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) as Paciente[];

  return (
    <DataTable<Paciente>
      columns={columns}
      data={pageData}
      keyExtractor={(row) => row.id}
      pageSize={PAGE_SIZE}
      serverSide
      totalCount={sorted.length}
      searchable
      searchKeys={['nombre', 'rfc']}
      searchPlaceholder="Buscar (server-side)..."
      onSearchChange={(q) => {
        setQuery(q);
        setPage(1);
      }}
      onSortChange={(key, dir) => {
        setSortKey(key);
        setSortDir(dir);
        setPage(1);
      }}
      onPageChange={(p) => setPage(p)}
      label="Tabla server-side"
    />
  );
};

export const ConServerSide: Story = {
  args: { columns: [], data: [] },
  render: () => <ConServerSideRender />,
};

export const ConVisibilidadColumnas: Story = {
  args: { columns: [], data: [] },
  render: () => (
    <DataTable<Paciente>
      columns={columns}
      data={pacientes}
      keyExtractor={(row) => row.id}
      pageSize={8}
      searchable
      searchKeys={['nombre', 'rfc']}
      columnVisibility
      defaultHiddenColumns={['telefono']}
      label="Pacientes con visibilidad de columnas"
    />
  ),
};
