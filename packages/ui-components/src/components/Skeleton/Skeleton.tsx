import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  lines?: number;
  className?: string;
}

const variantStyles = {
  text: 'h-4 w-full rounded-sm',
  circle: 'h-10 w-10 rounded-full shrink-0',
  rect: 'h-32 w-full rounded-md',
};

const baseClass = 'animate-pulse bg-interaction-tertiary-default';

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  lines = 1,
  className,
}) => {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="flex flex-col gap-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              baseClass,
              'h-4 rounded-sm',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={clsx(baseClass, variantStyles[variant], className)}
    />
  );
};
