import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

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

const sizes: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: 'px-[12px] py-[6px] text-xs',
  md: 'px-[20px] py-[10px] text-sm',
  lg: 'px-[24px] py-[12px] text-lg',
};

const labelSizeStyles: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<TimePickerProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
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
    <div className="flex flex-col w-20">
      <div className="text-[10px] font-semibold text-text-secondary text-center py-1.5 border-b border-interaction-tertiary-default">
        {label}
      </div>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        className="overflow-y-auto h-48 py-1"
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="option"
            aria-selected={selected === opt}
            onClick={() => onSelect(opt)}
            className={cn(
              'w-full h-9 flex items-center justify-center text-sm rounded-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default focus-visible:ring-inset',
              selected === opt
                ? 'bg-interaction-primary-default text-text-white font-semibold'
                : 'text-text-primary hover:bg-interaction-tertiary-default'
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
      <div ref={containerRef} className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'font-medium transition-colors',
              labelSizeStyles[size],
              error ? 'text-feedback-error-default' : 'text-text-primary',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        <div className={cn('relative', fullWidth && 'w-full')}>
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
              'w-full text-left rounded-[1px] transition-colors border bg-interaction-field',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              sizes[size],
              'pr-9',
              error
                ? 'border-feedback-error-default focus-visible:ring-feedback-error-default'
                : 'border-interaction-primary-default focus-visible:ring-interaction-primary-default hover:border-interaction-primary-hover',
              disabled ? 'opacity-50 cursor-not-allowed bg-interaction-disabled' : 'cursor-pointer',
              className
            )}
          >
            <span className={value ? 'text-text-primary' : 'text-text-secondary'}>
              {value || placeholder}
            </span>
          </button>

          {/* Clock icon */}
          <span
            className={cn(
              'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2',
              error ? 'text-feedback-error-default' : 'text-text-secondary',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
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
              className="absolute z-50 mt-1 top-full left-0 rounded-lg border border-interaction-tertiary-default bg-white shadow-lg overflow-hidden"
            >
              <div className="flex divide-x divide-interaction-tertiary-default">
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
              <div className="border-t border-interaction-tertiary-default p-2">
                <button
                  type="button"
                  onClick={handleNow}
                  className={cn(
                    'w-full text-xs font-medium py-1.5 rounded transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default',
                    'text-interaction-primary-default hover:bg-interaction-tertiary-default'
                  )}
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

TimePicker.displayName = 'TimePicker';
