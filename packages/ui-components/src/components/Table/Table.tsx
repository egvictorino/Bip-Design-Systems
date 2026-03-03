import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';

interface TableContextValue {
  striped: boolean;
  compact: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = (): TableContextValue => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('TableHead, TableBody, TableRow, TableHeader, and TableCell must be used inside <Table>');
  return ctx;
};

// ─── Table ───────────────────────────────────────────────────────────────────

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  striped?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  striped = false,
  compact = false,
  className,
  children,
  ...props
}) => (
  <TableContext.Provider value={{ striped, compact }}>
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg border border-interaction-tertiary-default',
        className
      )}
      {...props}
    >
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  </TableContext.Provider>
);

// ─── TableHead ───────────────────────────────────────────────────────────────

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ className, children, ...props }) => (
  <thead className={cn('bg-interaction-tertiary-default', className)} {...props}>
    {children}
  </thead>
);

// ─── TableBody ───────────────────────────────────────────────────────────────

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ className, children, ...props }) => (
  <tbody
    className={cn('border-t border-interaction-tertiary-hover', className)}
    {...props}
  >
    {children}
  </tbody>
);

// ─── TableRow ────────────────────────────────────────────────────────────────

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ selected = false, className, children, ...props }) => {
  const { striped } = useTableContext();

  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(
        'border-t border-interaction-tertiary-default transition-colors first:border-t-0',
        selected ? 'bg-interaction-selected' : 'hover:bg-interaction-tertiary-default/50',
        !selected && striped && 'even:bg-interaction-tertiary-default/30',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// ─── TableHeader ─────────────────────────────────────────────────────────────

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const alignStyles: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' | null }> = ({ direction }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={cn(
      'w-3.5 h-3.5 shrink-0',
      direction ? 'text-interaction-primary-default' : 'text-text-secondary'
    )}
    aria-hidden="true"
  >
    {direction === 'asc' ? (
      <path
        d="M8 11.5L3.5 6.5h9L8 11.5z"
        fill="currentColor"
        transform="rotate(180 8 8)"
      />
    ) : direction === 'desc' ? (
      <path d="M8 11.5L3.5 6.5h9L8 11.5z" fill="currentColor" />
    ) : (
      <>
        <path d="M8 4.5L5 8h6L8 4.5z" fill="currentColor" />
        <path d="M8 11.5L5 8h6L8 11.5z" fill="currentColor" />
      </>
    )}
  </svg>
);

export const TableHeader: React.FC<TableHeaderProps> = ({
  sortable = false,
  sortDirection = null,
  onSort,
  align = 'left',
  className,
  children,
  ...props
}) => {
  const { compact } = useTableContext();
  const padding = compact ? 'px-3 py-2' : 'px-4 py-3';

  const ariaSort = sortable
    ? sortDirection === 'asc'
      ? 'ascending'
      : sortDirection === 'desc'
        ? 'descending'
        : 'none'
    : undefined;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
    if (sortable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSort?.();
    }
  };

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      tabIndex={sortable ? 0 : undefined}
      className={cn(
        padding,
        'text-xs font-semibold uppercase tracking-wide whitespace-nowrap',
        'text-text-secondary',
        alignStyles[align],
        sortable &&
          'cursor-pointer select-none hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default focus-visible:ring-inset',
        className
      )}
      onClick={sortable ? onSort : undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {sortable ? (
        <span className="inline-flex items-center gap-1">
          {children}
          <SortIcon direction={sortDirection} />
        </span>
      ) : (
        children
      )}
    </th>
  );
};

// ─── TableCell ───────────────────────────────────────────────────────────────

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({
  align = 'left',
  className,
  children,
  ...props
}) => {
  const { compact } = useTableContext();
  const padding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <td className={cn(padding, 'text-text-primary', alignStyles[align], className)} {...props}>
      {children}
    </td>
  );
};

Table.displayName = 'Table';
TableHead.displayName = 'TableHead';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHeader.displayName = 'TableHeader';
TableCell.displayName = 'TableCell';
