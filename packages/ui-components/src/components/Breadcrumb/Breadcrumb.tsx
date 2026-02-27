import React from 'react';
import clsx from 'clsx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-3.5 h-3.5 shrink-0 text-text-disabled"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06L7.28 11.78a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (separator ?? <ChevronIcon />)}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-text-primary max-w-[240px] truncate"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href ?? '#'}
                  className={clsx(
                    'text-text-secondary hover:text-text-primary transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default rounded'
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
