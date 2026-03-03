import { forwardRef, useId, useState } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  placeholder?: string;
  options: SelectOption[];
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const sizes: Record<NonNullable<SelectProps['size']>, string> = {
  sm: 'px-[12px] py-[6px] text-xs',
  md: 'px-[20px] py-[10px] text-sm',
  lg: 'px-[24px] py-[12px] text-lg',
};

const labelSizeStyles: Record<NonNullable<SelectProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<SelectProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

const baseStyles =
  'appearance-none rounded-[1px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 pr-8';

const getVariantStyles = (error: boolean): Record<NonNullable<SelectProps['variant']>, string> => ({
  outlined: cn(
    'border bg-interaction-field',
    error
      ? 'border-feedback-error-default focus-visible:ring-feedback-error-default'
      : 'border-interaction-primary-default focus-visible:ring-interaction-primary-default hover:border-interaction-primary-hover'
  ),
  filled: cn(
    'border-0',
    error
      ? 'bg-feedback-error-light focus-visible:ring-feedback-error-default'
      : 'bg-interaction-secondary-default focus-visible:ring-interaction-primary-default hover:bg-interaction-secondary-hover'
  ),
  bare: cn(
    'border-0 border-b-2 bg-transparent rounded-none',
    error
      ? 'border-b-feedback-error-default focus-visible:ring-0'
      : 'border-b-interaction-primary-default focus-visible:ring-0 focus-visible:border-b-interaction-primary-hover hover:border-b-interaction-primary-hover'
  ),
});

// ─── Component ────────────────────────────────────────────────────────────────

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      placeholder,
      options,
      className,
      disabled = false,
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();

    // Always fall back to generatedId so aria-describedby linkage works
    // even when no label or explicit id is provided
    const selectId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${selectId}-message` : undefined;

    const variantStyles = getVariantStyles(error);
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'font-medium transition-colors',
              labelSizeStyles[size],
              error
                ? 'text-feedback-error-default'
                : focused
                  ? 'text-interaction-primary-default'
                  : 'text-text-primary',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        {/* Wrapper for custom chevron icon */}
        <div className={cn('relative', fullWidth && 'w-full')}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            className={cn(
              baseStyles,
              variantStyles[variant],
              sizes[size],
              disabledStyles,
              'disabled:bg-interaction-disabled',
              fullWidth && 'w-full',
              className
            )}
            // Spread props before internal handlers so internal handlers always
            // run last — prevents consumer's onFocus/onBlur from overriding the
            // focused state management
            {...props}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <span
            className={cn(
              'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
              error
                ? 'text-feedback-error-default'
                : focused
                  ? 'text-interaction-primary-default'
                  : 'text-text-secondary',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(helperSizeStyles[size], 'text-feedback-error-default')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeStyles[size], 'text-text-secondary')}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
