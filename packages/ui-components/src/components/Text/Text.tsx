import React, { type ElementType, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Text.module.css';

export type TextSize = '3xs' | '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor =
  | 'default'
  | 'secondary'
  | 'utility'
  | 'disabled'
  | 'important'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'link';
export type TextAlign = 'start' | 'center' | 'end';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  /** Single-line ellipsis truncation — the element needs a bounded width to take effect. */
  truncate?: boolean;
  children: ReactNode;
}

const sizeClass: Record<TextSize, string> = {
  '3xs': styles.size3xs,
  '2xs': styles.size2xs,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  base: styles.sizeBase,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  '2xl': styles.size2xl,
};

const weightClass: Record<TextWeight, string> = {
  normal: styles.weightNormal,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

const colorClass: Record<TextColor, string> = {
  default: styles.colorDefault,
  secondary: styles.colorSecondary,
  utility: styles.colorUtility,
  disabled: styles.colorDisabled,
  important: styles.colorImportant,
  danger: styles.colorDanger,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  info: styles.colorInfo,
  link: styles.colorLink,
};

const alignClass: Record<TextAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
};

/** Typography primitive for body text — see `Heading` for semantic headings with independent visual size. */
export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align,
  truncate = false,
  className,
  children,
  ...props
}) => (
  <Component
    className={cn(
      sizeClass[size],
      weightClass[weight],
      colorClass[color],
      align && alignClass[align],
      truncate && styles.truncate,
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

Text.displayName = 'Text';
