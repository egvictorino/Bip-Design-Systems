import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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
  /** Earliest selectable time in "HH:mm" 24-hour format */
  minTime?: string;
  /** Latest selectable time in "HH:mm" 24-hour format */
  maxTime?: string;
  /**
   * Trigger interaction mode (default: 'picker').
   * 'text': renders an editable input; clicking the clock icon opens the picker.
   * Note: when using 'text', pass createRef<HTMLInputElement>() for the ref prop.
   */
  inputMode?: 'picker' | 'text';
  /** Hour display cycle (default: '24'). value/onChange always use 24-hour "HH:mm". */
  hourCycle?: '12' | '24';
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

// ─── Constants ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const ITEM_HEIGHT = 36; // h-9 = 36px

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad2 = (n: number) => n.toString().padStart(2, '0');

const getMinutes = (step: number) =>
  Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);

const parseTime = (time?: string): { hour: number | null; minute: number | null } => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return { hour: null, minute: null };
  const [h, m] = time.split(':').map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return { hour: null, minute: null };
  return { hour: h, minute: m };
};

const to12h = (hour24: number): { hour12: number; period: 'AM' | 'PM' } => ({
  hour12: hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24,
  period: hour24 < 12 ? 'AM' : 'PM',
});

const to24h = (hour12: number, period: 'AM' | 'PM'): number => {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
};

const format12hDisplay = (value: string): string => {
  const { hour, minute } = parseTime(value);
  if (hour === null || minute === null) return value;
  const { hour12, period } = to12h(hour);
  return `${pad2(hour12)}:${pad2(minute)} ${period}`;
};

/** Snap minute DOWN to the nearest valid step (max constraint). */
const snapToStep = (minute: number, step: number) => Math.floor(minute / step) * step;

/** Snap minute UP to the nearest valid step (min constraint). */
const snapToStepUp = (minute: number, step: number) => Math.ceil(minute / step) * step;

const TEXT_TIME_RE = /^([0-1]?\d|2[0-3]):([0-5]\d)$/;

// ─── TimeColumn (internal) ────────────────────────────────────────────────────

interface TimeColumnProps {
  label: string;
  options: number[];
  selected: number | null;
  onSelect: (value: number) => void;
  focusedIndex: number | null;
  onFocusChange: (index: number) => void;
  isDisabled?: (value: number) => boolean;
}

const TimeColumn = ({
  label,
  options,
  selected,
  onSelect,
  focusedIndex,
  onFocusChange,
  isDisabled,
}: TimeColumnProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const listId = useId();

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

  // Scroll keyboard-focused item into view
  useEffect(() => {
    if (focusedIndex === null || !listRef.current) return;
    const el = listRef.current.children[focusedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex]);

  const activeId =
    focusedIndex !== null ? `${listId}-opt-${options[focusedIndex]}` : undefined;

  const findNext = (from: number, dir: 1 | -1): number => {
    let next = from + dir;
    while (next >= 0 && next < options.length) {
      if (!isDisabled?.(options[next])) return next;
      next += dir;
    }
    return from; // no valid target — stay
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const current =
      focusedIndex ?? (selected !== null ? options.indexOf(selected) : -1);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onFocusChange(findNext(current, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        onFocusChange(findNext(current, -1));
        break;
      case 'Home':
        e.preventDefault();
        onFocusChange(findNext(-1, 1));
        break;
      case 'End':
        e.preventDefault();
        onFocusChange(findNext(options.length, -1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex !== null && !isDisabled?.(options[focusedIndex])) {
          onSelect(options[focusedIndex]);
        }
        break;
    }
  };

  return (
    <div className={styles.timeColumn}>
      <div className={styles.timeColumnHeader}>{label}</div>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        aria-activedescendant={activeId}
        tabIndex={0}
        className={styles.timeColumnList}
        onKeyDown={handleKeyDown}
      >
        {options.map((opt, idx) => {
          const disabled = isDisabled?.(opt) ?? false;
          return (
            <button
              key={opt}
              id={`${listId}-opt-${opt}`}
              type="button"
              role="option"
              aria-selected={selected === opt}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              tabIndex={-1}
              onClick={() => onSelect(opt)}
              className={cn(
                styles.timeOption,
                selected === opt && styles.timeOptionSelected,
                focusedIndex === idx && styles.timeOptionFocused,
                disabled && styles.timeOptionDisabled
              )}
            >
              {pad2(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

TimeColumn.displayName = 'TimeColumn';

// ─── PeriodColumn (internal) ──────────────────────────────────────────────────

interface PeriodColumnProps {
  selected: 'AM' | 'PM';
  onSelect: (period: 'AM' | 'PM') => void;
}

const PeriodColumn: React.FC<PeriodColumnProps> = ({ selected, onSelect }) => (
  <div className={cn(styles.timeColumn, styles.periodColumn)}>
    <div className={styles.timeColumnHeader}>AM/PM</div>
    <div className={styles.periodList} role="listbox" aria-label="AM/PM">
      {(['AM', 'PM'] as const).map((period) => (
        <button
          key={period}
          type="button"
          role="option"
          aria-selected={selected === period}
          tabIndex={-1}
          onClick={() => onSelect(period)}
          className={cn(
            styles.timeOption,
            selected === period && styles.timeOptionSelected
          )}
        >
          {period}
        </button>
      ))}
    </div>
  </div>
);

PeriodColumn.displayName = 'PeriodColumn';

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
      minTime,
      maxTime,
      inputMode = 'picker',
      hourCycle = '24',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedHourIdx, setFocusedHourIdx] = useState<number | null>(null);
    const [focusedMinuteIdx, setFocusedMinuteIdx] = useState<number | null>(null);
    const [announcement, setAnnouncement] = useState('');
    // Text input mode state
    const [textValue, setTextValue] = useState(value ?? '');
    const [textValid, setTextValid] = useState(true);

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;
    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const internalTriggerRef = useRef<HTMLButtonElement>(null);

    // Combine forwarded ref with internal ref (picker mode only)
    const setTriggerRef = (node: HTMLButtonElement | null) => {
      internalTriggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as { current: HTMLButtonElement | null }).current = node;
      }
    };

    // ── Derived from value ──────────────────────────────────────────────────

    const { hour: selectedHour, minute: selectedMinute } = useMemo(
      () => parseTime(value),
      [value]
    );

    const minutes = useMemo(() => getMinutes(step), [step]);

    // Period is always derived from the current value (no separate state needed)
    const selectedPeriod: 'AM' | 'PM' =
      selectedHour !== null ? (selectedHour < 12 ? 'AM' : 'PM') : 'AM';

    // Hours array for the current hourCycle
    const hoursOptions = hourCycle === '12' ? HOURS_12 : HOURS;

    // For the hours column, the selected value is in display space
    const selectedHourDisplay =
      hourCycle === '12' && selectedHour !== null
        ? to12h(selectedHour).hour12
        : selectedHour;

    // ── Sync text input when value prop changes ─────────────────────────────

    useEffect(() => {
      if (inputMode !== 'text') return;
      setTextValue(value ?? '');
      setTextValid(true);
    }, [value, inputMode]);

    // ── min/max parsing ─────────────────────────────────────────────────────

    const { hour: minHour, minute: minMinute } = useMemo(
      () => parseTime(minTime),
      [minTime]
    );
    const { hour: maxHour, minute: maxMinute } = useMemo(
      () => parseTime(maxTime),
      [maxTime]
    );

    // ── Auto-adjust value when outside min/max ──────────────────────────────

    useEffect(() => {
      if (value === undefined || !onChange) return;
      const { hour, minute } = parseTime(value);
      if (hour === null || minute === null) return;

      let adjH = hour;
      let adjM = minute;

      if (minHour !== null && hour < minHour) {
        adjH = minHour;
        adjM = minMinute !== null ? snapToStepUp(minMinute, step) : 0;
      } else if (maxHour !== null && hour > maxHour) {
        adjH = maxHour;
        adjM = maxMinute !== null ? snapToStep(maxMinute, step) : 0;
      } else if (
        minHour !== null &&
        hour === minHour &&
        minMinute !== null &&
        minute < minMinute
      ) {
        adjM = snapToStepUp(minMinute, step);
      } else if (
        maxHour !== null &&
        hour === maxHour &&
        maxMinute !== null &&
        minute > maxMinute
      ) {
        adjM = snapToStep(maxMinute, step);
      }

      if (adjH !== hour || adjM !== minute) {
        onChange(`${pad2(adjH)}:${pad2(adjM)}`);
      }
    }, [value, minHour, minMinute, maxHour, maxMinute, step, onChange]);

    // ── Disabled predicates ─────────────────────────────────────────────────

    const isHourDisabled = useCallback(
      (hour: number): boolean => {
        if (minHour !== null && hour < minHour) return true;
        if (maxHour !== null && hour > maxHour) return true;
        return false;
      },
      [minHour, maxHour]
    );

    const isMinuteDisabled = useCallback(
      (minute: number): boolean => {
        if (selectedHour === null) return false;
        if (
          minHour !== null &&
          selectedHour === minHour &&
          minMinute !== null &&
          minute < minMinute
        )
          return true;
        if (
          maxHour !== null &&
          selectedHour === maxHour &&
          maxMinute !== null &&
          minute > maxMinute
        )
          return true;
        return false;
      },
      [selectedHour, minHour, minMinute, maxHour, maxMinute]
    );

    // For 12h mode: wrap isHourDisabled to accept display (12h) values
    const isHour12Disabled = useCallback(
      (hour12: number): boolean => isHourDisabled(to24h(hour12, selectedPeriod)),
      [isHourDisabled, selectedPeriod]
    );

    // ── Close on outside click ──────────────────────────────────────────────

    useEffect(() => {
      const onMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, []);

    // ── Close on Escape, return focus to trigger ────────────────────────────

    useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          internalTriggerRef.current?.focus();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // ── Focus panel on open ─────────────────────────────────────────────────

    useEffect(() => {
      if (isOpen) {
        panelRef.current?.focus();
      }
    }, [isOpen]);

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleToggle = () => {
      if (!isOpen) {
        // Initialize focused indices to the currently selected item (or 0)
        let hIdx: number;
        if (hourCycle === '12' && selectedHour !== null) {
          const disp = to12h(selectedHour).hour12;
          hIdx = HOURS_12.indexOf(disp);
        } else {
          hIdx = selectedHour !== null ? HOURS.indexOf(selectedHour) : 0;
        }
        const mIdx = selectedMinute !== null ? minutes.indexOf(selectedMinute) : 0;
        setFocusedHourIdx(hIdx !== -1 ? hIdx : 0);
        setFocusedMinuteIdx(mIdx !== -1 ? mIdx : 0);
      }
      setIsOpen((v) => !v);
    };

    const handleHourSelect = (hour: number) => {
      // hour is a display value from hoursOptions; convert to 24h when in 12h mode
      const actualHour = hourCycle === '12' ? to24h(hour, selectedPeriod) : hour;
      const min = selectedMinute ?? 0;
      onChange?.(`${pad2(actualHour)}:${pad2(min)}`);
      setAnnouncement(`Hora ${pad2(actualHour)} seleccionada`);
      // Panel stays open so user can also pick the minute
    };

    const handleMinuteSelect = (minute: number) => {
      const actualHour = selectedHour ?? 0;
      onChange?.(`${pad2(actualHour)}:${pad2(minute)}`);
      setAnnouncement(`${pad2(actualHour)}:${pad2(minute)} seleccionado`);
      setIsOpen(false);
    };

    const handlePeriodSelect = (period: 'AM' | 'PM') => {
      if (selectedHour !== null) {
        const { hour12 } = to12h(selectedHour);
        const newHour24 = to24h(hour12, period);
        const min = selectedMinute ?? 0;
        onChange?.(`${pad2(newHour24)}:${pad2(min)}`);
        setAnnouncement(`${period} seleccionado`);
      }
    };

    const handleNow = () => {
      const now = new Date();
      const h = now.getHours();
      const m = Math.floor(now.getMinutes() / step) * step;
      onChange?.(`${pad2(h)}:${pad2(m)}`);
      setIsOpen(false);
    };

    // Text input mode handlers
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setTextValue(raw);
      if (TEXT_TIME_RE.test(raw)) {
        const [h, m] = raw.split(':').map(Number);
        setTextValid(true);
        onChange?.(`${pad2(h)}:${pad2(m)}`);
      } else {
        setTextValid(raw === '');
      }
    };

    const handleTextBlur = () => {
      if (!textValid && textValue !== '') {
        setTextValue(value ?? '');
        setTextValid(true);
      }
    };

    // ── Display value for the trigger ───────────────────────────────────────

    const displayValue =
      value && hourCycle === '12' ? format12hDisplay(value) : value;

    const textInputHasError = error || (!textValid && textValue !== '');

    // ── Render ──────────────────────────────────────────────────────────────

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
          {inputMode === 'text' ? (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              type="text"
              value={textValue}
              placeholder={placeholder}
              disabled={disabled}
              aria-describedby={messageId}
              aria-invalid={textInputHasError || undefined}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              className={cn(
                styles.trigger,
                styles.triggerText,
                triggerSizeClass[size],
                textInputHasError && styles.triggerError,
                disabled && styles.triggerDisabled,
                className
              )}
            />
          ) : (
            <button
              ref={setTriggerRef}
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
          )}

          {/* Clock icon — clickable in text mode to toggle the picker */}
          {inputMode === 'text' ? (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              aria-label="Abrir selector de hora"
              onClick={handleToggle}
              className={cn(
                styles.clockIconBtn,
                error && styles.clockIconError,
                disabled && styles.clockIconDisabled
              )}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className={styles.iconMd}>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
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
          )}

          {/* Time panel popover */}
          {isOpen && (
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Seleccionar hora"
              tabIndex={-1}
              className={styles.popover}
            >
              <div className={styles.columnsWrapper}>
                <TimeColumn
                  label="Horas"
                  options={hoursOptions}
                  selected={selectedHourDisplay}
                  onSelect={handleHourSelect}
                  focusedIndex={focusedHourIdx}
                  onFocusChange={setFocusedHourIdx}
                  isDisabled={hourCycle === '12' ? isHour12Disabled : isHourDisabled}
                />
                <TimeColumn
                  label="Minutos"
                  options={minutes}
                  selected={selectedMinute}
                  onSelect={handleMinuteSelect}
                  focusedIndex={focusedMinuteIdx}
                  onFocusChange={setFocusedMinuteIdx}
                  isDisabled={isMinuteDisabled}
                />
                {hourCycle === '12' && (
                  <PeriodColumn selected={selectedPeriod} onSelect={handlePeriodSelect} />
                )}
              </div>

              {/* Now shortcut */}
              <div className={styles.nowSection}>
                <button type="button" onClick={handleNow} className={styles.nowBtn}>
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

        {/* Screen-reader live region — always in DOM, outside the conditional panel */}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles.srOnly}
        >
          {announcement}
        </span>
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
