import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
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

const resizeStyles = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const baseStyles =
  'rounded-[1px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

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

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      resize = 'vertical',
      className,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    const textareaId =
      id || (label ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage && textareaId ? `${textareaId}-message` : undefined;

    const variantStyles = getVariantStyles(error);
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text';

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={messageId}
          className={clsx(
            baseStyles,
            variantStyles[variant],
            sizes[size],
            resizeStyles[resize],
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
        />
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

Textarea.displayName = 'Textarea';
