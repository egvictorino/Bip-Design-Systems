import { forwardRef, useState } from 'react';
import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

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

const sizes = {
  sm: 'px-[12px] py-[6px] text-sm',
  md: 'px-[20px] py-[10px] text-[12px]',
  lg: 'px-[24px] py-[12px] text-lg',
};

const labelSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

const baseStyles =
  'appearance-none rounded-[1px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 pr-8';

const getVariantStyles = (error: boolean) => ({
  outlined: clsx(
    'border bg-transparent',
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-interaction-primary-default focus:ring-interaction-primary-default hover:border-interaction-primary-hover'
  ),
  filled: clsx(
    'border-0',
    error
      ? 'bg-red-50 focus:ring-red-500'
      : 'bg-interaction-secondary-default focus:ring-interaction-primary-default hover:bg-interaction-secondary-hover'
  ),
  bare: clsx(
    'border-0 border-b-2 bg-transparent rounded-none',
    error
      ? 'border-b-red-500 focus:ring-0'
      : 'border-b-interaction-primary-default focus:ring-0 focus:border-b-interaction-primary-hover hover:border-b-interaction-primary-hover'
  ),
});

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
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const selectId =
      id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage && selectId ? `${selectId}-message` : undefined;

    const variantStyles = getVariantStyles(error);
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              'font-medium transition-colors',
              labelSizeStyles[size],
              error
                ? 'text-red-500'
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
        <div className={clsx('relative', fullWidth && 'w-full')}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            className={clsx(
              baseStyles,
              variantStyles[variant],
              sizes[size],
              disabledStyles,
              fullWidth && 'w-full',
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
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
            className={clsx(
              'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
              error
                ? 'text-red-500'
                : focused
                  ? 'text-interaction-primary-default'
                  : 'text-text-secondary',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
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
            className={clsx(helperSizeStyles[size], 'text-red-500')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={clsx(helperSizeStyles[size], 'text-text-secondary')}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
