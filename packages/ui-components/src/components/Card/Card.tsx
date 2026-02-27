import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  elevated: 'bg-white shadow-md',
  outlined: 'bg-white border border-interaction-tertiary-default',
  flat: 'bg-interaction-tertiary-default',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div
    className={clsx('border-b border-interaction-tertiary-default px-5 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => (
  <div className={clsx('p-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div
    className={clsx('border-t border-interaction-tertiary-default px-5 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'none',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
