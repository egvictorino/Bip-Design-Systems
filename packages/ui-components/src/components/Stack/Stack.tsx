import React, { type ElementType, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Stack.module.css';

export type StackGap = '0' | '0-5' | '1' | '1-5' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';
export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  children: ReactNode;
}

const gapClass: Record<StackGap, string> = {
  '0': styles.gap0,
  '0-5': styles.gap0_5,
  '1': styles.gap1,
  '1-5': styles.gap1_5,
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

const alignClass: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const justifyClass: Record<StackJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
  evenly: styles.justifyEvenly,
};

/** Layout primitive for one-dimensional flex arrangements — see also `Grid` for two-dimensional layouts. */
export const Stack: React.FC<StackProps> = ({
  as: Component = 'div',
  direction = 'column',
  gap = '4',
  align,
  justify,
  wrap = false,
  className,
  children,
  ...props
}) => (
  <Component
    className={cn(
      styles.stack,
      direction === 'row' ? styles.row : styles.column,
      gapClass[gap],
      align && alignClass[align],
      justify && justifyClass[justify],
      wrap && styles.wrap,
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

Stack.displayName = 'Stack';
