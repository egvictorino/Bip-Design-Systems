import React from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className,
  ...rest
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        {...rest}
        role="separator"
        aria-orientation="vertical"
        className={cn(styles.vertical, variant === 'dashed' && styles.dashed, className)}
      />
    );
  }

  if (label) {
    return (
      <div
        {...rest}
        role="separator"
        aria-orientation="horizontal"
        className={cn(styles.withLabel, className)}
      >
        <span className={cn(styles.line, variant === 'dashed' && styles.dashed)} />
        <span className={styles.labelText}>{label}</span>
        <span className={cn(styles.line, variant === 'dashed' && styles.dashed)} />
      </div>
    );
  }

  return (
    <hr
      {...rest}
      aria-orientation="horizontal"
      className={cn(styles.horizontal, variant === 'dashed' && styles.dashed, className)}
    />
  );
};

Divider.displayName = 'Divider';
