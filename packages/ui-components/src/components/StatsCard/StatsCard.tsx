import React from 'react';
import { cn } from '../../lib/cn';

export interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  description,
  icon,
  className,
}) => {
  const hasTrend = trend !== undefined;
  const isPositive = hasTrend && trend > 0;
  const isNegative = hasTrend && trend < 0;

  return (
    <div className={cn('bg-white rounded-lg border border-edge p-5 flex flex-col gap-3', className)}>
      {/* Header: title + icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-txt-secondary">{title}</span>
        {icon && (
          <span className="text-txt-secondary" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value + trend */}
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-txt leading-none">{value}</span>

        {hasTrend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium mb-0.5',
              isPositive && 'text-success',
              isNegative && 'text-danger',
              !isPositive && !isNegative && 'text-txt-secondary'
            )}
            aria-label={`Tendencia: ${trend > 0 ? '+' : ''}${trend}%`}
          >
            {isPositive && (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L9 5.31V12a.75.75 0 0 1-1.5 0V5.31L4.25 8.53a.75.75 0 0 1-1.06-1.06L8 3.22z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isNegative && (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 12.78a.75.75 0 0 1-1.06 0L2.69 8.53a.75.75 0 0 1 1.06-1.06L7 10.69V4a.75.75 0 0 1 1.5 0v6.69l3.25-3.22a.75.75 0 1 1 1.06 1.06L8 12.78z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>

      {/* Description */}
      {description && <p className="text-xs text-txt-secondary">{description}</p>}
    </div>
  );
};

StatsCard.displayName = 'StatsCard';
