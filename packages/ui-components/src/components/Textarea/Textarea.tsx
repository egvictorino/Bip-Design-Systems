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
    'border bg-field',
    error
      ? 'border-danger focus-visible:ring-danger'
      : 'border-primary focus-visible:ring-primary hover:border-primary-hover'
  ),
  filled: cn(
    'border-0',
    error
      ? 'bg-danger-light focus-visible:ring-danger'
      : 'bg-secondary focus-visible:ring-primary hover:bg-secondary-hover'
  ),
  bare: cn(
    'border-0 border-b-2 bg-transparent rounded-none',
    error
      ? 'border-b-danger focus-visible:ring-0'
      : 'border-b-primary focus-visible:ring-0 focus-visible:border-b-primary-hover hover:border-b-primary-hover'
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
                ? 'text-danger'
                : focused
                  ? 'text-primary'
                  : 'text-txt',
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
            'disabled:bg-disabled read-only:bg-field-readonly',
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
            className={cn(helperSizeStyles[size], 'text-danger')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeStyles[size], 'text-txt-secondary')}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
