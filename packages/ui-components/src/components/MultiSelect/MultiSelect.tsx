import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useClickOutside } from '../../lib/useClickOutside';
import styles from './MultiSelect.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
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
  /** Número máximo de chips visibles en el trigger. Los restantes se muestran como "+N más". */
  maxVisibleChips?: number;
  /** Muestra una opción "Seleccionar todo" al inicio del listbox. */
  showSelectAll?: boolean;
  /** Muestra un spinner en lugar de las opciones (útil en carga asíncrona). */
  loading?: boolean;
  /** Si se provee, deshabilita el filtrado interno y delega la búsqueda al consumer. */
  onSearch?: (query: string) => void;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const triggerSizeClass: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
};

const chipSizeClass: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: styles.chipSm,
  md: styles.chipMd,
  lg: styles.chipLg,
};

const labelSizeClass: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<MultiSelectProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

const getTriggerVariantClass = (
  variant: NonNullable<MultiSelectProps['variant']>,
  error: boolean
): string => {
  if (variant === 'outlined') return error ? styles.variantOutlinedError : styles.variantOutlined;
  if (variant === 'filled') return error ? styles.variantFilledError : styles.variantFilled;
  // bare
  return error ? styles.variantBareError : styles.variantBare;
};

// ─── Helper: group options ────────────────────────────────────────────────────

/** Agrupa las opciones por su propiedad `group`. Clave '' = sin grupo (van primero). */
function groupOptions(options: MultiSelectOption[]): Map<string, MultiSelectOption[]> {
  const map = new Map<string, MultiSelectOption[]>();
  for (const opt of options) {
    const key = opt.group ?? '';
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(opt);
    } else {
      map.set(key, [opt]);
    }
  }
  return map;
}

/** Retorna true si alguna opción tiene grupo definido. */
function hasGroups(options: MultiSelectOption[]): boolean {
  return options.some((o) => o.group !== undefined);
}

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
      maxVisibleChips,
      showSelectAll = false,
      loading = false,
      onSearch,
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

    // Filtrado interno se desactiva cuando onSearch está presente (consumer filtra externamente)
    const filtered = useMemo(() => {
      if (onSearch) return options;
      const q = query.toLowerCase();
      if (!q) return options;
      return options.filter(
        (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
      );
    }, [options, query, onSearch]);

    // Opciones seleccionables (no-disabled) visibles — para Select All
    const selectableFiltered = useMemo(
      () => filtered.filter((o) => !o.disabled),
      [filtered]
    );

    const allFilteredSelected = useMemo(
      () =>
        selectableFiltered.length > 0 && selectableFiltered.every((o) => valueSet.has(o.value)),
      [selectableFiltered, valueSet]
    );

    // Chips colapsables
    const visibleChips = useMemo(
      () =>
        maxVisibleChips !== undefined ? selectedOptions.slice(0, maxVisibleChips) : selectedOptions,
      [selectedOptions, maxVisibleChips]
    );

    const hiddenCount = useMemo(
      () =>
        maxVisibleChips !== undefined
          ? Math.max(0, selectedOptions.length - maxVisibleChips)
          : 0,
      [selectedOptions, maxVisibleChips]
    );

    // Agrupación: solo calcular si alguna opción tiene grupo
    const grouped = useMemo(() => {
      if (!hasGroups(filtered)) return null;
      return groupOptions(filtered);
    }, [filtered]);

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

    const handleSelectAll = useCallback(() => {
      if (allFilteredSelected) {
        // Deseleccionar las visibles/filtradas
        const toRemove = new Set(selectableFiltered.map((o) => o.value));
        onChange?.(value.filter((v) => !toRemove.has(v)));
      } else {
        // Agregar todas las visibles no seleccionadas
        const toAdd = selectableFiltered
          .filter((o) => !valueSet.has(o.value))
          .map((o) => o.value);
        onChange?.([...value, ...toAdd]);
      }
    }, [allFilteredSelected, selectableFiltered, value, valueSet, onChange]);

    // ─── Effects ─────────────────────────────────────────────────────────────

    // Click outside → close
    useClickOutside(containerRef, close);

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

    // Notificar al consumer cuando cambia la query (búsqueda asíncrona)
    useEffect(() => {
      onSearch?.(query);
    }, [query, onSearch]);

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

    const handleSelectAllKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSelectAll();
      }
    };

    // ─── Ref merging ─────────────────────────────────────────────────────────

    // Forward ref points to the trigger div (combobox element), not the outer container.
    const setTriggerRef = useCallback(
      (node: HTMLDivElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // ─── Render helpers ───────────────────────────────────────────────────────

    const renderOption = (opt: MultiSelectOption) => {
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
          className={cn(styles.option, opt.disabled && styles.optionDisabled)}
        >
          {/* Checkbox visual */}
          <span
            aria-hidden="true"
            className={cn(
              styles.optionCheckbox,
              isSelected && !opt.disabled
                ? styles.optionCheckboxSelected
                : opt.disabled
                  ? styles.optionCheckboxDisabled
                  : undefined
            )}
          >
            {isSelected && (
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className={styles.iconCheckmark}
              >
                <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          {opt.label}
        </li>
      );
    };

    const renderOptions = () => {
      if (grouped) {
        const entries = Array.from(grouped.entries());
        return entries.map(([groupKey, groupOpts]) => (
          <React.Fragment key={groupKey}>
            {groupKey !== '' && (
              <li role="presentation" className={styles.groupHeader}>
                {groupKey}
              </li>
            )}
            {groupOpts.map(renderOption)}
          </React.Fragment>
        ));
      }
      return filtered.map(renderOption);
    };

    const selectAllLabel =
      query.trim() !== ''
        ? `Seleccionar visibles (${selectableFiltered.length})`
        : 'Seleccionar todo';

    return (
      <div
        ref={containerRef}
        className={cn(styles.container, fullWidth && styles.containerFullWidth)}
      >
        {label && (
          <label
            htmlFor={triggerId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error
                ? styles.labelError
                : focused
                  ? styles.labelFocused
                  : undefined,
              disabled && styles.labelDisabled
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
            styles.trigger,
            getTriggerVariantClass(variant, error),
            triggerSizeClass[size],
            disabled ? styles.triggerDisabled : styles.triggerEnabled,
            className
          )}
        >
          {/* Selected chips */}
          {selectedOptions.length > 0 ? (
            <span className={styles.chipsWrapper}>
              {visibleChips.map((opt) => (
                <span key={opt.value} className={cn(styles.chip, chipSizeClass[size])}>
                  {opt.label}
                  {!disabled && (
                    <button
                      type="button"
                      aria-label={`Eliminar ${opt.label}`}
                      onClick={(e) => removeOne(opt.value, e)}
                      className={styles.chipRemove}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        className={styles.iconXs}
                        aria-hidden="true"
                      >
                        <path d="M2.22 2.22a.75.75 0 011.06 0L6 4.94l2.72-2.72a.75.75 0 111.06 1.06L7.06 6l2.72 2.72a.75.75 0 11-1.06 1.06L6 7.06 3.28 9.78a.75.75 0 01-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 010-1.06z" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span
                  className={cn(styles.chip, styles.chipOverflow, chipSizeClass[size])}
                  aria-label={`${hiddenCount} selecciones más`}
                >
                  +{hiddenCount} más
                </span>
              )}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}

          {/* Right side: clear all + chevron */}
          <span className={styles.triggerRight}>
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                aria-label="Eliminar todas las selecciones"
                onClick={clearAll}
                className={cn(styles.clearAll, error && styles.clearAllError)}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={styles.iconSm}
                  aria-hidden="true"
                >
                  <path d="M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z" />
                </svg>
              </button>
            )}
            <span
              aria-hidden="true"
              className={cn(
                styles.chevron,
                isOpen && styles.chevronOpen,
                error
                  ? styles.chevronError
                  : focused
                    ? styles.chevronFocused
                    : undefined
              )}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconMd}>
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
          <div className={styles.dropdownWrapper}>
            <div className={styles.dropdown}>
              {/* Search */}
              <div className={styles.searchWrapper}>
                <div className={styles.searchInputWrapper}>
                  <span aria-hidden="true" className={styles.searchIcon}>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={styles.iconSm}
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
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* Listbox */}
              {loading ? (
                <div
                  className={styles.loadingWrapper}
                  aria-live="polite"
                  aria-label="Cargando opciones"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={styles.spinnerIcon}
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
                  </svg>
                  <span>Cargando...</span>
                </div>
              ) : (
                <ul
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable="true"
                  aria-label="Opciones"
                  onKeyDown={handleListboxKeyDown}
                  className={styles.listbox}
                >
                  {/* Select All */}
                  {showSelectAll && selectableFiltered.length > 0 && (
                    <li
                      role="option"
                      aria-selected={allFilteredSelected}
                      tabIndex={0}
                      onClick={handleSelectAll}
                      onKeyDown={handleSelectAllKeyDown}
                      className={cn(styles.option, styles.optionSelectAll)}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          styles.optionCheckbox,
                          allFilteredSelected && styles.optionCheckboxSelected
                        )}
                      >
                        {allFilteredSelected && (
                          <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            className={styles.iconCheckmark}
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {selectAllLabel}
                    </li>
                  )}

                  {filtered.length === 0 ? (
                    <li className={styles.noResults}>Sin resultados</li>
                  ) : (
                    renderOptions()
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Helper / Error message */}
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

MultiSelect.displayName = 'MultiSelect';
