import React from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(styles.vertical, variant === 'dashed' && styles.dashed, className)}
      />
    );
  }

  if (label) {
    return (
      <div
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
      aria-orientation="horizontal"
      className={cn(styles.horizontal, variant === 'dashed' && styles.dashed, className)}
    />
  );
};

Divider.displayName = 'Divider';
