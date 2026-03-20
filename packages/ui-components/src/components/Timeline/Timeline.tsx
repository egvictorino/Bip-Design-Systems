import React from 'react';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimelineItemProps {
  date?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  className?: string;
}

export interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const dotVariants: Record<NonNullable<TimelineItemProps['variant']>, string> = {
  default: 'bg-primary border-primary',
  success: 'bg-success border-success',
  warning: 'bg-warning border-warning',
  error: 'bg-danger border-danger',
};

// ─── TimelineItem ─────────────────────────────────────────────────────────────

export const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  icon,
  variant = 'default',
  children,
  className,
}) => (
  <div className={cn('flex gap-4', className)}>
    {/* Left column: dot + connecting line */}
    <div className="flex flex-col items-center shrink-0">
      {icon ? (
        <div
          className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0',
            dotVariants[variant]
          )}
          aria-hidden="true"
        >
          <span className="text-txt-white text-xs">{icon}</span>
        </div>
      ) : (
        <div
          className={cn('w-3 h-3 rounded-full border-2 shrink-0 mt-0.5', dotVariants[variant])}
          aria-hidden="true"
        />
      )}
      {/* Vertical connector — hidden for last item via parent selector */}
      <div className="timeline-line flex-1 w-px bg-edge mt-2" />
    </div>

    {/* Right column: content */}
    <div className="pb-6 flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-txt">{title}</span>
        {date && (
          <time className="text-xs text-txt-secondary shrink-0 mt-0.5">{date}</time>
        )}
      </div>
      {description && <p className="text-xs text-txt-secondary mt-1">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  </div>
);

TimelineItem.displayName = 'TimelineItem';

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => (
  <div
    className={cn(
      'flex flex-col',
      // Hide the vertical line inside the last TimelineItem
      '[&>*:last-child_.timeline-line]:hidden',
      className
    )}
  >
    {children}
  </div>
);

Timeline.displayName = 'Timeline';
