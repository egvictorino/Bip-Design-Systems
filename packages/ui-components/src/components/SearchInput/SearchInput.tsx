import { forwardRef, useId, useState, useRef, useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

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

const sizes: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: 'pl-8 pr-8 py-[6px] text-xs',
  md: 'pl-9 pr-9 py-[10px] text-sm',
  lg: 'pl-10 pr-10 py-[12px] text-lg',
};

const iconSizes: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const iconOffsets: Record<NonNullable<SearchInputProps['size']>, { left: string; right: string }> = {
  sm: { left: 'left-2.5', right: 'right-2.5' },
  md: { left: 'left-3', right: 'right-3' },
  lg: { left: 'left-3.5', right: 'right-3.5' },
};

const labelSizeStyles: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<SearchInputProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

const baseStyles =
  'w-full rounded-[1px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const getVariantStyles = (error: boolean): Record<NonNullable<SearchInputProps['variant']>, string> => ({
  outlined: cn(
    'border bg-field',
    error
      ? 'border-danger focus-visible:ring-danger'
      : 'border-edge focus-visible:ring-primary hover:border-edge-hover'
  ),
  filled: cn(
    'border',
    error
      ? 'bg-danger-light focus-visible:ring-danger'
      : 'border-edge bg-secondary focus-visible:ring-primary'
  ),
  bare: cn(
    'border-0 border-b-2 bg-transparent rounded-none',
    error
      ? 'border-b-danger focus-visible:ring-0'
      : 'border-b-primary focus-visible:ring-0 focus-visible:border-b-primary-hover hover:border-b-primary-hover'
  ),
});

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
    const variantStyles = getVariantStyles(error);
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

    const offsets = iconOffsets[size];
    const iconSize = iconSizes[size];

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'font-medium transition-colors',
              labelSizeStyles[size],
              error
                ? 'text-danger'
                : focused
                  ? 'text-txt'
                  : 'text-txt-utility',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        <div className={cn('relative', fullWidth && 'w-full')}>
          {/* Search icon */}
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2',
              offsets.left,
              error ? 'text-danger' : 'text-txt-secondary',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={iconSize}>
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
              baseStyles,
              variantStyles[variant],
              sizes[size],
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
              'disabled:bg-disabled read-only:bg-field-readonly',
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
              className={cn(
                'absolute top-1/2 -translate-y-1/2',
                offsets.right,
                'text-txt-secondary hover:text-txt transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded'
              )}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={iconSize} aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>

        {error && errorMessage ? (
          <span id={messageId} className={cn(helperSizeStyles[size], 'text-danger')} role="alert">
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

SearchInput.displayName = 'SearchInput';
