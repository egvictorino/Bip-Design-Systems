import React, { useContext } from 'react';
import { cn } from '../../lib/cn';

interface TableContextValue {
  striped: boolean;
  compact: boolean;
}

const TableContext = React.createContext<TableContextValue>({ striped: false, compact: false });

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
  children: React.ReactNode;
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
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ className, children, ...props }) => {
  const { striped } = useContext(TableContext);

  return (
    <tr
      className={cn(
        'border-t border-interaction-tertiary-default transition-colors first:border-t-0',
        'hover:bg-interaction-tertiary-default/50',
        striped && 'even:bg-interaction-tertiary-default/30',
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

const alignStyles = {
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
  const { compact } = useContext(TableContext);
  const padding = compact ? 'px-3 py-2' : 'px-4 py-3';

  const ariaSort = sortable
    ? sortDirection === 'asc'
      ? 'ascending'
      : sortDirection === 'desc'
        ? 'descending'
        : 'none'
    : undefined;

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cn(
        padding,
        'text-xs font-semibold uppercase tracking-wide whitespace-nowrap',
        'text-text-secondary',
        alignStyles[align],
        sortable && 'cursor-pointer select-none hover:text-text-primary',
        className
      )}
      onClick={sortable ? onSort : undefined}
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
  const { compact } = useContext(TableContext);
  const padding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <td className={cn(padding, 'text-text-primary', alignStyles[align], className)} {...props}>
      {children}
    </td>
  );
};
