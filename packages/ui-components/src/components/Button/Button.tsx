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
    'bg-primary text-txt-white ' +
    'hover:bg-primary-hover active:bg-primary-press ' +
    'focus-visible:ring-primary',
  secondary:
    'bg-secondary text-txt-primary ' +
    'hover:bg-secondary-hover active:bg-secondary-press ' +
    'focus-visible:ring-secondary',
  bare:
    'bg-transparent text-primary border border-primary ' +
    'hover:text-primary-hover hover:border-primary-hover ' +
    'active:text-primary-press active:border-primary-press ' +
    'focus-visible:ring-primary',
  soul:
    'bg-transparent text-primary ' +
    'hover:text-primary-hover active:text-primary-press ' +
    'focus-visible:ring-primary',
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
