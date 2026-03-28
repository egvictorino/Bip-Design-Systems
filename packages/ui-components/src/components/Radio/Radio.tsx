import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

type SizeTokens = { ring: string; dot: string; label: string; helper: string; indent: string };

const sizeClasses: Record<NonNullable<RadioProps['size']>, SizeTokens> = {
  sm: {
    ring:   styles.ringSm,
    dot:    styles.dotSm,
    label:  styles.labelSm,
    helper: styles.helperSm,
    indent: styles.indentSm,
  },
  md: {
    ring:   styles.ringMd,
    dot:    styles.dotMd,
    label:  styles.labelMd,
    helper: styles.helperSm,
    indent: styles.indentMd,
  },
  lg: {
    ring:   styles.ringLg,
    dot:    styles.dotLg,
    label:  styles.labelLg,
    helper: styles.helperLg,
    indent: styles.indentLg,
  },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    const radioId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${radioId}-message` : undefined;
    const sz = sizeClasses[size];

    return (
      <div className={cn(styles.wrapper, className)}>
        <div className={styles.row}>
          {/* Visual radio ring */}
          <div
            className={cn(
              styles.ring,
              sz.ring,
              error && styles.ringError,
              disabled && styles.ringDisabled
            )}
          >
            <input
              ref={ref}
              id={radioId}
              type="radio"
              disabled={disabled}
              aria-describedby={messageId}
              className={styles.nativeInput}
              {...props}
            />
            {/* Inner dot — visible only when selected */}
            <div className={cn(styles.dot, sz.dot, error && styles.dotError)} />
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={radioId}
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

Radio.displayName = 'Radio';
