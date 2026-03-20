import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../Table';
import { Pagination } from '../Pagination';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import { SearchInput } from '../SearchInput';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
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
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

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
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset to first page when data or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchQuery]);

  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim() || !searchKeys?.length) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = (row as Record<string, unknown>)[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchable, searchQuery, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal === bVal) return 0;
      const cmp = String(aVal).localeCompare(String(bVal), 'es-MX', { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedData, currentPage, pageSize]
  );

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortKey(null);
      setSortDirection(null);
    }
  };

  const getSortDirection = (key: string): 'asc' | 'desc' | null => {
    if (sortKey !== key) return null;
    return sortDirection;
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {searchable && (
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder={searchPlaceholder}
        />
      )}
      <Table striped={striped} compact={compact}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
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
            // Loading skeleton rows
            Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                className="py-0"
              >
                <EmptyState title={emptyMessage} size="sm" />
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const key = keyExtractor
                ? keyExtractor(row, (currentPage - 1) * pageSize + rowIndex)
                : (currentPage - 1) * pageSize + rowIndex;

              return (
                <TableRow
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((col) => (
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
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

DataTable.displayName = 'DataTable';
