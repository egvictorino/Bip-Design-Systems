import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './Table';

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

  it('throws when sub-components are used outside <Table>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TableRow><TableCell>X</TableCell></TableRow>)).toThrow();
    consoleError.mockRestore();
  });

  it('compact mode applies smaller padding to header and cell', () => {
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
    const th = container.querySelector('th')!;
    const td = container.querySelector('td')!;
    expect(th.className).toMatch(/px-3/);
    expect(th.className).toMatch(/py-2/);
    expect(td.className).toMatch(/px-3/);
    expect(td.className).toMatch(/py-2/);
  });

  it('non-compact mode applies larger padding to header and cell', () => {
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
    const th = container.querySelector('th')!;
    const td = container.querySelector('td')!;
    expect(th.className).toMatch(/px-4/);
    expect(th.className).toMatch(/py-3/);
    expect(td.className).toMatch(/px-4/);
    expect(td.className).toMatch(/py-3/);
  });

  it('striped mode applies even-row background class', () => {
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
    // Both rows should carry the even: stripe class
    rows.forEach((row) => {
      expect(row.className).toMatch(/even:/);
    });
  });

  it('TableHeader align="center" applies text-center class', () => {
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
    expect(container.querySelector('th')).toHaveClass('text-center');
  });

  it('TableHeader align="right" applies text-right class', () => {
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
    expect(container.querySelector('th')).toHaveClass('text-right');
  });

  it('TableCell align="center" applies text-center class', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="center">Centro</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector('td')).toHaveClass('text-center');
  });

  it('Table forwards className to the wrapper div', () => {
    const { container } = render(
      <Table className="my-custom-class">
        <TableBody />
      </Table>
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
