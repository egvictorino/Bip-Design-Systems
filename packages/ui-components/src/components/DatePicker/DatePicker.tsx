import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useClickOutside } from '../../lib/useClickOutside';
import { addDays, dateKey, getDaysInMonth, getMondayOffset, isSameDay, monthIndex } from '../../lib/dateHelpers';
import styles from './DatePicker.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  /** Fechas individuales a deshabilitar (adicional al rango min/max) */
  disabledDates?: Date[];
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  fullWidth?: boolean;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const triggerSizeClass: Record<NonNullable<DatePickerProps['size']>, string> = {
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
};

const labelSizeClass: Record<NonNullable<DatePickerProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<DatePickerProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_NAMES_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

// Module-level formatters — created once, reused across all instances
const DISPLAY_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const DAY_ARIA_LABEL_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const formatDisplay = (date: Date): string => DISPLAY_FORMATTER.format(date);

// ─── CalendarGrid (internal) ──────────────────────────────────────────────────

interface CalendarGridProps {
  viewDate: Date;
  selectedDate: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  focusedDate: Date | null;
  onSelectDay: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onFocusDay: (date: Date) => void;
  onViewDateChange: (date: Date) => void;
  headingId: string;
}

const CalendarGrid = ({
  viewDate,
  selectedDate,
  today,
  min,
  max,
  disabledDates,
  focusedDate,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onFocusDay,
  onViewDateChange,
  headingId,
}: CalendarGridProps) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const [calendarView, setCalendarView] = useState<'days' | 'months'>('days');
  const [pickerYear, setPickerYear] = useState(year);
  const gridRef = useRef<HTMLDivElement>(null);

  const viewIdx = monthIndex(viewDate);
  const canGoPrev = !min || viewIdx > monthIndex(min);
  const canGoNext = !max || viewIdx < monthIndex(max);

  const minDay = useMemo(
    () => (min ? new Date(min.getFullYear(), min.getMonth(), min.getDate()) : null),
    [min]
  );
  const maxDay = useMemo(
    () => (max ? new Date(max.getFullYear(), max.getMonth(), max.getDate()) : null),
    [max]
  );

  const disabledSet = useMemo(
    () => new Set((disabledDates ?? []).map((d) => dateKey(d))),
    [disabledDates]
  );

  const isDisabledDate = useCallback(
    (d: Date): boolean => {
      if (minDay && d < minDay) return true;
      if (maxDay && d > maxDay) return true;
      if (disabledSet.has(dateKey(d))) return true;
      return false;
    },
    [minDay, maxDay, disabledSet]
  );

  const isTodayDisabled = useMemo(() => isDisabledDate(today), [isDisabledDate, today]);

  // Memoized grid cells: leading nulls (offset) + day numbers 1..daysInMonth
  const cells = useMemo(() => {
    const offset = getMondayOffset(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const arr: (number | null)[] = [
      ...Array<null>(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  // Auto-focus the focused day button when focusedDate changes (keyboard nav or open)
  useEffect(() => {
    if (!focusedDate || calendarView !== 'days') return;
    const key = dateKey(focusedDate);
    const btn = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`);
    btn?.focus({ preventScroll: true });
  }, [focusedDate, calendarView]);

  const handleShowMonthPicker = () => {
    setPickerYear(viewDate.getFullYear());
    setCalendarView('months');
  };

  const handleSelectMonth = (mIdx: number) => {
    onViewDateChange(new Date(pickerYear, mIdx, 1));
    setCalendarView('days');
  };

  // ── Month picker year nav ─────────────────────────────────────────────────

  const canGoPrevYear = !min || pickerYear > min.getFullYear();
  const canGoNextYear = !max || pickerYear < max.getFullYear();

  const isMonthDisabled = (mIdx: number): boolean => {
    if (!minDay && !maxDay) return false;
    const lastDay = new Date(pickerYear, mIdx + 1, 0);
    const firstDay = new Date(pickerYear, mIdx, 1);
    if (minDay && lastDay < minDay) return true;
    if (maxDay && firstDay > maxDay) return true;
    return false;
  };

  // ── Month picker view ─────────────────────────────────────────────────────

  if (calendarView === 'months') {
    return (
      <div className={styles.calendarGrid}>
        {/* Year navigation */}
        <div className={styles.monthNav}>
          <button
            type="button"
            onClick={() => setPickerYear((y) => y - 1)}
            disabled={!canGoPrevYear}
            aria-label="Año anterior"
            className={styles.monthNavBtn}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconMd} aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10.78 3.22a.75.75 0 0 1 0 1.06L7.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className={styles.monthHeading}>{pickerYear}</span>

          <button
            type="button"
            onClick={() => setPickerYear((y) => y + 1)}
            disabled={!canGoNextYear}
            aria-label="Año siguiente"
            className={styles.monthNavBtn}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconMd} aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.22 3.22a.75.75 0 0 0 0 1.06L8.94 8 5.22 11.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06L6.28 3.22a.75.75 0 0 0-1.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 4×3 month grid */}
        <div role="grid" aria-label="Seleccionar mes" className={styles.monthPickerGrid}>
          {MONTH_NAMES_SHORT.map((name, idx) => {
            const isCurrent = pickerYear === year && idx === month;
            const disabled = isMonthDisabled(idx);
            return (
              <div key={name} role="gridcell">
                <button
                  type="button"
                  onClick={() => handleSelectMonth(idx)}
                  disabled={disabled}
                  aria-label={`${MONTH_NAMES[idx]} ${pickerYear}`}
                  aria-pressed={isCurrent}
                  className={cn(styles.monthPickerBtn, isCurrent && styles.monthPickerBtnCurrent)}
                >
                  {name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Days view ─────────────────────────────────────────────────────────────

  return (
    <div className={styles.calendarGrid}>
      {/* Month navigation */}
      <div className={styles.monthNav}>
        <button
          type="button"
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          aria-label="Mes anterior"
          className={styles.monthNavBtn}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconMd} aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10.78 3.22a.75.75 0 0 1 0 1.06L7.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Heading is now a button to open month/year picker */}
        <button
          type="button"
          id={headingId}
          onClick={handleShowMonthPicker}
          aria-label={`${MONTH_NAMES[month]} ${year} — Seleccionar mes y año`}
          className={styles.monthHeadingBtn}
        >
          {MONTH_NAMES[month]} {year}
        </button>

        <button
          type="button"
          onClick={onNextMonth}
          disabled={!canGoNext}
          aria-label="Mes siguiente"
          className={styles.monthNavBtn}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconMd} aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.22 3.22a.75.75 0 0 0 0 1.06L8.94 8 5.22 11.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06L6.28 3.22a.75.75 0 0 0-1.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Day grid — roving tabindex + keyboard navigation */}
      <div
        ref={gridRef}
        role="grid"
        tabIndex={-1}
        aria-labelledby={headingId}
        className={styles.dayGrid}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (!focusedDate) return;

          const moveToDay = (delta: number) => {
            const next = addDays(focusedDate, delta);
            const changedMonth =
              next.getMonth() !== focusedDate.getMonth() ||
              next.getFullYear() !== focusedDate.getFullYear();
            onFocusDay(next);
            if (changedMonth) {
              if (delta < 0) onPrevMonth();
              else onNextMonth();
            }
          };

          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              moveToDay(-1);
              break;
            case 'ArrowRight':
              e.preventDefault();
              moveToDay(1);
              break;
            case 'ArrowUp':
              e.preventDefault();
              moveToDay(-7);
              break;
            case 'ArrowDown':
              e.preventDefault();
              moveToDay(7);
              break;
            case 'Home':
              e.preventDefault();
              onFocusDay(new Date(focusedDate.getFullYear(), focusedDate.getMonth(), 1));
              break;
            case 'End':
              e.preventDefault();
              onFocusDay(new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 0));
              break;
            case 'PageUp': {
              e.preventDefault();
              const prevM = focusedDate.getMonth() - 1;
              const prevY = focusedDate.getFullYear();
              const dayPU = Math.min(focusedDate.getDate(), getDaysInMonth(prevY, prevM));
              onFocusDay(new Date(prevY, prevM, dayPU));
              onPrevMonth();
              break;
            }
            case 'PageDown': {
              e.preventDefault();
              const nextM = focusedDate.getMonth() + 1;
              const nextY = focusedDate.getFullYear();
              const dayPD = Math.min(focusedDate.getDate(), getDaysInMonth(nextY, nextM));
              onFocusDay(new Date(nextY, nextM, dayPD));
              onNextMonth();
              break;
            }
            case 'Enter':
            case ' ':
              e.preventDefault();
              if (!isDisabledDate(focusedDate)) {
                onSelectDay(focusedDate);
              }
              break;
          }
        }}
      >
        {/* Column headers */}
        {DAY_LABELS.map((d) => (
          <div key={d} role="columnheader" className={styles.columnHeader}>
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} role="gridcell" />;
          }

          const cellDate = new Date(year, month, day);
          const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
          const isToday = isSameDay(cellDate, today);
          const isDisabled = isDisabledDate(cellDate);
          const isFocused = focusedDate ? isSameDay(cellDate, focusedDate) : false;

          return (
            // aria-selected belongs on the gridcell per WAI-ARIA grid pattern
            <div key={day} role="gridcell" aria-selected={isSelected || undefined} className={styles.dayCell}>
              <button
                type="button"
                disabled={isDisabled}
                tabIndex={isFocused ? 0 : -1}
                data-date={dateKey(cellDate)}
                onClick={() => onSelectDay(cellDate)}
                aria-label={DAY_ARIA_LABEL_FORMATTER.format(cellDate)}
                className={cn(
                  styles.dayBtn,
                  isSelected
                    ? styles.dayBtnSelected
                    : isToday
                      ? styles.dayBtnToday
                      : undefined
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Today shortcut */}
      <div className={styles.todaySection}>
        <button
          type="button"
          onClick={() => onSelectDay(today)}
          disabled={isTodayDisabled}
          className={styles.todayBtn}
        >
          Hoy
        </button>
      </div>
    </div>
  );
};

CalendarGrid.displayName = 'CalendarGrid';

// ─── DatePicker ───────────────────────────────────────────────────────────────

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value = null,
      onChange,
      min,
      max,
      disabledDates,
      placeholder = 'DD/MM/AAAA',
      label,
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      size = 'md',
      id,
      fullWidth = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const headingId = `${inputId}-heading`;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const containerRef = useRef<HTMLDivElement>(null);

    // Stable "today" — computed once at mount, used as viewDate fallback
    const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);

    const [viewDate, setViewDate] = useState<Date>(() => value ?? today);

    // Memoize display string — avoids reformatting on every render
    const displayValue = useMemo(() => (value ? formatDisplay(value) : ''), [value]);

    // Sync viewDate: track value (use today when cleared to null)
    useEffect(() => {
      setViewDate(value ?? today);
    }, [value, today]);

    // Close on outside click
    useClickOutside(containerRef, () => setIsOpen(false));

    // Close on Escape
    useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const handleToggle = () => {
      if (!isOpen) {
        // Initialize focused date when opening
        setFocusedDate(value ?? today);
      }
      setIsOpen((v) => !v);
    };

    const handleSelectDay = (date: Date) => {
      onChange?.(date);
      setIsOpen(false);
    };

    const handleClear = () => {
      onChange?.(null);
    };

    const handlePrevMonth = () => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
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
            onClick={handleToggle}
            className={cn(
              styles.trigger,
              triggerSizeClass[size],
              error && styles.triggerError,
              disabled && styles.triggerDisabled,
              className
            )}
          >
            <span className={displayValue ? styles.triggerValue : styles.triggerPlaceholder}>
              {displayValue || placeholder}
            </span>
          </button>

          {/* Trailing icon: clear button when value is set, calendar icon otherwise */}
          {value && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar fecha"
              className={cn(styles.clearBtn, error && styles.clearBtnError)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={styles.iconMd} aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          ) : (
            <span
              className={cn(
                styles.calendarIcon,
                error && styles.calendarIconError,
                disabled && styles.calendarIconDisabled
              )}
              aria-hidden="true"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={styles.iconMd}>
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}

          {/* Calendar popover */}
          {isOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Calendario"
              className={styles.popover}
            >
              <CalendarGrid
                viewDate={viewDate}
                selectedDate={value ?? null}
                today={today}
                min={min}
                max={max}
                disabledDates={disabledDates}
                focusedDate={focusedDate}
                onSelectDay={handleSelectDay}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onFocusDay={setFocusedDate}
                onViewDateChange={setViewDate}
                headingId={headingId}
              />
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

DatePicker.displayName = 'DatePicker';
