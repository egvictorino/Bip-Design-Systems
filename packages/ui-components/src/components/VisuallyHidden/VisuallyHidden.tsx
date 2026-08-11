import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, className, ...props }, ref) => (
    <span ref={ref} className={cn(styles.hidden, className)} {...props}>
      {children}
    </span>
  )
);
VisuallyHidden.displayName = 'VisuallyHidden';
