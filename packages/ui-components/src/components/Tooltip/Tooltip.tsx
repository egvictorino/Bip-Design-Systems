import React from 'react';
import { cn } from '../../lib/cn';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className,
}) => {
  const id = React.useId();

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        'aria-describedby': id,
      })
    : children;

  return (
    <span className={cn(styles.wrapper, className)}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cn(styles.tooltip, styles[position])}
      >
        {content}
        <span aria-hidden="true" className={styles.arrow} />
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
