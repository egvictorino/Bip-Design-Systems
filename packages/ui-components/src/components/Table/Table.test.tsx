import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableEmpty } from './Table';

const DefaultTable = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableHeader>Nombre</TableHeader>
        <TableHeader>Email</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Juan</TableCell>
        <TableCell>juan@example.com</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>María</TableCell>
        <TableCell>maria@example.com</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

describe('Table', () => {
  // ─── Rendering básico ──────────────────────────────────────────────────────

  it('renders a table element', () => {
    render(<DefaultTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DefaultTable />);
    expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
  });

  it('renders cell data', () => {
    render(<DefaultTable />);
    expect(screen.getByRole('cell', { name: 'Juan' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'juan@example.com' })).toBeInTheDocument();
  });

  // ─── Caption ──────────────────────────────────────────────────────────────

  it('renders caption when caption prop is provided', () => {
    render(
      <Table caption="Listado de clientes">
        <TableBody />
      </Table>
    );
    expect(screen.getByText('Listado de clientes').tagName).toBe('CAPTION');
  });

  it('does not render caption when caption prop is omitted', () => {
    const { container } = render(
      <Table>
        <TableBody />
      </Table>
    );
    expect(container.querySelector('caption')).toBeNull();
  });

  // ─── Sticky header ────────────────────────────────────────────────────────

  it('stickyHeader applies theadSticky class to thead', () => {
    const { container } = render(
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeader>Nombre</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(container.querySelector('thead')).toHaveClass('theadSticky');
  });

  it('without stickyHeader thead does not have theadSticky class', () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Nombre</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(container.querySelector('thead')).not.toHaveClass('theadSticky');
  });

  // ─── Sorting ──────────────────────────────────────────────────────────────

  it('sortable header has aria-sort="none" and tabIndex=0', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDirection={null}>
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    const header = screen.getByRole('columnheader', { name: /Nombre/i });
    expect(header).toHaveAttribute('aria-sort', 'none');
    expect(header).toHaveAttribute('tabIndex', '0');
  });

  it('sortable header with sortDirection="asc" has aria-sort="ascending"', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDirection="asc">
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /Nombre/i })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );
  });

  it('sortable header with sortDirection="desc" has aria-sort="descending"', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDirection="desc">
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: /Nombre/i })).toHaveAttribute(
      'aria-sort',
      'descending'
    );
  });

  it('non-sortable header does not have aria-sort or tabIndex', () => {
    render(<DefaultTable />);
    const header = screen.getByRole('columnheader', { name: 'Nombre' });
    expect(header).not.toHaveAttribute('aria-sort');
    expect(header).not.toHaveAttribute('tabIndex');
  });

  it('clicking a sortable header calls onSort', () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable onSort={onSort}>
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /Nombre/i }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('pressing Enter on a sortable header calls onSort', () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable onSort={onSort}>
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    fireEvent.keyDown(screen.getByRole('columnheader', { name: /Nombre/i }), { key: 'Enter' });
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it('pressing Space on a sortable header calls onSort', () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable onSort={onSort}>
              Nombre
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    fireEvent.keyDown(screen.getByRole('columnheader', { name: /Nombre/i }), { key: ' ' });
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  // ─── scope prop ──────────────────────────────────────────────────────────

  it('TableHeader has scope="col" by default', () => {
    render(<DefaultTable />);
    const header = screen.getByRole('columnheader', { name: 'Nombre' });
    expect(header).toHaveAttribute('scope', 'col');
  });

  it('TableHeader accepts scope="row"', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHeader scope="row">Fila</TableHeader>
            <TableCell>Dato</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('th')).toHaveAttribute('scope', 'row');
  });

  // ─── Selection ────────────────────────────────────────────────────────────

  it('selected row has aria-selected="true"', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>Seleccionado</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = container.querySelector('tbody tr')!;
    expect(row).toHaveAttribute('aria-selected', 'true');
  });

  it('non-selected row does not have aria-selected', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Normal</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const row = container.querySelector('tbody tr')!;
    expect(row).not.toHaveAttribute('aria-selected');
  });

  it('TableRow in thead does not emit aria-selected even when selected=true', () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow selected>
            <TableHeader>Nombre</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    const row = container.querySelector('thead tr')!;
    expect(row).not.toHaveAttribute('aria-selected');
  });

  // ─── clickable ────────────────────────────────────────────────────────────

  it('clickable prop applies rowClickable class', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow clickable>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('tbody tr')).toHaveClass('rowClickable');
  });

  it('without clickable, rowClickable class is not applied', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Fila</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('tbody tr')).not.toHaveClass('rowClickable');
  });

  // ─── Context guard ────────────────────────────────────────────────────────

  it('throws when sub-components are used outside <Table>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TableRow><TableCell>X</TableCell></TableRow>)).toThrow();
    consoleError.mockRestore();
  });

  // ─── Compact / Normal ─────────────────────────────────────────────────────

  it('compact mode applies thCompact/tdCompact classes', () => {
    const { container } = render(
      <Table compact>
        <TableHead>
          <TableRow>
            <TableHeader>Nombre</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Juan</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('th')).toHaveClass('thCompact');
    expect(container.querySelector('td')).toHaveClass('tdCompact');
  });

  it('non-compact mode applies thNormal/tdNormal classes', () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Nombre</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Juan</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('th')).toHaveClass('thNormal');
    expect(container.querySelector('td')).toHaveClass('tdNormal');
  });

  it('striped mode applies rowStriped class to each row', () => {
    const { container } = render(
      <Table striped>
        <TableBody>
          <TableRow>
            <TableCell>Fila 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fila 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      expect(row).toHaveClass('rowStriped');
    });
  });

  // ─── Alignment ────────────────────────────────────────────────────────────

  it('TableHeader align="center" applies alignCenter class', () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader align="center">Centro</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(container.querySelector('th')).toHaveClass('alignCenter');
  });

  it('TableHeader align="right" applies alignRight class', () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader align="right">Derecha</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody />
      </Table>
    );
    expect(container.querySelector('th')).toHaveClass('alignRight');
  });

  it('TableCell align="center" applies alignCenter class', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="center">Centro</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('td')).toHaveClass('alignCenter');
  });

  // ─── className forwarding ─────────────────────────────────────────────────

  it('Table forwards className to the wrapper div', () => {
    const { container } = render(
      <Table className="my-custom-class">
        <TableBody />
      </Table>
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  // ─── TableEmpty ──────────────────────────────────────────────────────────

  it('TableEmpty renders default message', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>
    );
    expect(screen.getByText('No hay registros que mostrar.')).toBeInTheDocument();
  });

  it('TableEmpty renders custom children instead of default message', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3}>Sin resultados para tu búsqueda</TableEmpty>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Sin resultados para tu búsqueda')).toBeInTheDocument();
    expect(screen.queryByText('No hay registros que mostrar.')).toBeNull();
  });

  it('TableEmpty renders a single td with the given colSpan', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={4} />
        </TableBody>
      </Table>
    );
    const td = container.querySelector('tbody td')!;
    expect(td).toHaveAttribute('colSpan', '4');
  });

  it('TableEmpty applies tdCompact class in compact mode', () => {
    const { container } = render(
      <Table compact>
        <TableBody>
          <TableEmpty colSpan={2} />
        </TableBody>
      </Table>
    );
    expect(container.querySelector('tbody td')).toHaveClass('tdCompact');
  });

  it('TableEmpty applies tdNormal class in non-compact mode', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={2} />
        </TableBody>
      </Table>
    );
    expect(container.querySelector('tbody td')).toHaveClass('tdNormal');
  });

  it('TableEmpty throws when used outside <Table>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TableEmpty colSpan={3} />)).toThrow();
    consoleError.mockRestore();
  });

  it('TableEmpty applies tdEmpty class', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={2} />
        </TableBody>
      </Table>
    );
    expect(container.querySelector('tbody td')).toHaveClass('tdEmpty');
  });
});
