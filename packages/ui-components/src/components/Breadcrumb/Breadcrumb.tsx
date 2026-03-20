import React from 'react';
import { cn } from '../../lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-3.5 h-3.5 shrink-0 text-txt-disabled"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06L7.28 11.78a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  className,
  ...props
}) => {
  return (
    // aria-label first so consumers can override it via ...props (e.g. for i18n)
    <nav aria-label="Breadcrumb" {...props} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (separator ?? <ChevronIcon />)}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-txt max-w-[240px] truncate"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    'max-w-[200px] truncate text-txt-secondary hover:text-txt transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded'
                  )}
                >
                  {item.label}
                </a>
              ) : (
                // No href on a non-current item: render as non-interactive span
                // (an <a href="#"> would be a misleading dead link)
                <span className="max-w-[200px] truncate text-txt-secondary">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
