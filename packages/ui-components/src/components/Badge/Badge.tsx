import React from 'react';
import { cn } from '../../lib/cn';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: React.ReactNode;
}

const dotVariantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: styles.dotPrimary,
  success: styles.dotSuccess,
  warning: styles.dotWarning,
  error:   styles.dotError,
  neutral: styles.dotNeutral,
};

const dotSizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: styles.dotSm,
  md: styles.dotMd,
  lg: styles.dotLg,
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
      className={cn(styles.badge, styles[variant], styles[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(styles.dot, dotVariantClasses[variant], dotSizeClasses[size])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
