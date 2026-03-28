import React from 'react';
import { cn } from '../../lib/cn';
import styles from './Timeline.module.css';

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

const dotVariantClass: Record<NonNullable<TimelineItemProps['variant']>, string> = {
  default: styles.variantDefault,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  error: styles.variantError,
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
  <div className={cn(styles.item, className)}>
    {/* Left column: dot + connecting line */}
    <div className={styles.leftCol}>
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
      {/* Vertical connector — hidden for last item via parent selector */}
      <div className={styles.timelineLine} />
    </div>

    {/* Right column: content */}
    <div className={styles.rightCol}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {date && (
          <time className={styles.date}>{date}</time>
        )}
      </div>
      {description && <p className={styles.descriptionText}>{description}</p>}
      {children && <div className={styles.childrenWrapper}>{children}</div>}
    </div>
  </div>
);

TimelineItem.displayName = 'TimelineItem';

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => (
  <div className={cn(styles.timeline, className)}>
    {children}
  </div>
);

Timeline.displayName = 'Timeline';
