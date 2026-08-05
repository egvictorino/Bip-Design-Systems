"use client";

import { forwardRef, useId, useState } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
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
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  required?: boolean;
}

const labelSizeClass: Record<NonNullable<SelectProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<SelectProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

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
      options = [],
      groups,
      required = false,
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
    const selectId = id ?? generatedId;
    const hasMessage = Boolean((error && errorMessage) || helperText);
    const messageId = hasMessage ? `${selectId}-message` : undefined;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error ? styles.labelError : focused ? styles.labelFocused : styles.labelNormal,
              disabled && styles.labelDisabled
            )}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.required}>
                {' *'}
              </span>
            )}
          </label>
        )}

        <div className={cn(styles.selectWrapper, fullWidth && styles.fullWidth)}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            className={cn(
              styles.select,
              styles[variant],
              styles[size],
              error && styles.error,
              disabled ? styles.cursorDisabled : styles.cursorPointer,
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
            {groups?.map((group) => (
              <optgroup key={group.label} label={group.label} disabled={group.disabled}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <span
            className={cn(
              styles.chevron,
              error
                ? styles.chevronError
                : focused
                  ? styles.chevronFocused
                  : styles.chevronNormal,
              disabled && styles.chevronDisabled
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className={styles.chevronIcon}>
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

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

Select.displayName = 'Select';
