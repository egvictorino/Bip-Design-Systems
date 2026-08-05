"use client";

import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import styles from './Timeline.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineVariant = 'default' | 'success' | 'warning' | 'error';
export type TimelineSize = 'sm' | 'md' | 'lg';
export type TimelineOrientation = 'vertical' | 'horizontal';

export interface TimelineItemProps {
  date?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: TimelineVariant;
  size?: TimelineSize;
  children?: React.ReactNode;
  className?: string;
}

export interface TimelineProps {
  children: React.ReactNode;
  className?: string;
  orientation?: TimelineOrientation;
  'aria-label'?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TimelineContextValue {
  orientation: TimelineOrientation;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

const useTimelineContext = (): TimelineContextValue => {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error('<TimelineItem> must be used inside <Timeline>');
  return ctx;
};

// ─── Static maps ──────────────────────────────────────────────────────────────

const dotVariantClass: Record<TimelineVariant, string> = {
  default: styles.variantDefault,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  error: styles.variantError,
};

const dotSizeClass: Record<TimelineSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

// ─── TimelineItem ─────────────────────────────────────────────────────────────

export const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  children,
  className,
}) => {
  const { orientation } = useTimelineContext();
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role="listitem"
      className={cn(
        styles.item,
        dotSizeClass[size],
        isHorizontal && styles.itemHorizontal,
        className
      )}
    >
      {/* Left column: dot + connecting line */}
      <div className={cn(styles.leftCol, isHorizontal && styles.leftColHorizontal)}>
        {icon ? (
          <div
            className={cn(styles.iconDot, dotVariantClass[variant])}
            aria-hidden="true"
          >
            <span className={styles.iconLabel}>{icon}</span>
          </div>
        ) : (
          <div
            className={cn(styles.dot, dotVariantClass[variant])}
            aria-hidden="true"
          />
        )}
        {/* Connector line — hidden for last item via parent selector */}
        <div
          className={cn(
            styles.timelineLine,
            isHorizontal && styles.timelineLineHorizontal
          )}
        />
      </div>

      {/* Right column: content */}
      <div className={cn(styles.rightCol, isHorizontal && styles.rightColHorizontal)}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {date && <time className={styles.date}>{date}</time>}
        </div>
        {description && <p className={styles.descriptionText}>{description}</p>}
        {children && <div className={styles.childrenWrapper}>{children}</div>}
      </div>
    </div>
  );
};

TimelineItem.displayName = 'TimelineItem';

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const Timeline: React.FC<TimelineProps> = ({
  children,
  className,
  orientation = 'vertical',
  'aria-label': ariaLabel,
}) => (
  <TimelineContext.Provider value={{ orientation }}>
    <div
      role="list"
      aria-label={ariaLabel}
      className={cn(
        styles.timeline,
        orientation === 'horizontal' && styles.timelineHorizontal,
        className
      )}
    >
      {children}
    </div>
  </TimelineContext.Provider>
);

Timeline.displayName = 'Timeline';
