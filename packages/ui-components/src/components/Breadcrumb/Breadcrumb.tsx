import React from 'react';
import styles from './Breadcrumb.module.css';

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
    className={styles.chevron}
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
    <nav aria-label="Breadcrumb" {...props} className={className}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {index > 0 && (separator ?? <ChevronIcon />)}
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <span className={styles.nonLink}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
