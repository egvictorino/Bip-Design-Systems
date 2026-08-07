"use client";

import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Table.module.css';

interface TableContextValue {
  striped: boolean;
  compact: boolean;
  stickyHeader: boolean;
  inHead: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

const useTableContext = (): TableContextValue => {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error(
      'TableHead, TableBody, TableRow, TableHeader, TableCell, and TableEmpty must be used inside <Table>'
    );
  return ctx;
};

// ─── Table ───────────────────────────────────────────────────────────────────

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  striped?: boolean;
  compact?: boolean;
  caption?: string;
  stickyHeader?: boolean;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  striped = false,
  compact = false,
  caption,
  stickyHeader = false,
  className,
  children,
  ...props
}) => (
  <TableContext.Provider value={{ striped, compact, stickyHeader, inHead: false }}>
    <div className={cn(styles.wrapper, className)} {...props}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        {children}
      </table>
    </div>
  </TableContext.Provider>
);

// ─── TableHead ───────────────────────────────────────────────────────────────

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ className, children, ...props }) => {
  const ctx = useTableContext();
  return (
    <TableContext.Provider value={{ ...ctx, inHead: true }}>
      <thead
        className={cn(styles.thead, ctx.stickyHeader && styles.theadSticky, className)}
        {...props}
      >
        {children}
      </thead>
    </TableContext.Provider>
  );
};

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
  clickable?: boolean;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  selected = false,
  clickable = false,
  className,
  children,
  ...props
}) => {
  const { striped, inHead } = useTableContext();

  return (
    <tr
      aria-selected={!inHead && selected ? true : undefined}
      className={cn(
        styles.row,
        selected
          ? styles.rowSelected
          : cn(styles.rowHoverable, !selected && striped && styles.rowStriped),
        clickable && styles.rowClickable,
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
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
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
      <path d="M8 4.5L3.5 9.5h9L8 4.5z" fill="currentColor" />
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
  scope = 'col',
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
      scope={scope}
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

// ─── TableEmpty ──────────────────────────────────────────────────────────────

export interface TableEmptyProps {
  colSpan: number;
  children?: React.ReactNode;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({ colSpan, children }) => {
  const { compact } = useTableContext();
  const t = useBipLocale();
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(styles.tdEmpty, compact ? styles.tdCompact : styles.tdNormal)}
      >
        {children ?? t.table.emptyMessage}
      </td>
    </tr>
  );
};

Table.displayName = 'Table';
TableHead.displayName = 'TableHead';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHeader.displayName = 'TableHeader';
TableCell.displayName = 'TableCell';
TableEmpty.displayName = 'TableEmpty';
