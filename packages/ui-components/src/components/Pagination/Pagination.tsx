import React from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  disabled?: boolean;
}

function getPageRange(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | '...')[] {
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftIndex = Math.max(page - siblingCount, 1);
  const rightIndex = Math.min(page + siblingCount, totalPages);

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
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  disabled = false,
}) => {
  const t = useBipLocale();

  if (totalPages <= 1) return null;

  const pageRange = getPageRange(page, totalPages, siblingCount);

  return (
    <nav aria-label={t.pagination.nav} className={cn(styles.nav, className)}>
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page === 1}
        aria-label={t.pagination.prevPage}
        className={cn(styles.btn, disabled || page === 1 ? styles.btnDisabled : styles.btnDefault)}
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
      {pageRange.map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum as number)}
            disabled={disabled}
            aria-label={t.pagination.page(pageNum)}
            aria-current={page === pageNum ? 'page' : undefined}
            className={cn(
              styles.btn,
              disabled ? styles.btnDisabled : page === pageNum ? styles.btnActive : styles.btnDefault
            )}
          >
            {pageNum}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page === totalPages}
        aria-label={t.pagination.nextPage}
        className={cn(
          styles.btn,
          disabled || page === totalPages ? styles.btnDisabled : styles.btnDefault
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
