import React, { type ElementType, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Grid.module.css';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Número de columnas fijo, o `'responsive'` para `repeat(auto-fill, minmax(16rem, 1fr))`. */
  columns?: GridColumns | 'responsive';
  gap?: GridGap;
  children: ReactNode;
}

const columnsClass: Record<GridColumns | 'responsive', string> = {
  1: styles.cols1,
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
  5: styles.cols5,
  6: styles.cols6,
  12: styles.cols12,
  responsive: styles.colsResponsive,
};

const gapClass: Record<GridGap, string> = {
  '0': styles.gap0,
  '1': styles.gap1,
  '2': styles.gap2,
  '3': styles.gap3,
  '4': styles.gap4,
  '5': styles.gap5,
  '6': styles.gap6,
  '8': styles.gap8,
  '10': styles.gap10,
  '12': styles.gap12,
  '16': styles.gap16,
};

/** Two-dimensional layout primitive. Fixed `columns` is 1 column below `md` (768px, mobile-first) — see `src/styles/breakpoints.ts`. */
export const Grid: React.FC<GridProps> = ({
  as: Component = 'div',
  columns = 'responsive',
  gap = '4',
  className,
  children,
  ...props
}) => (
  <Component
    className={cn(styles.grid, columnsClass[columns], gapClass[gap], className)}
    {...props}
  >
    {children}
  </Component>
);

Grid.displayName = 'Grid';
