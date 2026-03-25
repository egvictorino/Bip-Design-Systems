import { forwardRef, useId, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Textarea.module.css';

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

const labelSizeClass: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

const resizeClass: Record<NonNullable<TextareaProps['resize']>, string> = {
  none:       styles.resizeNone,
  vertical:   styles.resizeVertical,
  horizontal: styles.resizeHorizontal,
  both:       styles.resizeBoth,
};

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
    const textareaId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${textareaId}-message` : undefined;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error ? styles.labelError : focused ? styles.labelFocused : styles.labelNormal,
              disabled && styles.labelDisabled
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
            styles.textarea,
            styles[variant],
            styles[size],
            resizeClass[resize],
            error && styles.error,
            disabled ? styles.cursorDisabled : styles.cursorText,
            fullWidth && styles.fullWidth,
            className
          )}
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
          <span id={messageId} className={cn(helperSizeClass[size], styles.errorText)} role="alert">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeClass[size], styles.helperText)}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
