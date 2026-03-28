import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import styles from './Table.module.css';

interface TableContextValue {
  striped: boolean;
  compact: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = (): TableContextValue => {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error(
      'TableHead, TableBody, TableRow, TableHeader, and TableCell must be used inside <Table>'
    );
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
    <div className={cn(styles.wrapper, className)} {...props}>
      <table className={styles.table}>{children}</table>
    </div>
  </TableContext.Provider>
);

// ─── TableHead ───────────────────────────────────────────────────────────────

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ className, children, ...props }) => (
  <thead className={cn(styles.thead, className)} {...props}>
    {children}
  </thead>
);

// ─── TableBody ───────────────────────────────────────────────────────────────

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ className, children, ...props }) => (
  <tbody className={cn(styles.tbody, className)} {...props}>
    {children}
  </tbody>
);

// ─── TableRow ────────────────────────────────────────────────────────────────

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  selected = false,
  className,
  children,
  ...props
}) => {
  const { striped } = useTableContext();

  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(
        styles.row,
        selected
          ? styles.rowSelected
          : cn(styles.rowHoverable, !selected && striped && styles.rowStriped),
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

const alignClass: Record<'left' | 'center' | 'right', string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' | null }> = ({ direction }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    className={cn(styles.sortIcon, direction && styles.sortIconActive)}
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
        styles.th,
        compact ? styles.thCompact : styles.thNormal,
        alignClass[align],
        sortable && styles.thSortable,
        className
      )}
      onClick={sortable ? onSort : undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {sortable ? (
        <span className={styles.sortableInner}>
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

  return (
    <td
      className={cn(
        styles.td,
        compact ? styles.tdCompact : styles.tdNormal,
        alignClass[align],
        className
      )}
      {...props}
    >
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
