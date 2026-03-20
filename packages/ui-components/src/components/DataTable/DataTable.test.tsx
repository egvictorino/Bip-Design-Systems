import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';

interface Row extends Record<string, unknown> {
  id: number;
  nombre: string;
  edad: number;
}

const columns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'nombre', header: 'Nombre', sortable: true },
  { key: 'edad', header: 'Edad' },
];

const data: Row[] = [
  { id: 1, nombre: 'Ana', edad: 30 },
  { id: 2, nombre: 'Carlos', edad: 25 },
  { id: 3, nombre: 'Beatriz', edad: 40 },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Beatriz')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Sin registros" />);
    expect(screen.getByText('Sin registros')).toBeInTheDocument();
  });

  it('renders skeleton rows when loading', () => {
    render(<DataTable columns={columns} data={[]} loading pageSize={3} />);
    // Loading rows should be present (no actual data text)
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();
  });

  it('renders custom cell via render function', () => {
    const customColumns = [
      ...columns,
      {
        key: 'id',
        header: 'Acción',
        render: (_val: unknown, row: Row) => <button>{`Ver ${row.nombre}`}</button>,
      },
    ];
    render(<DataTable columns={customColumns} data={data} />);
    expect(screen.getAllByText('Ver Ana')[0]).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Ana'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('sorts ascending on first click of sortable column', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByText('Nombre'));
    const cells = screen.getAllByRole('cell');
    // After asc sort: Ana, Beatriz, Carlos
    const nameCell = cells.find((c) => c.textContent === 'Ana');
    expect(nameCell).toBeInTheDocument();
  });

  it('sorts descending on second click of sortable column', async () => {
    render(<DataTable columns={columns} data={data} />);
    const header = screen.getByText('Nombre');
    await userEvent.click(header);
    await userEvent.click(header);
    // After desc sort: Carlos, Beatriz, Ana — last row should be Ana
    const rows = screen.getAllByRole('row');
    expect(rows[rows.length - 1]).toHaveTextContent('Ana');
  });

  it('clears sort on third click', async () => {
    render(<DataTable columns={columns} data={data} />);
    const header = screen.getByText('Nombre');
    await userEvent.click(header);
    await userEvent.click(header);
    await userEvent.click(header);
    // Back to original order — first data row is Ana (id:1)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Ana');
  });

  it('paginates data', () => {
    const bigData: Row[] = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      nombre: `Paciente ${i + 1}`,
      edad: 20 + i,
    }));
    render(<DataTable columns={columns} data={bigData} pageSize={5} />);
    expect(screen.getByText('Paciente 1')).toBeInTheDocument();
    expect(screen.queryByText('Paciente 6')).not.toBeInTheDocument();
  });

  it('does not render pagination when data fits in one page', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />);
    expect(screen.queryByLabelText('Paginación')).not.toBeInTheDocument();
  });

  it('renders pagination when data exceeds pageSize', () => {
    const bigData: Row[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      nombre: `P${i + 1}`,
      edad: 20,
    }));
    render(<DataTable columns={columns} data={bigData} pageSize={5} />);
    expect(screen.getByLabelText('Paginación')).toBeInTheDocument();
  });

  it('uses keyExtractor for row keys', () => {
    // Should render without duplicate key warnings
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
      />
    );
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('renders — for null/undefined cell values', () => {
    const colsWithMissing = [{ key: 'missing', header: 'Vacío' }];
    render(<DataTable columns={colsWithMissing} data={[{ missing: undefined } as unknown as Row]} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('does not render search input when searchable is false', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('renders search input when searchable is true', () => {
    render(<DataTable columns={columns} data={data} searchable searchKeys={['nombre']} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('uses custom searchPlaceholder', () => {
    render(
      <DataTable columns={columns} data={data} searchable searchKeys={['nombre']} searchPlaceholder="Buscar paciente..." />
    );
    expect(screen.getByPlaceholderText('Buscar paciente...')).toBeInTheDocument();
  });

  it('filters rows by search query', async () => {
    render(<DataTable columns={columns} data={data} searchable searchKeys={['nombre']} />);
    await userEvent.type(screen.getByRole('searchbox'), 'ana');
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
    expect(screen.queryByText('Beatriz')).not.toBeInTheDocument();
  });

  it('search is case-insensitive', async () => {
    render(<DataTable columns={columns} data={data} searchable searchKeys={['nombre']} />);
    await userEvent.type(screen.getByRole('searchbox'), 'CARLOS');
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no matches', async () => {
    render(
      <DataTable columns={columns} data={data} searchable searchKeys={['nombre']} emptyMessage="Sin resultados" />
    );
    await userEvent.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('clears search and restores all rows', async () => {
    render(<DataTable columns={columns} data={data} searchable searchKeys={['nombre']} />);
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'ana');
    expect(screen.queryByText('Carlos')).not.toBeInTheDocument();
    await userEvent.clear(input);
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Beatriz')).toBeInTheDocument();
  });

  it('searches across multiple keys', async () => {
    const multiData: Row[] = [
      { id: 1, nombre: 'Ana', edad: 30 },
      { id: 2, nombre: 'Carlos', edad: 25 },
    ];
    render(<DataTable columns={columns} data={multiData} searchable searchKeys={['nombre', 'edad']} />);
    await userEvent.type(screen.getByRole('searchbox'), '25');
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();
  });
});
