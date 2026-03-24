import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Skeleton } from '../Skeleton';

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

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  elevated: 'bg-white shadow-md',
  outlined: 'bg-white border border-edge',
  flat: 'bg-surface-3',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

const radiusStyles: Record<NonNullable<CardProps['radius']>, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

const aspectRatioStyles: Record<NonNullable<CardMediaProps['aspectRatio']>, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn('border-b border-edge px-5 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => (
  <div className={cn('p-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn('border-t border-edge px-5 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  alt,
  aspectRatio = 'video',
  className,
}) => (
  <div className={cn('overflow-hidden w-full', aspectRatioStyles[aspectRatio], className)}>
    <img src={src} alt={alt} className="w-full h-full object-cover" />
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
          'overflow-hidden',
          variantStyles[variant],
          radiusStyles[radius],
          paddingStyles[padding],
          fullWidth && 'w-full',
          clickable &&
            'cursor-pointer transition-shadow hover:shadow-lg active:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
        {...interactiveProps}
        {...props}
      >
        {loading ? (
          <div className="p-5 flex flex-col gap-3" aria-busy="true" aria-label="Cargando...">
            <Skeleton variant="text" className="w-1/2" />
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
