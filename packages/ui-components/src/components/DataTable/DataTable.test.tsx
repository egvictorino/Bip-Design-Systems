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

// ─── Existing tests ────────────────────────────────────────────────────────────

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
    const nameCell = cells.find((c) => c.textContent === 'Ana');
    expect(nameCell).toBeInTheDocument();
  });

  it('sorts descending on second click of sortable column', async () => {
    render(<DataTable columns={columns} data={data} />);
    const header = screen.getByText('Nombre');
    await userEvent.click(header);
    await userEvent.click(header);
    const rows = screen.getAllByRole('row');
    expect(rows[rows.length - 1]).toHaveTextContent('Ana');
  });

  it('clears sort on third click', async () => {
    render(<DataTable columns={columns} data={data} />);
    const header = screen.getByText('Nombre');
    await userEvent.click(header);
    await userEvent.click(header);
    await userEvent.click(header);
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
      <DataTable
        columns={columns}
        data={data}
        searchable
        searchKeys={['nombre']}
        searchPlaceholder="Buscar paciente..."
      />
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
      <DataTable
        columns={columns}
        data={data}
        searchable
        searchKeys={['nombre']}
        emptyMessage="Sin resultados"
      />
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
    render(
      <DataTable columns={columns} data={multiData} searchable searchKeys={['nombre', 'edad']} />
    );
    await userEvent.type(screen.getByRole('searchbox'), '25');
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();
  });
});

// ─── Row selection ─────────────────────────────────────────────────────────────

describe('DataTable — row selection', () => {
  it('renders a checkbox in the header when selectable=true', () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    expect(
      screen.getByRole('checkbox', { name: 'Seleccionar todas las filas de esta página' })
    ).toBeInTheDocument();
  });

  it('renders a checkbox for each data row when selectable=true', () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    // 3 row checkboxes + 1 header = 4 total
    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  });

  it('does not render checkboxes when selectable=false', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('toggles individual row selection on checkbox click', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    const rowCheckbox = screen.getByRole('checkbox', { name: 'Seleccionar fila 1' });
    await userEvent.click(rowCheckbox);
    expect(rowCheckbox).toBeChecked();
    await userEvent.click(rowCheckbox);
    expect(rowCheckbox).not.toBeChecked();
  });

  it('selects all page rows when header checkbox is clicked while none are selected', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Seleccionar todas las filas de esta página' })
    );
    screen
      .getAllByRole('checkbox', { name: /Seleccionar fila/ })
      .forEach((cb) => expect(cb).toBeChecked());
  });

  it('deselects all page rows when header checkbox is clicked while all are selected', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    const headerCheckbox = screen.getByRole('checkbox', {
      name: 'Seleccionar todas las filas de esta página',
    });
    await userEvent.click(headerCheckbox);
    await userEvent.click(headerCheckbox);
    screen
      .getAllByRole('checkbox', { name: /Seleccionar fila/ })
      .forEach((cb) => expect(cb).not.toBeChecked());
  });

  it('shows selection count and Limpiar button when rows are selected', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    expect(screen.queryByText(/seleccionado/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 1' }));
    expect(screen.getByText('1 seleccionado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument();
  });

  it('shows plural "seleccionados" when more than one row is selected', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 1' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 2' }));
    expect(screen.getByText('2 seleccionados')).toBeInTheDocument();
  });

  it('renders bulk action buttons when bulkActions is provided and rows are selected', async () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        keyExtractor={(row) => row.id}
        bulkActions={[{ label: 'Eliminar', onClick: vi.fn(), variant: 'danger' }]}
      />
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 1' }));
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
  });

  it('clears selection when Limpiar button is clicked', async () => {
    render(<DataTable columns={columns} data={data} selectable keyExtractor={(row) => row.id} />);
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Seleccionar todas las filas de esta página' })
    );
    expect(screen.getByText(/seleccionado/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(screen.queryByText(/seleccionado/)).not.toBeInTheDocument();
  });

  it('calls onSelectionChange with the selected rows', async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        keyExtractor={(row) => row.id}
        onSelectionChange={onSelectionChange}
      />
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 1' }));
    expect(onSelectionChange).toHaveBeenCalledWith([data[0]]);
  });

  it('passes selected rows to bulk action callback', async () => {
    const onBulkAction = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        keyExtractor={(row) => row.id}
        bulkActions={[{ label: 'Archivar', onClick: onBulkAction }]}
      />
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar fila 2' }));
    await userEvent.click(screen.getByRole('button', { name: 'Archivar' }));
    expect(onBulkAction).toHaveBeenCalledWith([data[1]]);
  });
});

// ─── Server-side mode ──────────────────────────────────────────────────────────

describe('DataTable — server-side', () => {
  it('does not filter data client-side in server-side mode', async () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        serverSide
        searchable
        searchKeys={['nombre']}
        onSearch={vi.fn()}
      />
    );
    await userEvent.type(screen.getByRole('searchbox'), 'Ana');
    // All 3 rows remain (no client-side filtering)
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Beatriz')).toBeInTheDocument();
  });

  it('calls onSearch when search query changes in server-side mode', async () => {
    const onSearchChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        serverSide
        searchable
        searchKeys={['nombre']}
        onSearch={onSearchChange}
      />
    );
    await userEvent.type(screen.getByRole('searchbox'), 'B');
    expect(onSearchChange).toHaveBeenCalledWith('B');
  });

  it('calls onSortChange when a sortable column header is clicked in server-side mode', async () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={columns} data={data} serverSide onSortChange={onSortChange} />);
    await userEvent.click(screen.getByText('Nombre'));
    expect(onSortChange).toHaveBeenCalledWith('nombre', 'asc');
  });

  it('uses totalCount to calculate total pages in server-side mode', () => {
    const pageData: Row[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      nombre: `P${i + 1}`,
      edad: 20,
    }));
    // totalCount=20, pageSize=5 → 4 pages → pagination visible
    render(
      <DataTable
        columns={columns}
        data={pageData}
        serverSide
        totalCount={20}
        pageSize={5}
      />
    );
    expect(screen.getByLabelText('Paginación')).toBeInTheDocument();
  });

  it('calls onPageChange when page changes in server-side mode', async () => {
    const onPageChange = vi.fn();
    const pageData: Row[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      nombre: `P${i + 1}`,
      edad: 20,
    }));
    render(
      <DataTable
        columns={columns}
        data={pageData}
        serverSide
        totalCount={20}
        pageSize={5}
        onPageChange={onPageChange}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Página 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

// ─── Column visibility ─────────────────────────────────────────────────────────

describe('DataTable — column visibility', () => {
  it('renders column visibility button when columnVisibility=true', () => {
    render(<DataTable columns={columns} data={data} columnVisibility />);
    expect(screen.getByRole('button', { name: 'Columnas' })).toBeInTheDocument();
  });

  it('does not render column visibility button when columnVisibility=false', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.queryByRole('button', { name: 'Columnas' })).not.toBeInTheDocument();
  });

  it('opens column visibility panel on button click', async () => {
    render(<DataTable columns={columns} data={data} columnVisibility />);
    await userEvent.click(screen.getByRole('button', { name: 'Columnas' }));
    expect(screen.getByRole('dialog', { name: 'Visibilidad de columnas' })).toBeInTheDocument();
  });

  it('closes column visibility panel when clicking outside', async () => {
    render(<DataTable columns={columns} data={data} columnVisibility />);
    await userEvent.click(screen.getByRole('button', { name: 'Columnas' }));
    expect(screen.getByRole('dialog', { name: 'Visibilidad de columnas' })).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(
      screen.queryByRole('dialog', { name: 'Visibilidad de columnas' })
    ).not.toBeInTheDocument();
  });

  it('hides a column header and cells when unchecked in the panel', async () => {
    render(<DataTable columns={columns} data={data} columnVisibility />);
    expect(screen.getByRole('columnheader', { name: 'Edad' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Columnas' }));
    // The panel shows a labeled checkbox for each column
    await userEvent.click(screen.getByRole('checkbox', { name: 'Edad' }));
    expect(screen.queryByRole('columnheader', { name: 'Edad' })).not.toBeInTheDocument();
  });

  it('re-shows a column when re-checked in the panel', async () => {
    render(<DataTable columns={columns} data={data} columnVisibility />);
    await userEvent.click(screen.getByRole('button', { name: 'Columnas' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Edad' })); // hide
    expect(screen.queryByRole('columnheader', { name: 'Edad' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Edad' })); // show
    expect(screen.getByRole('columnheader', { name: 'Edad' })).toBeInTheDocument();
  });

  it('hides columns specified in defaultHiddenColumns on initial render', () => {
    render(
      <DataTable columns={columns} data={data} columnVisibility defaultHiddenColumns={['edad']} />
    );
    expect(screen.queryByRole('columnheader', { name: 'Edad' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
  });
});

// ─── Bug fixes ─────────────────────────────────────────────────────────────────

describe('DataTable — bug fixes', () => {
  it('skeleton row count matches pageSize exactly', () => {
    render(<DataTable columns={columns} data={[]} loading pageSize={7} />);
    // 7 rows × 3 columns = 21 cells
    expect(screen.getAllByRole('cell')).toHaveLength(7 * columns.length);
  });

  it('sorts rows with null values to the end', async () => {
    const dataWithNull = [
      { id: 1, nombre: 'Zebra', edad: 10 },
      { id: 2, nombre: null, edad: 20 },
      { id: 3, nombre: 'Ana', edad: 30 },
    ] as unknown as Row[];
    render(<DataTable columns={columns} data={dataWithNull} />);
    await userEvent.click(screen.getByText('Nombre'));
    const rows = screen.getAllByRole('row');
    // First data row should be Ana (asc), last should have '—' (null)
    expect(rows[1]).toHaveTextContent('Ana');
    expect(rows[rows.length - 1]).toHaveTextContent('—');
  });

  it('sets role="region" and aria-label when aria-label prop is provided', () => {
    render(<DataTable columns={columns} data={data} aria-label="Tabla de pacientes" />);
    expect(screen.getByRole('region', { name: 'Tabla de pacientes' })).toBeInTheDocument();
  });
});
