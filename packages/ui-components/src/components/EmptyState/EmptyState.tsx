import React from 'react';
import { cn } from '../../lib/cn';

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

const sizeStyles: Record<
  NonNullable<EmptyStateProps['size']>,
  { wrapper: string; iconBox: string; title: string; description: string; action: string }
> = {
  sm: {
    wrapper: 'gap-2 py-8 px-4',
    iconBox: 'w-10 h-10',
    title: 'text-sm font-semibold',
    description: 'text-xs',
    action: 'mt-2',
  },
  md: {
    wrapper: 'gap-3 py-12 px-6',
    iconBox: 'w-14 h-14',
    title: 'text-base font-semibold',
    description: 'text-sm',
    action: 'mt-3',
  },
  lg: {
    wrapper: 'gap-4 py-16 px-8',
    iconBox: 'w-20 h-20',
    title: 'text-lg font-semibold',
    description: 'text-base',
    action: 'mt-4',
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
    <path
      d="M6 22h36"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M17 22v16M31 22v16"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
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
  const styles = sizeStyles[size];

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', styles.wrapper, className)}
      {...props}
    >
      {/* Icon */}
      <div
        className={cn('text-text-secondary', styles.iconBox)}
        aria-hidden="true"
      >
        {icon ?? <DefaultIcon className="w-full h-full" />}
      </div>

      {/* Title */}
      <p className={cn('text-text-primary', styles.title)}>{title}</p>

      {/* Description */}
      {description && (
        <p className={cn('text-text-secondary max-w-xs', styles.description)}>{description}</p>
      )}

      {/* Action */}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
