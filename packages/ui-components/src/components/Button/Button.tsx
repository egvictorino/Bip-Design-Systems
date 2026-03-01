import React from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'bare' | 'soul';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'rounded-[1px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

  const variants = {
    primary:
      'bg-interaction-primary-default text-text-white hover:bg-interaction-primary-hover active:bg-interaction-primary-pressed focus:ring-interaction-primary-default',
    secondary:
      'bg-interaction-secondary-default text-text-primary hover:bg-interaction-secondary-hover active:bg-interaction-secondary-pressed focus:ring-interaction-secondary-default',
    bare: 'bg-transparent text-interaction-primary-default border border-interaction-primary-default hover:text-interaction-primary-hover hover:border-interaction-primary-hover active:text-interaction-primary-pressed active:border-interaction-primary-pressed focus:ring-interaction-primary-default',
    soul: 'bg-transparent text-interaction-primary-default focus:ring-interaction-primary-default',
  };

  const sizes = {
    sm: 'px-[12px] py-[6px] text-xs',
    md: 'px-[20px] py-[10px] text-sm',
    lg: 'px-[24px] py-[12px] text-lg',
  };

  return (
    <button type="button" className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
