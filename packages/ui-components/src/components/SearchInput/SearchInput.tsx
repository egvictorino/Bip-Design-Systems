"use client";

import React, { forwardRef, useId, useState, useRef, useCallback, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './SearchInput.module.css';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  onClear?: () => void;
  /** Delay in ms before firing `onSearch` after the user stops typing. Default: 0 (no debounce). */
  debounceMs?: number;
  onSearch?: (value: string) => void;
  /** When true, `onSearch` only fires on Enter key press instead of on every keystroke. */
  searchOnEnter?: boolean;
  /** Shows a loading spinner in place of the search icon. Also hides the clear button. */
  loading?: boolean;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const inputSizeClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.inputSm,
  md: styles.inputMd,
  lg: styles.inputLg,
};

const labelSizeClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.helperTextSm,
  md: styles.helperTextMd,
  lg: styles.helperTextLg,
};

const searchIconOffsetClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.searchIconOffsetSm,
  md: styles.searchIconOffsetMd,
  lg: styles.searchIconOffsetLg,
};

const clearBtnOffsetClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.clearBtnOffsetSm,
  md: styles.clearBtnOffsetMd,
  lg: styles.clearBtnOffsetLg,
};

const iconSizeClass: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
      id,
      onFocus,
      onBlur,
      onChange,
      onClear,
      debounceMs = 0,
      onSearch,
      searchOnEnter = false,
      loading = false,
      value,
      defaultValue,
      onKeyDown: externalOnKeyDown,
      required,
      ...props
    },
    ref
  ) => {
    const t = useBipLocale();
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Internal ref for focus management (merged with the forwarded ref)
    const localRef = useRef<HTMLInputElement | null>(null);
    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        localRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref != null)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    // Cleanup debounce timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, []);

    // Determine if the input is "controlled"
    const isControlled = value !== undefined;

    // Track whether an uncontrolled input has a value (to show the clear button)
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
      defaultValue !== undefined && defaultValue !== ''
    );

    const showClear =
      !loading && !disabled && (isControlled ? Boolean(value) : uncontrolledHasValue);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);

        if (!isControlled) {
          setUncontrolledHasValue(Boolean(e.target.value));
        }

        if (onSearch && !searchOnEnter) {
          if (debounceMs > 0) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              onSearch(e.target.value);
            }, debounceMs);
          } else {
            onSearch(e.target.value);
          }
        }
      },
      [onChange, onSearch, debounceMs, searchOnEnter, isControlled]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchOnEnter && e.key === 'Enter' && onSearch) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          onSearch(e.currentTarget.value);
        }
        externalOnKeyDown?.(e);
      },
      [searchOnEnter, onSearch, externalOnKeyDown]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setUncontrolledHasValue(false);
        if (localRef.current) localRef.current.value = '';
      }
      onClear?.();
      localRef.current?.focus();
    }, [isControlled, onClear]);

    // Variant class selection
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
      <div role="search" className={cn(styles.wrapper, fullWidth && styles.wrapperFull)}>
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
          {/* Search icon / loading spinner */}
          <span
            className={cn(
              styles.searchIcon,
              searchIconOffsetClass[size],
              error ? styles.searchIconError : styles.searchIconNormal,
              disabled && styles.searchIconDisabled,
              loading && styles.searchIconSpinning
            )}
            aria-hidden="true"
          >
            {loading ? (
              <svg viewBox="0 0 24 24" fill="none" className={iconSizeClass[size]}>
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className={styles.spinnerTrack}
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                  className={styles.spinnerFill}
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className={iconSizeClass[size]}>
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>

          <input
            ref={mergedRef}
            id={inputId}
            type="search"
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            aria-busy={loading || undefined}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              styles.input,
              variantClass,
              inputSizeClass[size],
              !disabled && styles.inputCursorText,
              className
            )}
            {...props}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />

          {/* Clear button */}
          {showClear && (
            <button
              type="button"
              aria-label={t.searchInput.clear}
              onClick={handleClear}
              className={cn(styles.clearBtn, clearBtnOffsetClass[size])}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={iconSizeClass[size]}
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>

        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(helperSizeClass[size], styles.errorText)}
            role="alert"
          >
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

SearchInput.displayName = 'SearchInput';
