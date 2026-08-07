import React from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Spinner.module.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'danger' | 'success' | 'info';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  speed,
  label = 'Cargando...',
  className,
  ...props
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(styles.spinner, className)}
      {...props}
    >
      <svg
        className={cn(styles.svg, styles[size], styles[variant], speed && styles[speed])}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className={styles.trackCircle}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={styles.fillPath}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
};

Spinner.displayName = 'Spinner';
