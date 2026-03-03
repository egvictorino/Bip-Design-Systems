import { forwardRef, useId, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

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

// ─── Static maps ──────────────────────────────────────────────────────────────

const sizes: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: 'px-[12px] py-[6px] text-xs',
  md: 'px-[20px] py-[10px] text-sm',
  lg: 'px-[24px] py-[12px] text-lg',
};

const labelSizeStyles: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

const resizeStyles: Record<NonNullable<TextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const baseStyles =
  'rounded-[1px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const getVariantStyles = (
  error: boolean
): Record<NonNullable<TextareaProps['variant']>, string> => ({
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
    const textareaId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${textareaId}-message` : undefined;

    const variantStyles = getVariantStyles(error);
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text';

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={messageId}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizes[size],
            resizeStyles[resize],
            disabledStyles,
            'disabled:bg-interaction-disabled read-only:bg-interaction-field-readonly',
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
        />
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

Textarea.displayName = 'Textarea';
