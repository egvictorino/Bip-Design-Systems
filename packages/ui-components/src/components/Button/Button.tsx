import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'bare' | 'soul';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// ─── Static maps (module-level — not recreated on every render) ───────────────

const baseStyles =
  'rounded-[1px] font-medium transition-colors cursor-pointer ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-interaction-primary-default text-text-white ' +
    'hover:bg-interaction-primary-hover active:bg-interaction-primary-pressed ' +
    'focus-visible:ring-interaction-primary-default',
  secondary:
    'bg-interaction-secondary-default text-text-white ' +
    'hover:bg-interaction-secondary-hover active:bg-interaction-secondary-pressed ' +
    'focus-visible:ring-interaction-secondary-default',
  bare:
    'bg-transparent text-interaction-primary-default border border-interaction-primary-default ' +
    'hover:text-interaction-primary-hover hover:border-interaction-primary-hover ' +
    'active:text-interaction-primary-pressed active:border-interaction-primary-pressed ' +
    'focus-visible:ring-interaction-primary-default',
  soul:
    'bg-transparent text-interaction-primary-default ' +
    'hover:bg-interaction-tertiary-default active:bg-interaction-tertiary-hover ' +
    'focus-visible:ring-interaction-primary-default',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-[12px] py-[6px] text-xs',
  md: 'px-[20px] py-[10px] text-sm',
  lg: 'px-[24px] py-[12px] text-lg',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
