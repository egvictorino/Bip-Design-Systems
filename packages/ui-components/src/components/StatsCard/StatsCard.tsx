"use client";

import React from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './StatsCard.module.css';

export type StatsCardVariant = 'elevated' | 'outlined' | 'flat';
export type StatsCardSize = 'sm' | 'md' | 'lg';

export interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  description?: string;
  icon?: React.ReactNode;
  variant?: StatsCardVariant;
  size?: StatsCardSize;
  loading?: boolean;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  description,
  icon,
  variant = 'outlined',
  size = 'md',
  loading = false,
  className,
}) => {
  const t = useBipLocale();
  const hasTrend = trend !== undefined;
  const isPositive = hasTrend && trend > 0;
  const isNegative = hasTrend && trend < 0;
  const isNeutral = hasTrend && trend === 0;

  if (loading) {
    return (
      <div
        className={cn(styles.card, styles[variant], styles[size], className)}
        role="region"
        aria-label={t.statsCard.loading}
        aria-busy="true"
      >
        <div className={styles.header}>
          <span className={cn(styles.loadingBar, styles.loadingTitle)} />
          {icon && <span className={cn(styles.loadingBar, styles.loadingIcon)} />}
        </div>
        <div className={styles.valueRow}>
          <span className={cn(styles.loadingBar, styles.loadingValue)} />
        </div>
        <span className={cn(styles.loadingBar, styles.loadingDescription)} />
      </div>
    );
  }

  return (
    <div
      className={cn(styles.card, styles[variant], styles[size], className)}
      role="region"
      aria-label={title || undefined}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && (
          <span className={styles.iconSlot} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>

        {hasTrend && (
          <span
            className={cn(
              styles.trend,
              isPositive && styles.trendPositive,
              isNegative && styles.trendNegative,
              isNeutral && styles.trendNeutral
            )}
            aria-label={t.statsCard.trend(trend)}
          >
            {isPositive && (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className={styles.trendIcon}
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
                className={styles.trendIcon}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 12.78a.75.75 0 0 1-1.06 0L2.69 8.53a.75.75 0 0 1 1.06-1.06L7 10.69V4a.75.75 0 0 1 1.5 0v6.69l3.25-3.22a.75.75 0 1 1 1.06 1.06L8 12.78z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isNeutral && (
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className={styles.trendIcon}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M2.75 8a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9A.75.75 0 0 1 2.75 8zm7.72-2.03a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06L11.94 8l-1.47-1.47a.75.75 0 0 1 0-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>

      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

StatsCard.displayName = 'StatsCard';
