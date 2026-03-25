import { forwardRef, useId, useState, useRef, useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
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
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Determine if the input is "controlled" to show the clear button
    const isControlled = value !== undefined;
    const hasValue = isControlled ? Boolean(value) : undefined;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);

        if (onSearch && debounceMs > 0) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            onSearch(e.target.value);
          }, debounceMs);
        } else if (onSearch) {
          onSearch(e.target.value);
        }
      },
      [onChange, onSearch, debounceMs]
    );

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
          </label>
        )}

        <div className={cn(styles.inputWrapper, fullWidth && styles.inputWrapperFull)}>
          {/* Search icon */}
          <span
            className={cn(
              styles.searchIcon,
              searchIconOffsetClass[size],
              error ? styles.searchIconError : styles.searchIconNormal,
              disabled && styles.searchIconDisabled
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={iconSizeClass[size]}>
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <input
            ref={ref}
            id={inputId}
            type="search"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
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
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />

          {/* Clear button — only when controlled and has value */}
          {isControlled && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={onClear}
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
