import React from 'react';
import { cn } from '../../lib/cn';
import styles from './StatsCard.module.css';

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
    <div className={cn(styles.card, className)}>
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
              !isPositive && !isNegative && styles.trendNeutral
            )}
            aria-label={`Tendencia: ${trend > 0 ? '+' : ''}${trend}%`}
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
