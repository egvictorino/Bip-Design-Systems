import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'bare' | 'soul' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

// ─── Static maps (module-level — not recreated on every render) ───────────────

const baseStyles =
  'inline-flex items-center gap-2 rounded-[1px] font-medium transition-colors cursor-pointer ' +
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
  danger:
    'bg-danger text-txt-white ' +
    'hover:bg-danger-hover active:bg-danger-press ' +
    'focus-visible:ring-danger',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-[12px] py-[6px] text-xs',
  md: 'px-[20px] py-[10px] text-sm',
  lg: 'px-[24px] py-[12px] text-lg',
};

// ─── Spinner icon (inline — avoids circular dependency with Spinner component) ─

const SpinnerIcon = () => (
  <svg
    className="h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      {...props}
    >
      {loading && <SpinnerIcon />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
