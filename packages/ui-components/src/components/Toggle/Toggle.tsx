import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Toggle.module.css';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

type SizeTokens = {
  track: string;
  thumb: string;
  label: string;
  helper: string;
  indent: string;
};

const sizeClasses: Record<NonNullable<ToggleProps['size']>, SizeTokens> = {
  sm: {
    track:  styles.trackSm,
    thumb:  styles.thumbSm,
    label:  styles.labelSm,
    helper: styles.helperSm,
    indent: styles.indentSm,
  },
  md: {
    track:  styles.trackMd,
    thumb:  styles.thumbMd,
    label:  styles.labelMd,
    helper: styles.helperSm,
    indent: styles.indentMd,
  },
  lg: {
    track:  styles.trackLg,
    thumb:  styles.thumbLg,
    label:  styles.labelLg,
    helper: styles.helperLg,
    indent: styles.indentLg,
  },
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      className,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const toggleId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${toggleId}-message` : undefined;
    const sz = sizeClasses[size];

    return (
      <div className={cn(styles.wrapper, className)}>
        <div className={styles.row}>
          {/* Track */}
          <div
            className={cn(
              styles.track,
              sz.track,
              error && styles.trackError,
              disabled && styles.trackDisabled
            )}
          >
            <input
              ref={ref}
              id={toggleId}
              type="checkbox"
              role="switch"
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={messageId}
              className={styles.nativeInput}
              {...props}
            />
            <span className={cn(styles.thumb, sz.thumb)} aria-hidden="true" />
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={toggleId}
              className={cn(
                styles.label,
                sz.label,
                error ? styles.labelError : styles.labelNormal,
                disabled && styles.labelDisabled
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Helper text / error message */}
        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(sz.helper, styles.errorText, sz.indent)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(sz.helper, styles.helperText, sz.indent)}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
