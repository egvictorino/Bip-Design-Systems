import React from 'react';
import { cn } from '../../lib/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | '...')[] {
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftIndex = Math.max(currentPage - siblingCount, 1);
  const rightIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftIndex > 2;
  const showRightDots = rightIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
    );
    return [1, '...', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightIndex - leftIndex + 1 },
    (_, i) => leftIndex + i
  );
  return [1, '...', ...middleRange, '...', totalPages];
}

const BASE_BTN = cn(
  'inline-flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
);
const BTN_ACTIVE = 'bg-primary text-txt-white';
const BTN_DEFAULT = cn(
  'text-txt-secondary hover:text-txt',
  'hover:bg-surface-3'
);
const BTN_DISABLED = 'opacity-40 cursor-not-allowed text-txt-secondary';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pageRange = getPageRange(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label="Paginación" className={cn('flex items-center gap-1', className)}>
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className={cn(BASE_BTN, currentPage === 1 ? BTN_DISABLED : BTN_DEFAULT)}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Pages */}
      {pageRange.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-8 w-8 items-center justify-center text-txt-secondary"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(BASE_BTN, currentPage === page ? BTN_ACTIVE : BTN_DEFAULT)}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className={cn(BASE_BTN, currentPage === totalPages ? BTN_DISABLED : BTN_DEFAULT)}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
