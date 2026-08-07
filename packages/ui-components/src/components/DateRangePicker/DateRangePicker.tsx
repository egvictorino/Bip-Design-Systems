"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';
import { useClickOutside } from '../../hooks/useClickOutside';
import { addDays, dateKey, getDaysInMonth, getMondayOffset, isSameDay, monthIndex } from '../../lib/dateHelpers';
import styles from './DateRangePicker.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
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

// ─── Static style maps ────────────────────────────────────────────────────────

const triggerSizeStyles: Record<NonNullable<DateRangePickerProps['size']>, string> = {
  sm: styles.triggerSm,
  md: styles.triggerMd,
  lg: styles.triggerLg,
};

const labelSizeStyles: Record<NonNullable<DateRangePickerProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeStyles: Record<NonNullable<DateRangePickerProps['size']>, string> = {
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

const DISPLAY_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const DAY_ARIA_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const formatDisplay = (date: Date): string => DISPLAY_FORMATTER.format(date);

const isInRange = (date: Date, from: Date | null, to: Date | null): boolean => {
  if (!from || !to) return false;
  return date > from && date < to;
};

// ─── RangeCalendarGrid (internal) ─────────────────────────────────────────────

interface RangeCalendarGridProps {
  viewDate: Date;
  range: DateRange;
  hoverDate: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  disabledSet: Set<string>;
  focusedDate: Date | null;
  onSelectDay: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onHoverDay: (date: Date | null) => void;
  onFocusDay: (date: Date) => void;
  onViewDateChange: (date: Date) => void;
  headingId: string;
}

const RangeCalendarGrid = ({
  viewDate,
  range,
  hoverDate,
  today,
  min,
  max,
  disabledSet,
  focusedDate,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onHoverDay,
  onFocusDay,
  onViewDateChange,
  headingId,
}: RangeCalendarGridProps) => {
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

  const isDisabledDate = useCallback(
    (d: Date): boolean => {
      if (minDay && d < minDay) return true;
      if (maxDay && d > maxDay) return true;
      if (disabledSet.has(dateKey(d))) return true;
      return false;
    },
    [minDay, maxDay, disabledSet]
  );

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

  // Preview range end (hover while from is set but to is not)
  const previewTo = range.from && !range.to ? hoverDate : null;
  const rangeStart = range.from;
  const rangeEnd = range.to ?? previewTo;

  // Auto-focus the focused day button when focusedDate changes
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
            className={cn(
              styles.navButton,
              canGoPrevYear ? styles.navButtonEnabled : styles.navButtonDisabled
            )}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconSm} aria-hidden="true">
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
            className={cn(
              styles.navButton,
              canGoNextYear ? styles.navButtonEnabled : styles.navButtonDisabled
            )}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconSm} aria-hidden="true">
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
                  className={cn(
                    styles.monthPickerBtn,
                    isCurrent && styles.monthPickerBtnCurrent,
                    disabled && styles.monthPickerBtnDisabled
                  )}
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
          className={cn(
            styles.navButton,
            canGoPrev ? styles.navButtonEnabled : styles.navButtonDisabled
          )}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconSm} aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10.78 3.22a.75.75 0 0 1 0 1.06L7.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Heading is a button to open month/year picker */}
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
          className={cn(
            styles.navButton,
            canGoNext ? styles.navButtonEnabled : styles.navButtonDisabled
          )}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className={styles.iconSm} aria-hidden="true">
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
        aria-labelledby={headingId}
        tabIndex={-1}
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
              onFocusDay(
                new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 0)
              );
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
        {DAY_LABELS.map((d) => (
          <div key={d} role="columnheader" className={styles.dayHeader}>
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} role="gridcell" />;
          }

          const cellDate = new Date(year, month, day);
          const isFrom = rangeStart ? isSameDay(cellDate, rangeStart) : false;
          const isTo = rangeEnd ? isSameDay(cellDate, rangeEnd) : false;
          const inRange = isInRange(cellDate, rangeStart, rangeEnd);
          const isToday = isSameDay(cellDate, today);
          const isDisabled = isDisabledDate(cellDate);
          const isFocused = focusedDate ? isSameDay(cellDate, focusedDate) : false;

          return (
            <div
              key={day}
              role="gridcell"
              aria-selected={(isFrom || isTo) || undefined}
              className={cn(inRange && styles.dayCellInRange)}
            >
              <button
                type="button"
                disabled={isDisabled}
                tabIndex={isFocused ? 0 : -1}
                data-date={dateKey(cellDate)}
                onClick={() => onSelectDay(cellDate)}
                onMouseEnter={() => onHoverDay(cellDate)}
                onMouseLeave={() => onHoverDay(null)}
                aria-label={DAY_ARIA_FORMATTER.format(cellDate)}
                className={cn(
                  styles.dayButton,
                  isDisabled && styles.dayButtonDisabled,
                  (isFrom || isTo)
                    ? styles.dayButtonSelected
                    : isToday
                      ? styles.dayButtonToday
                      : !isDisabled && styles.dayButtonDefault
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Clear shortcut */}
      {(rangeStart || rangeEnd) && (
        <div className={styles.clearFooter}>
          <button
            type="button"
            onClick={() => onSelectDay(new Date(0))} // sentinel: clear
            className={styles.clearButton}
          >
            Limpiar selección
          </button>
        </div>
      )}
    </div>
  );
};

RangeCalendarGrid.displayName = 'RangeCalendarGrid';

// ─── DateRangePicker ──────────────────────────────────────────────────────────

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      disabledDates,
      placeholder = 'DD/MM/AAAA – DD/MM/AAAA',
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
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const headingId = `${inputId}-heading`;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const containerRef = useRef<HTMLDivElement>(null);

    const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    }, []);

    const range = useMemo(() => value ?? { from: null, to: null }, [value]);

    const disabledSet = useMemo(
      () => new Set((disabledDates ?? []).map(dateKey)),
      [disabledDates]
    );

    const [viewDate, setViewDate] = useState<Date>(() => range.from ?? today);

    // Sync viewDate when value changes externally
    useEffect(() => {
      if (range.from) setViewDate(range.from);
    }, [range.from]);

    const displayValue = useMemo(() => {
      if (range.from && range.to) {
        return `${formatDisplay(range.from)} – ${formatDisplay(range.to)}`;
      }
      if (range.from) {
        return `${formatDisplay(range.from)} – ...`;
      }
      return '';
    }, [range]);

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
        setFocusedDate(range.from ?? range.to ?? today);
      }
      setIsOpen((v) => !v);
    };

    const handleSelectDay = (date: Date) => {
      // Sentinel: clear selection
      if (date.getTime() === new Date(0).getTime()) {
        onChange?.({ from: null, to: null });
        return;
      }

      if (!range.from || (range.from && range.to)) {
        // Start new range
        onChange?.({ from: date, to: null });
      } else {
        // Complete range — ensure from <= to
        if (date < range.from) {
          onChange?.({ from: date, to: range.from });
        } else if (isSameDay(date, range.from)) {
          onChange?.({ from: null, to: null });
        } else {
          onChange?.({ from: range.from, to: date });
        }
        setIsOpen(false);
        setHoverDate(null);
      }
    };

    return (
      <div ref={containerRef} className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              styles.label,
              labelSizeStyles[size],
              error ? styles.labelError : styles.labelNormal,
              disabled && styles.labelDisabled
            )}
          >
            {label}
          </label>
        )}

        <div className={cn(styles.triggerWrapper, fullWidth && styles.fullWidth)}>
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
              triggerSizeStyles[size],
              error ? styles.triggerError : undefined,
              disabled ? styles.triggerDisabled : styles.triggerEnabled,
              className
            )}
          >
            <span className={displayValue ? styles.valueText : styles.placeholderText}>
              {displayValue || placeholder}
            </span>
          </button>

          {/* Calendar icon */}
          <span
            className={cn(
              styles.calendarIcon,
              error ? styles.calendarIconError : undefined,
              disabled && styles.calendarIconDisabled
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.iconSm}>
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Calendar popover */}
          {isOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Seleccionar rango de fechas"
              className={styles.popover}
            >
              <RangeCalendarGrid
                viewDate={viewDate}
                range={range}
                hoverDate={hoverDate}
                today={today}
                min={min}
                max={max}
                disabledSet={disabledSet}
                focusedDate={focusedDate}
                onSelectDay={handleSelectDay}
                onPrevMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                onNextMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                onHoverDay={setHoverDate}
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
            className={cn(helperSizeStyles[size], styles.errorText)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span
            id={messageId}
            className={cn(helperSizeStyles[size], styles.helperText)}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
