import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../Table';
import { Pagination } from '../Pagination';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import { SearchInput } from '../SearchInput';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { cn } from '../../lib/cn';
import styles from './DataTable.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export type SortDirection = 'asc' | 'desc' | null;

export interface BulkAction<T = Record<string, unknown>> {
  label: string;
  onClick: (selectedRows: T[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  compact?: boolean;
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T, index: number) => string | number;
  // Search
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  // Selection
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  bulkActions?: BulkAction<T>[];
  // Server-side
  serverSide?: boolean;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (key: string | null, direction: SortDirection) => void;
  onSearchChange?: (query: string) => void;
  // Column visibility
  columnVisibility?: boolean;
  defaultHiddenColumns?: string[];
  // ARIA / layout
  label?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  striped = false,
  compact = false,
  onRowClick,
  keyExtractor,
  searchable = false,
  searchKeys,
  searchPlaceholder = 'Buscar...',
  selectable = false,
  onSelectionChange,
  bulkActions,
  serverSide = false,
  totalCount,
  onPageChange,
  onSortChange,
  onSearchChange,
  columnVisibility = false,
  defaultHiddenColumns,
  label,
  className,
}: DataTableProps<T>) {
  // ─── Sort state ───────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // ─── Pagination state ─────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Search state ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Selection state ──────────────────────────────────────────────────────
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());

  // ─── Column visibility state ───────────────────────────────────────────────
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(
    () =>
      new Set(
        columns
          .filter((col) => !defaultHiddenColumns?.includes(col.key))
          .map((col) => col.key)
      )
  );
  const [colPanelOpen, setColPanelOpen] = useState(false);
  const colPanelRef = useRef<HTMLDivElement>(null);
  const colPanelId = useId();

  // ─── Reset page on data/search change ─────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchQuery]);

  // ─── Clear selection when data changes ────────────────────────────────────
  useEffect(() => {
    setSelectedKeys(new Set());
  }, [data]);

  // ─── Notify selection changes ─────────────────────────────────────────────
  useEffect(() => {
    if (!onSelectionChange) return;
    const selectedRows = data.filter((row, i) => {
      const k = keyExtractor ? keyExtractor(row, i) : i;
      return selectedKeys.has(k);
    });
    onSelectionChange(selectedRows);
  }, [selectedKeys, data, keyExtractor, onSelectionChange]);

  // ─── Close column panel on outside click ──────────────────────────────────
  useEffect(() => {
    if (!colPanelOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (colPanelRef.current && !colPanelRef.current.contains(e.target as Node)) {
        setColPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [colPanelOpen]);

  // ─── Active columns (after visibility filter) ─────────────────────────────
  const activeColumns = useMemo(
    () => (columnVisibility ? columns.filter((col) => visibleColumnKeys.has(col.key)) : columns),
    [columns, columnVisibility, visibleColumnKeys]
  );

  // ─── Filtered data ────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (serverSide) return data;
    if (!searchable || !searchQuery.trim() || !searchKeys?.length) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = (row as Record<string, unknown>)[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, serverSide, searchable, searchQuery, searchKeys]);

  // ─── Sorted data ──────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (serverSide || !sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), 'es-MX', { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, serverSide, sortKey, sortDirection]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalRows = serverSide ? (totalCount ?? data.length) : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const paginatedData = useMemo(
    () =>
      serverSide
        ? sortedData
        : sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, serverSide, currentPage, pageSize]
  );

  // ─── Selection derived values ─────────────────────────────────────────────
  const pageKeys = useMemo(
    () =>
      paginatedData.map((row, i) =>
        keyExtractor
          ? keyExtractor(row, (currentPage - 1) * pageSize + i)
          : (currentPage - 1) * pageSize + i
      ),
    [paginatedData, keyExtractor, currentPage, pageSize]
  );

  const allPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.has(k));
  const somePageSelected = !allPageSelected && pageKeys.some((k) => selectedKeys.has(k));

  const getSelectedRows = useCallback(
    () =>
      data.filter((row, i) => {
        const k = keyExtractor ? keyExtractor(row, i) : i;
        return selectedKeys.has(k);
      }),
    [data, keyExtractor, selectedKeys]
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSort = (key: string) => {
    let newKey: string | null;
    let newDir: SortDirection;
    if (sortKey !== key) {
      newKey = key;
      newDir = 'asc';
    } else if (sortDirection === 'asc') {
      newKey = key;
      newDir = 'desc';
    } else {
      newKey = null;
      newDir = null;
    }
    setSortKey(newKey);
    setSortDirection(newDir);
    if (serverSide) onSortChange?.(newKey, newDir);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (serverSide) onSearchChange?.(q);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (serverSide) onPageChange?.(page, pageSize);
  };

  const handleHeaderCheckbox = () => {
    if (allPageSelected) {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        pageKeys.forEach((k) => next.delete(k));
        return next;
      });
    } else {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        pageKeys.forEach((k) => next.add(k));
        return next;
      });
    }
  };

  const handleRowCheckbox = (key: string | number) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getSortDirection = (key: string): SortDirection => {
    if (sortKey !== key) return null;
    return sortDirection;
  };

  const colSpan = activeColumns.length + (selectable ? 1 : 0);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      aria-label={label || undefined}
      role={label ? 'region' : undefined}
      className={cn(styles.root, className)}
    >
      {/* Screen reader live region — announces result count changes */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {!loading && `${paginatedData.length} de ${sortedData.length} resultados`}
      </span>

      {/* Toolbar: Search + Column visibility */}
      {(searchable || columnVisibility) && (
        <div className={styles.toolbar}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <SearchInput
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onClear={() => handleSearch('')}
                placeholder={searchPlaceholder}
              />
            </div>
          )}
          {columnVisibility && (
            <div className={styles.colVisibilityWrapper} ref={colPanelRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setColPanelOpen((p) => !p)}
                aria-expanded={colPanelOpen}
                aria-controls={colPanelId}
              >
                Columnas
              </Button>
              {colPanelOpen && (
                <div
                  id={colPanelId}
                  role="dialog"
                  aria-label="Visibilidad de columnas"
                  className={styles.colPanel}
                >
                  {columns.map((col) => (
                    <Checkbox
                      key={col.key}
                      label={col.header}
                      size="sm"
                      checked={visibleColumnKeys.has(col.key)}
                      onChange={() =>
                        setVisibleColumnKeys((prev) => {
                          const next = new Set(prev);
                          if (next.has(col.key)) next.delete(col.key);
                          else next.add(col.key);
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bulk actions toolbar — visible when rows are selected */}
      {selectable && selectedKeys.size > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>
            {selectedKeys.size} seleccionado{selectedKeys.size !== 1 ? 's' : ''}
          </span>
          <div className={styles.bulkActions}>
            {bulkActions?.map((action, i) => (
              <Button
                key={i}
                size="sm"
                variant={action.variant ?? 'secondary'}
                onClick={() => action.onClick(getSelectedRows())}
              >
                {action.label}
              </Button>
            ))}
            <Button size="sm" variant="secondary" onClick={() => setSelectedKeys(new Set())}>
              Limpiar
            </Button>
          </div>
        </div>
      )}

      <Table striped={striped} compact={compact}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableHeader style={{ width: '40px' }}>
                <Checkbox
                  checked={allPageSelected}
                  indeterminate={somePageSelected}
                  onChange={handleHeaderCheckbox}
                  aria-label="Seleccionar todas las filas de esta página"
                />
              </TableHeader>
            )}
            {activeColumns.map((col) => (
              <TableHeader
                key={col.key}
                sortable={col.sortable}
                sortDirection={getSortDirection(col.key)}
                onSort={col.sortable ? () => handleSort(col.key) : undefined}
                align={col.align}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {selectable && (
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                )}
                {activeColumns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} align="center" className={styles.emptyCell}>
                <EmptyState title={emptyMessage} size="sm" />
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const rowKey = keyExtractor
                ? keyExtractor(row, (currentPage - 1) * pageSize + rowIndex)
                : (currentPage - 1) * pageSize + rowIndex;

              return (
                <TableRow
                  key={rowKey}
                  selected={selectable ? selectedKeys.has(rowKey) : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? styles.rowClickable : undefined}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedKeys.has(rowKey)}
                        onChange={() => handleRowCheckbox(rowKey)}
                        aria-label={`Seleccionar fila ${rowIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {activeColumns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render
                        ? col.render((row as Record<string, unknown>)[col.key], row)
                        : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {!loading && totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

DataTable.displayName = 'DataTable';
