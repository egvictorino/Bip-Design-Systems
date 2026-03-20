import React from 'react';
import { cn } from '../../lib/cn';

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
        className={cn(
          'self-stretch w-px border-l border-edge',
          variant === 'dashed' && 'border-dashed',
          className
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center gap-3', className)}
      >
        <span
          className={cn('flex-1 border-t border-edge', variant === 'dashed' && 'border-dashed')}
        />
        <span className="text-xs text-txt-secondary whitespace-nowrap">{label}</span>
        <span
          className={cn('flex-1 border-t border-edge', variant === 'dashed' && 'border-dashed')}
        />
      </div>
    );
  }

  return (
    <hr
      aria-orientation="horizontal"
      className={cn('border-t border-edge my-0', variant === 'dashed' && 'border-dashed', className)}
    />
  );
};

Divider.displayName = 'Divider';
