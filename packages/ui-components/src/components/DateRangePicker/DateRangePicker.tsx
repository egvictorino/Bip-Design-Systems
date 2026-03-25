import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
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

const getMondayOffset = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isInRange = (date: Date, from: Date | null, to: Date | null): boolean => {
  if (!from || !to) return false;
  return date > from && date < to;
};

const monthIndex = (d: Date): number => d.getFullYear() * 12 + d.getMonth();

// ─── RangeCalendarGrid (internal) ─────────────────────────────────────────────

interface RangeCalendarGridProps {
  viewDate: Date;
  range: DateRange;
  hoverDate: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  onSelectDay: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onHoverDay: (date: Date | null) => void;
  headingId: string;
}

const RangeCalendarGrid = ({
  viewDate,
  range,
  hoverDate,
  today,
  min,
  max,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onHoverDay,
  headingId,
}: RangeCalendarGridProps) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const viewIdx = monthIndex(viewDate);
  const canGoPrev = !min || viewIdx > monthIndex(min);
  const canGoNext = !max || viewIdx < monthIndex(max);

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

  const minDay = min ? new Date(min.getFullYear(), min.getMonth(), min.getDate()) : null;
  const maxDay = max ? new Date(max.getFullYear(), max.getMonth(), max.getDate()) : null;

  // Preview range end (hover while from is set but to is not)
  const previewTo = range.from && !range.to ? hoverDate : null;
  const rangeStart = range.from;
  const rangeEnd = range.to ?? previewTo;

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

        <span id={headingId} className={styles.monthHeading}>
          {MONTH_NAMES[month]} {year}
        </span>

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

      {/* Day grid */}
      <div role="grid" aria-labelledby={headingId} className={styles.dayGrid}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            role="columnheader"
            className={styles.dayHeader}
          >
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
          const isDisabled =
            (!!minDay && cellDate < minDay) || (!!maxDay && cellDate > maxDay);

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
            onClick={() => onSelectDay(new Date(0))} // signal handled in parent
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

    const handleSelectDay = (date: Date) => {
      // Special sentinel: clear selection (date = epoch)
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
            onClick={() => setIsOpen((v) => !v)}
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
                onSelectDay={handleSelectDay}
                onPrevMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                onNextMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                onHoverDay={setHoverDate}
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
