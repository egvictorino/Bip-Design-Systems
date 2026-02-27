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
    'rounded-[1px] font-small transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

  const variants = {
    primary:
      'bg-interaction-primary-default text-white hover:bg-interaction-primary-hover active:bg-interaction-primary-pressed dark:bg-interaction-primary-700 dark:hover:bg-interaction-primary-600 dark:active:bg-interaction-primary-800',
    secondary:
      'bg-interaction-secondary-default text-primary hover:bg-interaction-secondary-hover active:bg-interaction-secondary-pressed dark:bg-interaction-secondary-700 dark:hover:bg-interaction-secondary-600 dark:active:bg-interaction-secondary-800',
    bare: 'bg-transparent text-interaction-primary-default border border-interaction-primary-default hover:text-interaction-primary-hover hover:border-interaction-primary-hover active:text-interaction-primary-pressed active:border-interaction-primary-pressed focus:ring-gray-500',
    soul: 'bg-transparent text-interaction-primary-default focus:ring-soul-500',
  };

  const sizes = {
    sm: 'px-[12px] py-[6px] text-sm',
    md: 'px-[20px] py-[10px] text-[12px]',
    lg: 'px-[24px] py-[12px] text-lg',
  };

  return (
    <button type="button" className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
