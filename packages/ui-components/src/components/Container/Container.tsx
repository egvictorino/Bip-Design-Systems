import React, { type ElementType, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Container.module.css';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Matches the `BREAKPOINTS` scale (`sm`/`md`/`lg`/`xl`) — see `src/styles/breakpoints.ts`. `'full'` removes the cap. */
  maxWidth?: ContainerMaxWidth;
  children: ReactNode;
}

const maxWidthClass: Record<ContainerMaxWidth, string> = {
  sm: styles.maxWidthSm,
  md: styles.maxWidthMd,
  lg: styles.maxWidthLg,
  xl: styles.maxWidthXl,
  full: styles.maxWidthFull,
};

/** Centers content and caps its width — the outermost layout primitive, wraps `Stack`/`Grid` compositions. */
export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  maxWidth = 'lg',
  className,
  children,
  ...props
}) => (
  <Component className={cn(styles.container, maxWidthClass[maxWidth], className)} {...props}>
    {children}
  </Component>
);

Container.displayName = 'Container';
