"use client";

import React, { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Input.module.css';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  type?: InputType;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
}

const labelSizeClass: Record<NonNullable<InputProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<InputProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      type = 'text',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      className,
      disabled = false,
      id,
      required,
      value,
      onChange,
      onFocus,
      onBlur,
      startIcon,
      endIcon,
      clearable = false,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;

    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;
    const showClear = clearable && value !== undefined && value !== '' && !!onChange;
    const hasStartIcon = !!startIcon;
    const hasEndAdornment = !!endIcon || !!showClear || isPassword;

    const handleClear = () => {
      if (!onChange || !ref || !('current' in ref) || !ref.current) return;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeSetter?.call(ref.current, '');
      ref.current.dispatchEvent(new Event('input', { bubbles: true }));
      onChange({ target: ref.current } as React.ChangeEvent<HTMLInputElement>);
      ref.current.focus();
    };

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error ? styles.labelError : focused ? styles.labelFocused : styles.labelNormal,
              disabled && styles.labelDisabled
            )}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.requiredMark}>
                {' '}
                *
              </span>
            )}
          </label>
        )}
        <div className={cn(styles.inputContainer, fullWidth && styles.inputContainerFullWidth)}>
          {hasStartIcon && <span className={styles.iconStart}>{startIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            className={cn(
              styles.input,
              styles[variant],
              styles[size],
              error && styles.error,
              disabled ? styles.cursorDisabled : styles.cursorText,
              hasStartIcon && styles.hasStartIcon,
              hasEndAdornment && styles.hasEndAdornment,
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
          {hasEndAdornment && (
            <span className={styles.rightAdornments}>
              {endIcon}
              {showClear && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                  aria-label="Limpiar campo"
                  tabIndex={-1}
                >
                  <XIcon />
                </button>
              )}
              {isPassword && (
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              )}
            </span>
          )}
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

Input.displayName = 'Input';
