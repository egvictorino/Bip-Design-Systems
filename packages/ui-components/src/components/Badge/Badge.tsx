import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Badge.module.css';
import type { BipSize } from '../../types/size.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: BipSize;
  dot?: boolean;
  children: React.ReactNode;
}

const dotVariantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: styles.dotPrimary,
  success: styles.dotSuccess,
  warning: styles.dotWarning,
  danger:  styles.dotDanger,
  neutral: styles.dotNeutral,
};

const dotSizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: styles.dotSm,
  md: styles.dotMd,
  lg: styles.dotLg,
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', dot = false, className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
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
  }
);

Badge.displayName = 'Badge';
