import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import styles from './TimePicker.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimePickerProps {
  /** Time in "HH:mm" 24-hour format */
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Minute step interval (default: 5) */
  step?: 5 | 10 | 15 | 30;
  id?: string;
  fullWidth?: boolean;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const triggerSizeClass: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
};

const labelSizeClass: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const pad2 = (n: number) => n.toString().padStart(2, '0');
const getMinutes = (step: number) =>
  Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);

const parseTime = (time?: string): { hour: number | null; minute: number | null } => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return { hour: null, minute: null };
  const [h, m] = time.split(':').map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return { hour: null, minute: null };
  return { hour: h, minute: m };
};

// ─── TimeColumn (internal) ────────────────────────────────────────────────────

const ITEM_HEIGHT = 36; // h-9 = 36px

interface TimeColumnProps {
  label: string;
  options: number[];
  selected: number | null;
  onSelect: (value: number) => void;
}

const TimeColumn = ({ label, options, selected, onSelect }: TimeColumnProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // Reset scroll flag when selection is cleared so next selection scrolls correctly
  if (selected === null) {
    hasScrolled.current = false;
  }

  // Scroll selected item into view on mount / when selection first appears
  useEffect(() => {
    if (hasScrolled.current || selected === null || !listRef.current) return;
    hasScrolled.current = true;
    const idx = options.indexOf(selected);
    if (idx === -1) return;
    listRef.current.scrollTop = Math.max(0, idx * ITEM_HEIGHT - ITEM_HEIGHT);
  }, [selected, options]);

  return (
    <div className={styles.timeColumn}>
      <div className={styles.timeColumnHeader}>{label}</div>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        className={styles.timeColumnList}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="option"
            aria-selected={selected === opt}
            onClick={() => onSelect(opt)}
            className={cn(
              styles.timeOption,
              selected === opt && styles.timeOptionSelected
            )}
          >
            {pad2(opt)}
          </button>
        ))}
      </div>
    </div>
  );
};

TimeColumn.displayName = 'TimeColumn';

// ─── TimePicker ───────────────────────────────────────────────────────────────

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'HH:MM',
      label,
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      size = 'md',
      step = 5,
      id,
      fullWidth = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const containerRef = useRef<HTMLDivElement>(null);

    // Memoized — avoids re-parsing on every render
    const { hour: selectedHour, minute: selectedMinute } = useMemo(
      () => parseTime(value),
      [value]
    );

    // Memoized — step is stable in practice but cheap to guard
    const minutes = useMemo(() => getMinutes(step), [step]);

    // Close on outside click
    useEffect(() => {
      const onMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, []);

    // Close on Escape
    useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const handleHourSelect = (hour: number) => {
      const min = selectedMinute ?? 0;
      onChange?.(`${pad2(hour)}:${pad2(min)}`);
      // Keep panel open so the user can also pick/confirm the minute
    };

    const handleMinuteSelect = (minute: number) => {
      const hr = selectedHour ?? 0;
      onChange?.(`${pad2(hr)}:${pad2(minute)}`);
      setIsOpen(false);
    };

    const handleNow = () => {
      const now = new Date();
      const h = now.getHours();
      const m = Math.floor(now.getMinutes() / step) * step;
      onChange?.(`${pad2(h)}:${pad2(m)}`);
      setIsOpen(false);
    };

    return (
      <div
        ref={containerRef}
        className={cn(styles.container, fullWidth && styles.containerFullWidth)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error ? styles.labelError : styles.labelNormal,
              disabled && styles.labelDisabled
            )}
          >
            {label}
          </label>
        )}

        <div className={cn(styles.triggerWrapper, fullWidth && styles.triggerWrapperFullWidth)}>
          <button
            ref={ref}
            id={inputId}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-describedby={messageId}
            onClick={() => setIsOpen((v) => !v)}
            className={cn(
              styles.trigger,
              triggerSizeClass[size],
              error && styles.triggerError,
              disabled && styles.triggerDisabled,
              className
            )}
          >
            <span className={value ? styles.triggerValue : styles.triggerPlaceholder}>
              {value || placeholder}
            </span>
          </button>

          {/* Clock icon */}
          <span
            className={cn(
              styles.clockIcon,
              error && styles.clockIconError,
              disabled && styles.clockIconDisabled
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.iconMd}>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Time panel popover */}
          {isOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Seleccionar hora"
              className={styles.popover}
            >
              <div className={styles.columnsWrapper}>
                <TimeColumn
                  label="Horas"
                  options={HOURS}
                  selected={selectedHour}
                  onSelect={handleHourSelect}
                />
                <TimeColumn
                  label="Minutos"
                  options={minutes}
                  selected={selectedMinute}
                  onSelect={handleMinuteSelect}
                />
              </div>

              {/* Now shortcut */}
              <div className={styles.nowSection}>
                <button
                  type="button"
                  onClick={handleNow}
                  className={styles.nowBtn}
                >
                  Ahora
                </button>
              </div>
            </div>
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

TimePicker.displayName = 'TimePicker';
