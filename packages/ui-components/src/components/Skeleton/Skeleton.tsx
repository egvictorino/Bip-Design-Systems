import React from 'react';
import { cn } from '../../lib/cn';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  lines?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  lines = 1,
  className,
}) => {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.multiline} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              styles.base,
              styles.text,
              i === lines - 1 ? styles.lineShort : styles.lineFull,
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(styles.base, styles[variant], className)}
    />
  );
};

Skeleton.displayName = 'Skeleton';
