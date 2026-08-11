import React, { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type HeadingWeight = 'semibold' | 'bold';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Controls the semantic element (`h1`–`h6`) — independent from the visual `size`. */
  level: HeadingLevel;
  /** Visual size. Defaults to a sensible size for `level` (h1→2xl … h6→xs) — override to decouple visual weight from document structure. */
  size?: HeadingSize;
  weight?: HeadingWeight;
  /** Override the rendered element without changing the accessible heading level (e.g. a styled `<div role="heading">`). */
  as?: ElementType;
  children: ReactNode;
}

const DEFAULT_SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: '2xl',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'xs',
};

const sizeClass: Record<HeadingSize, string> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  '2xl': styles.size2xl,
};

const weightClass: Record<HeadingWeight, string> = {
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

/** Semantic heading with a visual size independent of document level — see `Text` for body copy. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, weight = 'semibold', as, className, children, ...props }, ref) => {
    const Component = as ?? (`h${level}` as ElementType);
    const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];

    return (
      <Component
        ref={ref}
        className={cn(styles.heading, sizeClass[resolvedSize], weightClass[weight], className)}
        {...(as ? { role: 'heading', 'aria-level': level } : {})}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';
