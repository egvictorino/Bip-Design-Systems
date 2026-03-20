import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  variant?: 'outlined' | 'filled' | 'bare';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const triggerSizes: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: 'min-h-[32px] px-3 py-1 text-xs gap-1',
  md: 'min-h-[42px] px-4 py-2 text-sm gap-1.5',
  lg: 'min-h-[50px] px-5 py-2.5 text-base gap-2',
};

const chipSizes: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-0.5',
  md: 'text-xs px-2 py-0.5 gap-0.5',
  lg: 'text-sm px-2.5 py-1 gap-1',
};

const labelSizeStyles: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

const getTriggerVariantStyles = (
  error: boolean
): Record<NonNullable<MultiSelectProps['variant']>, string> => ({
  outlined: cn(
    'border bg-interaction-field',
    error
      ? 'border-feedback-error-default focus-visible:ring-feedback-error-default'
      : 'border-interaction-primary-default focus-visible:ring-interaction-primary-default hover:border-interaction-primary-hover'
  ),
  filled: cn(
    'border-0',
    error
      ? 'bg-feedback-error-light focus-visible:ring-feedback-error-default'
      : 'bg-interaction-secondary-default focus-visible:ring-interaction-primary-default hover:bg-interaction-secondary-hover'
  ),
  bare: cn(
    'border-0 border-b-2 bg-transparent rounded-none',
    error
      ? 'border-b-feedback-error-default focus-visible:ring-0'
      : 'border-b-interaction-primary-default focus-visible:ring-0 focus-visible:border-b-interaction-primary-hover hover:border-b-interaction-primary-hover'
  ),
});

// ─── Component ────────────────────────────────────────────────────────────────

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      variant = 'outlined',
      size = 'md',
      label,
      placeholder = 'Seleccionar...',
      searchPlaceholder = 'Buscar...',
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      fullWidth = false,
      id,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const listboxId = `${triggerId}-listbox`;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${triggerId}-message` : undefined;

    // ─── Derived state ───────────────────────────────────────────────────────

    // Set for O(1) membership checks — avoids O(n²) in selectedOptions + render
    const valueSet = useMemo(() => new Set(value), [value]);

    const selectedOptions = useMemo(
      () => options.filter((o) => valueSet.has(o.value)),
      [options, valueSet]
    );

    const filtered = useMemo(() => {
      const q = query.toLowerCase();
      if (!q) return options;
      return options.filter(
        (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
      );
    }, [options, query]);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const open = useCallback(() => {
      if (!disabled) setIsOpen(true);
    }, [disabled]);

    const close = useCallback(() => {
      setIsOpen(false);
      setQuery('');
    }, []);

    const toggle = useCallback(
      (optionValue: string) => {
        onChange?.(
          value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]
        );
      },
      [value, onChange]
    );

    const removeOne = useCallback(
      (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(value.filter((v) => v !== optionValue));
      },
      [value, onChange]
    );

    const clearAll = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.([]);
      },
      [onChange]
    );

    // ─── Effects ─────────────────────────────────────────────────────────────

    // Click outside → close
    useEffect(() => {
      const onMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          close();
        }
      };
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, [close]);

    // Escape → close + return focus to trigger
    useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          close();
          triggerRef.current?.focus();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, close]);

    // Auto-focus search when dropdown opens
    useEffect(() => {
      if (isOpen) {
        searchRef.current?.focus();
      }
    }, [isOpen]);

    // ─── Keyboard navigation ─────────────────────────────────────────────────

    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        open();
      }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        containerRef.current
          ?.querySelector<HTMLLIElement>('[role="option"]:not([aria-disabled="true"])')
          ?.focus();
      }
    };

    const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLLIElement>('[role="option"]:not([aria-disabled="true"])')
      );
      const idx = items.indexOf(document.activeElement as HTMLLIElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          e.preventDefault();
          searchRef.current?.focus();
        } else {
          close();
        }
      }
    };

    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, optionValue: string) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle(optionValue);
      }
    };

    // ─── Ref merging ─────────────────────────────────────────────────────────

    // Forward ref points to the trigger div (combobox element), not the outer container.
    // This lets consumers (e.g. React Hook Form) call .focus() on the focusable element.
    const setTriggerRef = useCallback(
      (node: HTMLDivElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // ─── Styles ──────────────────────────────────────────────────────────────

    const variantStyles = useMemo(() => getTriggerVariantStyles(error), [error]);

    return (
      <div ref={containerRef} className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={triggerId}
            className={cn(
              'font-medium transition-colors cursor-default',
              labelSizeStyles[size],
              error
                ? 'text-feedback-error-default'
                : focused
                  ? 'text-interaction-primary-default'
                  : 'text-text-primary',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        {/* Trigger (combobox) */}
        <div
          ref={setTriggerRef}
          id={triggerId}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={error || undefined}
          aria-describedby={messageId}
          aria-disabled={disabled || undefined}
          onClick={open}
          onKeyDown={handleTriggerKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'flex flex-wrap items-center rounded-[1px] transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            variantStyles[variant],
            triggerSizes[size],
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            className
          )}
        >
          {/* Selected chips */}
          {selectedOptions.length > 0 ? (
            <span className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className={cn(
                    'inline-flex items-center rounded bg-interaction-tertiary-default text-text-primary font-medium',
                    chipSizes[size]
                  )}
                >
                  {opt.label}
                  {!disabled && (
                    <button
                      type="button"
                      aria-label={`Eliminar ${opt.label}`}
                      onClick={(e) => removeOne(opt.value, e)}
                      className="rounded-sm hover:bg-interaction-tertiary-hover p-0.5 leading-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-interaction-primary-default"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                      >
                        <path d="M2.22 2.22a.75.75 0 011.06 0L6 4.94l2.72-2.72a.75.75 0 111.06 1.06L7.06 6l2.72 2.72a.75.75 0 11-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 01-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 010-1.06z" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </span>
          ) : (
            <span className="flex-1 text-text-disabled select-none">{placeholder}</span>
          )}

          {/* Right side: clear all + chevron */}
          <span className="ml-auto flex items-center gap-1 shrink-0 pl-1">
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                aria-label="Eliminar todas las selecciones"
                onClick={clearAll}
                className={cn(
                  'rounded-sm p-0.5 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-interaction-primary-default',
                  'hover:bg-interaction-tertiary-default',
                  error ? 'text-feedback-error-default' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path d="M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z" />
                </svg>
              </button>
            )}
            <span
              aria-hidden="true"
              className={cn(
                'transition-transform duration-200 pointer-events-none',
                isOpen && 'rotate-180',
                error
                  ? 'text-feedback-error-default'
                  : focused
                    ? 'text-interaction-primary-default'
                    : 'text-text-secondary'
              )}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </span>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="relative">
            <div className="absolute z-50 top-1 left-0 right-0 bg-white border border-interaction-tertiary-default rounded shadow-md overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-interaction-tertiary-default">
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-3.5 h-3.5"
                    >
                      <circle cx="6.5" cy="6.5" r="4" />
                      <path d="M11 11l2.5 2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Buscar opciones"
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-interaction-tertiary-default rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interaction-primary-default"
                  />
                </div>
              </div>

              {/* Listbox */}
              <ul
                id={listboxId}
                role="listbox"
                aria-multiselectable="true"
                aria-label="Opciones"
                onKeyDown={handleListboxKeyDown}
                className="max-h-48 overflow-y-auto py-1"
              >
                {filtered.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-text-disabled text-center select-none">
                    Sin resultados
                  </li>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = valueSet.has(opt.value);
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled || undefined}
                        tabIndex={opt.disabled ? -1 : 0}
                        onClick={() => !opt.disabled && toggle(opt.value)}
                        onKeyDown={(e) => !opt.disabled && handleOptionKeyDown(e, opt.value)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 text-sm select-none outline-none',
                          'focus-visible:bg-interaction-tertiary-default',
                          opt.disabled
                            ? 'text-text-disabled cursor-not-allowed'
                            : 'cursor-pointer text-text-primary hover:bg-interaction-tertiary-default'
                        )}
                      >
                        {/* Checkbox visual */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors',
                            isSelected && !opt.disabled
                              ? 'bg-interaction-primary-default border-interaction-primary-default'
                              : opt.disabled
                                ? 'border-text-disabled bg-interaction-disabled'
                                : 'border-interaction-primary-default bg-white'
                          )}
                        >
                          {isSelected && (
                            <svg
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              className="w-2.5 h-2.5"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {opt.label}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Helper / Error message */}
        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(helperSizeStyles[size], 'text-feedback-error-default')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeStyles[size], 'text-text-secondary')}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
