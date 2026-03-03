import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: React.ReactNode;
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: 'bg-feedback-info-subtle text-interaction-primary-default',
  success: 'bg-feedback-success-subtle text-feedback-success-text',
  warning: 'bg-feedback-warning-subtle text-feedback-warning-text',
  error: 'bg-feedback-error-subtle text-feedback-error-text',
  neutral: 'bg-interaction-tertiary-default text-text-secondary',
};

const dotVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: 'bg-interaction-primary-default',
  success: 'bg-feedback-success-default',
  warning: 'bg-feedback-warning-default',
  error: 'bg-feedback-error-default',
  neutral: 'bg-text-secondary',
};

const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const dotSizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('shrink-0 rounded-full', dotVariants[variant], dotSizes[size])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
