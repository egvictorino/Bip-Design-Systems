import React from 'react';
import { cn } from '../../lib/cn';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  value?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  className?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  variant = 'default',
  size = 'md',
  label,
  showValue = false,
  indeterminate = false,
  className,
  id,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && !indeterminate && (
            <span className={styles.valueText}>{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        id={id}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progreso'}
        aria-busy={indeterminate || undefined}
        className={cn(styles.track, styles[size])}
      >
        {indeterminate ? (
          <div
            className={cn(styles.indeterminate, styles[variant])}
            aria-hidden="true"
          />
        ) : (
          <div
            className={cn(styles.fill, styles[variant])}
            style={{ width: `${clampedValue}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
