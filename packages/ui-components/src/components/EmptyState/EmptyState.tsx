import React from 'react';
import { cn } from '../../lib/cn';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icono o ilustración personalizada. Si se omite, se muestra un icono genérico. */
  icon?: React.ReactNode;
  /** Título principal (requerido). */
  title: string;
  /** Texto de apoyo opcional. */
  description?: string;
  /** CTA opcional — típicamente un `<Button>`. */
  action?: React.ReactNode;
  /** Controla el espaciado y tamaños de tipografía. */
  size?: 'sm' | 'md' | 'lg';
}

type SizeKey = NonNullable<EmptyStateProps['size']>;

const sizeClasses: Record<
  SizeKey,
  { wrapper: string; iconBox: string; title: string; description: string; action: string }
> = {
  sm: {
    wrapper:     styles.sm,
    iconBox:     styles.iconBoxSm,
    title:       styles.titleSm,
    description: styles.descriptionSm,
    action:      styles.actionSm,
  },
  md: {
    wrapper:     styles.md,
    iconBox:     styles.iconBoxMd,
    title:       styles.titleMd,
    description: styles.descriptionMd,
    action:      styles.actionMd,
  },
  lg: {
    wrapper:     styles.lg,
    iconBox:     styles.iconBoxLg,
    title:       styles.titleLg,
    description: styles.descriptionLg,
    action:      styles.actionLg,
  },
};

const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
    <path d="M6 22h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 22v16M31 22v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M16 10V8a2 2 0 012-2h12a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  ...props
}) => {
  const sz = sizeClasses[size];

  return (
    <div
      className={cn(styles.emptyState, sz.wrapper, className)}
      {...props}
    >
      <div className={cn(styles.iconBox, sz.iconBox)} aria-hidden="true">
        {icon ?? <DefaultIcon className={styles.iconFull} />}
      </div>

      <p className={cn(styles.title, sz.title)}>{title}</p>

      {description && (
        <p className={cn(styles.description, sz.description)}>{description}</p>
      )}

      {action && <div className={sz.action}>{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
