import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import { Skeleton } from '../Skeleton/index.js';
import styles from './Card.module.css';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardMediaProps {
  src: string;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const paddingClass: Record<NonNullable<CardProps['padding']>, string> = {
  none: styles.paddingNone,
  sm:   styles.paddingSm,
  md:   styles.paddingMd,
  lg:   styles.paddingLg,
};

const radiusClass: Record<NonNullable<CardProps['radius']>, string> = {
  none: styles.radiusNone,
  sm:   styles.radiusSm,
  md:   styles.radiusMd,
  lg:   styles.radiusLg,
  xl:   styles.radiusXl,
};

const aspectClass: Record<NonNullable<CardMediaProps['aspectRatio']>, string> = {
  video:  styles.aspectVideo,
  square: styles.aspectSquare,
  wide:   styles.aspectWide,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.cardHeader, className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.cardBody, className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.cardFooter, className)} {...props}>
    {children}
  </div>
);

export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  className,
}) => (
  <div className={cn(styles.cardMedia, aspectClass[aspectRatio], className)}>
    <img src={src} alt={alt} className={styles.mediaImg} />
  </div>
);

// ─── Root ─────────────────────────────────────────────────────────────────────

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'none',
      radius = 'lg',
      fullWidth = false,
      loading = false,
      clickable = false,
      className,
      children,
      role,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref
  ) => {
    const t = useBipLocale();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (clickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        props.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    const interactiveProps = clickable
      ? {
          role: role ?? 'button',
          tabIndex: tabIndex ?? 0,
          onKeyDown: handleKeyDown,
        }
      : { role, tabIndex, onKeyDown };

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[variant],
          radiusClass[radius],
          paddingClass[padding],
          fullWidth && styles.fullWidth,
          clickable && styles.clickable,
          className
        )}
        {...interactiveProps}
        {...props}
      >
        {loading ? (
          <div className={styles.loadingContainer} aria-busy="true" aria-label={t.card.loading}>
            <Skeleton variant="text" className={styles.skeletonShort} />
            <Skeleton variant="text" lines={3} />
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardMedia.displayName = 'CardMedia';
