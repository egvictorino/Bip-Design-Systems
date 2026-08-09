'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  /** Shows the current numeric value next to the label. */
  showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      showValue = false,
      disabled = false,
      className,
      id,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const sliderId = id ?? (label ? generatedId : undefined);
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${sliderId ?? generatedId}-message` : undefined;
    const currentValue = value ?? defaultValue ?? min;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth, className)}>
        {(label || showValue) && (
          <div className={styles.footer}>
            {label && (
              <label
                htmlFor={sliderId}
                className={cn(styles.label, disabled && styles.labelDisabled)}
              >
                {label}
              </label>
            )}
            {showValue && <span className={styles.valueLabel}>{currentValue}</span>}
          </div>
        )}
        <input
          ref={ref}
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={messageId}
          className={cn(styles.track, error && styles.error)}
          {...props}
        />
        {hasMessage && (
          <div className={styles.footer}>
            <span
              id={messageId}
              role={error ? 'alert' : undefined}
              className={error ? styles.errorMessage : styles.helperText}
            >
              {error ? errorMessage : helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = 'Slider';
