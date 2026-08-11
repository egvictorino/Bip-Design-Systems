import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Skeleton.module.css';
import type { BipSize } from '../../types/size.js';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect';
  lines?: number;
  size?: BipSize;
  animation?: 'pulse' | 'wave' | 'none';
  width?: string;
  height?: string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      lines = 1,
      size = 'md',
      animation = 'pulse',
      width,
      height,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const mergedStyle: React.CSSProperties | undefined =
      width || height
        ? { ...(width && { width }), ...(height && { height }), ...style }
        : style;

    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={cn(styles.multiline, className)}
          style={mergedStyle}
          {...props}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                styles.base,
                styles.text,
                styles[size],
                styles[animation],
                i === lines - 1 ? styles.lineShort : styles.lineFull
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(styles.base, styles[variant], styles[size], styles[animation], className)}
        style={mergedStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
