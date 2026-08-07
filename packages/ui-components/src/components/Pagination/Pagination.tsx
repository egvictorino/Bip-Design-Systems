import React from 'react';
import { cn } from '../../lib/cn';
import { useBipLocale } from '../../i18n';
import styles from './Pagination.module.css';

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

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  const t = useBipLocale();

  if (totalPages <= 1) return null;

  const pageRange = getPageRange(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label={t.pagination.nav} className={cn(styles.nav, className)}>
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t.pagination.prevPage}
        className={cn(styles.btn, currentPage === 1 ? styles.btnDisabled : styles.btnDefault)}
      >
        <svg viewBox="0 0 16 16" fill="none" className={styles.arrowIcon} aria-hidden="true">
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
          <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-label={t.pagination.page(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(styles.btn, currentPage === page ? styles.btnActive : styles.btnDefault)}
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
        aria-label={t.pagination.nextPage}
        className={cn(
          styles.btn,
          currentPage === totalPages ? styles.btnDisabled : styles.btnDefault
        )}
      >
        <svg viewBox="0 0 16 16" fill="none" className={styles.arrowIcon} aria-hidden="true">
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
