"use client";

import { forwardRef, useId, useState, useEffect, useCallback } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import React from 'react';
import { cn } from '../../lib/cn';
import styles from './NumberInput.module.css';

type Size = 'sm' | 'md' | 'lg';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'prefix'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: Size;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: number | string;
  defaultValue?: number | string;
  onChange?: (value: number | null, event?: React.ChangeEvent<HTMLInputElement>) => void;
  /** Etiqueta no editable al inicio del input (ej: "$", "MXN") */
  prefix?: string | ReactNode;
  /** Etiqueta no editable al final del input (ej: "kg", "%") */
  suffix?: string | ReactNode;
  /** Número máximo de decimales permitidos. En blur, formatea al número exacto de decimales. */
  decimals?: number;
  readOnly?: boolean;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const inputSizeClass: Record<Size, string> = {
  sm: styles.inputSm,
  md: styles.inputMd,
  lg: styles.inputLg,
};

const labelSizeClass: Record<Size, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<Size, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

const stepBtnSizeClass: Record<Size, string> = {
  sm: styles.stepBtnSm,
  md: styles.stepBtnMd,
  lg: styles.stepBtnLg,
};

const prefixSizeClass: Record<Size, string> = {
  sm: styles.prefixSm,
  md: styles.prefixMd,
  lg: styles.prefixLg,
};

const suffixSizeClass: Record<Size, string> = {
  sm: styles.suffixSm,
  md: styles.suffixMd,
  lg: styles.suffixLg,
};

const inputPrefixSizeClass: Record<Size, string> = {
  sm: styles.inputSmPrefix,
  md: styles.inputMdPrefix,
  lg: styles.inputLgPrefix,
};

const inputSuffixSizeClass: Record<Size, string> = {
  sm: styles.inputSmSuffix,
  md: styles.inputMdSuffix,
  lg: styles.inputLgSuffix,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function parseValue(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

function toRaw(val: number | string | undefined): string {
  if (val === undefined || val === null) return '';
  return String(val);
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      className,
      disabled = false,
      readOnly = false,
      required,
      id,
      min,
      max,
      step = 1,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      prefix,
      suffix,
      decimals,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(() => toRaw(value ?? defaultValue));
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;

    // Sync when controlled value changes from outside
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(toRaw(value));
      }
    }, [value]);

    const parsedValue = parseValue(internalValue);

    const clamp = useCallback(
      (n: number): number => {
        let result = n;
        if (min !== undefined) result = Math.max(result, min);
        if (max !== undefined) result = Math.min(result, max);
        return result;
      },
      [min, max]
    );

    const handleIncrement = useCallback(() => {
      const base = parsedValue ?? (min ?? 0);
      const next = clamp(base + step);
      setInternalValue(String(next));
      onChange?.(next, undefined);
    }, [parsedValue, min, step, clamp, onChange]);

    const handleDecrement = useCallback(() => {
      const base = parsedValue ?? (max ?? 0);
      const next = clamp(base - step);
      setInternalValue(String(next));
      onChange?.(next, undefined);
    }, [parsedValue, max, step, clamp, onChange]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Rechazar si excede el número de decimales permitidos
        if (decimals !== undefined) {
          const dotIndex = raw.indexOf('.');
          if (dotIndex !== -1 && raw.length - dotIndex - 1 > decimals) return;
          if (decimals === 0 && dotIndex !== -1) return;
        }
        setInternalValue(raw);
        const parsed = parseValue(raw);
        onChange?.(parsed, e);
      },
      [onChange, decimals]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        if (parsedValue !== null) {
          const clamped = clamp(parsedValue);
          // Formatear a N decimales si se especificó
          if (decimals !== undefined) {
            const formatted =
              decimals === 0 ? String(Math.round(clamped)) : clamped.toFixed(decimals);
            setInternalValue(formatted);
            onChange?.(parseFloat(formatted), e);
          } else {
            setInternalValue(String(clamped));
          }
        }
        onBlur?.(e);
      },
      [parsedValue, clamp, onBlur, decimals, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          handleIncrement();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleDecrement();
        }
        onKeyDown?.(e);
      },
      [handleIncrement, handleDecrement, onKeyDown]
    );

    const isIncrementDisabled =
      disabled || readOnly || (max !== undefined && parsedValue !== null && parsedValue >= max);
    const isDecrementDisabled =
      disabled || readOnly || (min !== undefined && parsedValue !== null && parsedValue <= min);

    // Variant class
    const variantClass =
      variant === 'outlined'
        ? error
          ? styles.outlinedError
          : styles.outlined
        : variant === 'filled'
          ? error
            ? styles.filledError
            : styles.filled
          : error
            ? styles.bareError
            : styles.bare;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.wrapperFull)}>
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

        <div className={cn(styles.inputWrapper, fullWidth && styles.inputWrapperFull)}>
          {/* Decrement button */}
          <button
            type="button"
            aria-label="Decrementar"
            disabled={isDecrementDisabled}
            tabIndex={-1}
            onClick={handleDecrement}
            className={cn(styles.stepBtn, styles.stepBtnLeft, stepBtnSizeClass[size])}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={styles.stepIcon}>
              <path
                fillRule="evenodd"
                d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {prefix && (
            <span
              className={cn(styles.adornment, styles.adornmentLeft, prefixSizeClass[size])}
              aria-hidden="true"
            >
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            aria-valuenow={parsedValue !== null ? parsedValue : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            value={internalValue}
            className={cn(
              styles.input,
              variantClass,
              inputSizeClass[size],
              prefix && inputPrefixSizeClass[size],
              suffix && inputSuffixSizeClass[size],
              !disabled && styles.inputCursorText,
              className
            )}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />

          {suffix && (
            <span
              className={cn(styles.adornment, styles.adornmentRight, suffixSizeClass[size])}
              aria-hidden="true"
            >
              {suffix}
            </span>
          )}

          {/* Increment button */}
          <button
            type="button"
            aria-label="Incrementar"
            disabled={isIncrementDisabled}
            tabIndex={-1}
            onClick={handleIncrement}
            className={cn(styles.stepBtn, styles.stepBtnRight, stepBtnSizeClass[size])}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={styles.stepIcon}>
              <path
                fillRule="evenodd"
                d="M10 4a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 10 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
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

NumberInput.displayName = 'NumberInput';
