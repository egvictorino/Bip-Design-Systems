import React from 'react';
import { cn } from '../../lib/cn';

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

const fillVariants: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-danger',
};

const trackSizes: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

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
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-txt">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-sm text-txt-secondary">{clampedValue}%</span>
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
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-surface-3',
          trackSizes[size]
        )}
      >
        {indeterminate ? (
          <>
            <style>{`
              @keyframes progressIndeterminate {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
            <div
              className={cn('absolute inset-y-0 w-1/3 rounded-full', fillVariants[variant])}
              style={{ animation: 'progressIndeterminate 1.5s ease-in-out infinite' }}
              aria-hidden="true"
            />
          </>
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-500', fillVariants[variant])}
            style={{ width: `${clampedValue}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
