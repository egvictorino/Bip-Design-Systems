import React from 'react';
import { cn } from '../../lib/cn';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

const positionStyles: Record<
  NonNullable<TooltipProps['position']>,
  { tooltip: string; arrow: string }
> = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'absolute left-1/2 -translate-x-1/2 top-full -mt-1 h-2 w-2 rotate-45 bg-text-primary',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'absolute left-1/2 -translate-x-1/2 bottom-full -mb-1 h-2 w-2 rotate-45 bg-text-primary',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'absolute top-1/2 -translate-y-1/2 left-full -ml-1 h-2 w-2 rotate-45 bg-text-primary',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'absolute top-1/2 -translate-y-1/2 right-full -mr-1 h-2 w-2 rotate-45 bg-text-primary',
  },
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className,
}) => {
  const id = React.useId();
  const { tooltip, arrow } = positionStyles[position];

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        'aria-describedby': id,
      })
    : children;

  return (
    <span className={cn('relative inline-flex group', className)}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 max-w-xs rounded bg-text-primary px-2.5 py-1.5 text-xs font-medium text-text-white shadow-sm',
          'invisible opacity-0 transition-opacity duration-150',
          'group-hover:visible group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:opacity-100',
          tooltip
        )}
      >
        {content}
        <span aria-hidden="true" className={arrow} />
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
