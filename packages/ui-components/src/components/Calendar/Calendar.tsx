"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn.js';
import { addDays, isSameDay } from '../../lib/dateHelpers.js';
import { useThemeAttributes } from '../ThemeProvider/index.js';
import { useBipLocale } from '../../i18n/index.js';
import type { DateRange } from '../DateRangePicker/DateRangePicker.js';
import styles from './Calendar.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type CalendarEventStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: CalendarEventStatus;
  doctorId?: string;
  patientName?: string;
  treatmentType?: string;
  color?: string;
  notes?: string;
}

export interface CalendarResource {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface CalendarSlotInfo {
  start: Date;
  end: Date;
  doctorId?: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  view: CalendarView;
  date: Date;
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (slotInfo: CalendarSlotInfo) => void;
  onRangeSelect?: (range: DateRange) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
  minTime?: string;
  maxTime?: string;
  step?: 15 | 30 | 60;
  className?: string;
  disabled?: boolean;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addMinutes(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 60000);
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfWeek(d: Date): Date {
  const r = startOfDay(d);
  const day = r.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday
  r.setDate(r.getDate() + diff);
  return r;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function minutesToTimeStr(m: number): string {
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

function setTimeFromMinutes(base: Date, minutes: number): Date {
  const r = new Date(base);
  r.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return r;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HOUR_HEIGHT = 60; // px per hour

const STATUS_CLASSES: Record<CalendarEventStatus, string> = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

// ─── CalendarHeader ───────────────────────────────────────────────────────────

interface CalendarHeaderProps {
  view: CalendarView;
  date: Date;
  onViewChange: (v: CalendarView) => void;
  onDateChange: (d: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ view, date, onViewChange, onDateChange }) => {
  const t = useBipLocale();

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(t.locale, { month: 'long', year: 'numeric' }),
    [t.locale]
  );
  const dayLongFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(t.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [t.locale]
  );

  const views = useMemo(
    () =>
      (['month', 'week', 'day', 'agenda'] as const).map((value) => ({
        value,
        label: t.calendar.views[value],
      })),
    [t.calendar.views]
  );

  const title = useMemo(() => {
    if (view === 'month') {
      return monthFormatter.format(date).replace(/^\w/, (c) => c.toUpperCase());
    }
    if (view === 'week') {
      const mon = startOfWeek(date);
      const sun = addDays(mon, 6);
      if (mon.getMonth() === sun.getMonth()) {
        return `${mon.getDate()} – ${sun.getDate()} ${new Intl.DateTimeFormat(t.locale, { month: 'short', year: 'numeric' }).format(sun)}`;
      }
      return `${mon.getDate()} ${new Intl.DateTimeFormat(t.locale, { month: 'short' }).format(mon)} – ${sun.getDate()} ${new Intl.DateTimeFormat(t.locale, { month: 'short', year: 'numeric' }).format(sun)}`;
    }
    if (view === 'day') {
      return dayLongFormatter.format(date).replace(/^\w/, (c) => c.toUpperCase());
    }
    return t.calendar.upcomingEvents;
  }, [view, date, monthFormatter, dayLongFormatter, t.calendar.upcomingEvents, t.locale]);

  const handlePrev = () => {
    if (view === 'month') onDateChange(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    else if (view === 'week') onDateChange(addDays(date, -7));
    else onDateChange(addDays(date, -1));
  };

  const handleNext = () => {
    if (view === 'month') onDateChange(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    else if (view === 'week') onDateChange(addDays(date, 7));
    else onDateChange(addDays(date, 1));
  };

  const handleToday = () => onDateChange(new Date());

  return (
    <div className={styles.header}>
      {/* Nav */}
      <div className={styles.headerNav}>
        <button
          type="button"
          aria-label={t.calendar.prevPeriod}
          onClick={handlePrev}
          className={styles.headerNavBtn}
        >
          <svg aria-hidden="true" className={styles.headerNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleToday}
          className={styles.headerTodayBtn}
        >
          {t.calendar.today}
        </button>
        <button
          type="button"
          aria-label={t.calendar.nextPeriod}
          onClick={handleNext}
          className={styles.headerNavBtn}
        >
          <svg aria-hidden="true" className={styles.headerNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h2 className={styles.headerTitle}>{title}</h2>

      {/* View switcher */}
      <div className={styles.viewSwitcher}>
        {views.map((v) => (
          <button
            key={v.value}
            type="button"
            aria-pressed={view === v.value}
            onClick={() => onViewChange(v.value)}
            className={cn(
              styles.viewBtn,
              view === v.value ? styles.viewBtnActive : styles.viewBtnInactive
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
};
CalendarHeader.displayName = 'CalendarHeader';

// ─── EventChip (MonthView) ────────────────────────────────────────────────────

interface EventChipProps {
  event: CalendarEvent;
  resources?: CalendarResource[];
  onClick: (e: CalendarEvent) => void;
  onDragStart: (e: React.DragEvent, event: CalendarEvent) => void;
}

const EventChip = React.memo<EventChipProps>(({ event, resources, onClick, onDragStart }) => {
  const t = useBipLocale();
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(t.locale, { hour: '2-digit', minute: '2-digit', hour12: false }),
    [t.locale]
  );
  const doctor = resources?.find((r) => r.id === event.doctorId);
  const customStyle = event.color
    ? { borderLeftColor: event.color, backgroundColor: event.color + '26' }
    : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart(e, event); }}
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(event)}
      aria-label={`${event.title}, ${timeFormatter.format(event.start)}, ${t.calendar.statusLabels[event.status]}`}
      style={customStyle}
      className={cn(styles.eventChip, !event.color && STATUS_CLASSES[event.status])}
    >
      <span className={styles.eventChipTime}>{timeFormatter.format(event.start)}</span>{' '}
      {event.title}
      {doctor && (
        <span
          className={styles.eventChipDoctorDot}
          style={{ backgroundColor: doctor.color }}
          aria-hidden="true"
        />
      )}
    </div>
  );
});
EventChip.displayName = 'EventChip';

// ─── EventBlock (TimeGrid) ────────────────────────────────────────────────────

interface EventBlockProps {
  event: CalendarEvent;
  resources?: CalendarResource[];
  topPct: number;
  heightPct: number;
  leftPct: number;
  widthPct: number;
  onClick: (e: CalendarEvent) => void;
  onDragStart: (e: React.DragEvent, event: CalendarEvent, offsetMinutes: number) => void;
  onResizeStart: (e: React.MouseEvent, event: CalendarEvent) => void;
}

const EventBlock = React.memo<EventBlockProps>(({
  event, resources, topPct, heightPct, leftPct, widthPct,
  onClick, onDragStart, onResizeStart,
}) => {
  const t = useBipLocale();
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(t.locale, { hour: '2-digit', minute: '2-digit', hour12: false }),
    [t.locale]
  );
  const doctor = resources?.find((r) => r.id === event.doctorId);
  const durationMin = (event.end.getTime() - event.start.getTime()) / 60000;
  const offsetAtDragStart = useRef(0);

  const handleDragStart = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const offsetMin = Math.round((relY / rect.height) * durationMin);
    offsetAtDragStart.current = offsetMin;
    onDragStart(e, event, offsetMin);
  };

  const customStyle = event.color
    ? { borderLeftColor: event.color, backgroundColor: event.color + '26', color: event.color }
    : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(event)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(event)}
      aria-label={`${event.title}, ${timeFormatter.format(event.start)} – ${timeFormatter.format(event.end)}, ${t.calendar.statusLabels[event.status]}`}
      style={{
        position: 'absolute',
        top: `${topPct}%`,
        height: `${Math.max(heightPct, 2)}%`,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        ...customStyle,
      }}
      className={cn(styles.eventBlock, !event.color && STATUS_CLASSES[event.status])}
    >
      <div className={styles.eventBlockTitle}>{event.title}</div>
      {heightPct > 4 && (
        <div className={styles.eventBlockMeta}>
          {event.patientName && <span>{event.patientName}</span>}
          {event.patientName && event.treatmentType && <span> · </span>}
          {event.treatmentType && <span>{event.treatmentType}</span>}
        </div>
      )}
      {doctor && heightPct > 6 && (
        <div className={styles.eventBlockDoctor}>
          <span
            className={styles.eventBlockDoctorDot}
            style={{ backgroundColor: doctor.color }}
            aria-hidden="true"
          />
          {doctor.name}
        </div>
      )}
      {/* Resize handle */}
      <div
        className={styles.eventBlockResizeHandle}
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, event); }}
        aria-hidden="true"
      />
    </div>
  );
});
EventBlock.displayName = 'EventBlock';

// ─── RangePopover ─────────────────────────────────────────────────────────────

interface RangePopoverProps {
  start: Date;
  end: Date; // exclusive (day after last selected)
  position: { top: number; left: number };
  onConfirm: () => void;
  onClose: () => void;
}

const RangePopover = React.memo<RangePopoverProps>(({ start, end, position, onConfirm, onClose }) => {
  const t = useBipLocale();
  const displayEnd = addDays(end, -1); // back to inclusive for display
  const fmt = (d: Date) =>
    d.toLocaleDateString(t.locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const label = isSameDay(start, displayEnd) ? fmt(start) : `${fmt(start)} — ${fmt(displayEnd)}`;
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div {...themeAttrs} style={{ display: 'contents', ...themeStyle }}>
      <div className={styles.rangeOverlay} aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.calendar.selectedDateRange}
        style={{ top: position.top, left: position.left }}
        className={styles.rangePopover}
      >
        <div className={styles.rangePopoverHeader}>
          <span className={styles.rangePopoverLabel}>{label}</span>
          <button
            onClick={onClose}
            aria-label={t.calendar.close}
            className={styles.rangePopoverClose}
          >
            ✕
          </button>
        </div>
        <button
          onClick={onConfirm}
          className={styles.rangePopoverConfirm}
        >
          {t.calendar.createEvent}
        </button>
      </div>
    </div>,
    document.body
  );
});
RangePopover.displayName = 'RangePopover';

// ─── MonthView ────────────────────────────────────────────────────────────────

interface MonthViewProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  date: Date;
  onEventClick: (e: CalendarEvent) => void;
  onEventCreate?: (info: CalendarSlotInfo) => void;
  onRangeSelect?: (range: DateRange) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onDateChange?: (d: Date) => void;
  onViewChange?: (v: CalendarView) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  events, resources, date, onEventClick, onEventCreate, onRangeSelect, onEventMove, onDateChange, onViewChange,
}) => {
  const t = useBipLocale();
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(t.locale, { month: 'long', year: 'numeric' }),
    [t.locale]
  );
  const today = useMemo(() => startOfDay(new Date()), []);

  // ── Range popover state ────────────────────────────────────────────────────
  const [rangePopover, setRangePopover] = useState<{
    start: Date;
    end: Date;
    position: { top: number; left: number };
  } | null>(null);

  // ── Range selection state ──────────────────────────────────────────────────
  const [rangeAnchor, setRangeAnchorState] = useState<Date | null>(null);
  const [rangeHover, setRangeHoverState] = useState<Date | null>(null);
  const rangeAnchorRef = useRef<Date | null>(null);
  const rangeHoverRef = useRef<Date | null>(null);
  const isSelectingRef = useRef(false);

  const setRangeAnchor = useCallback((d: Date | null) => {
    rangeAnchorRef.current = d;
    setRangeAnchorState(d);
  }, []);
  const setRangeHover = useCallback((d: Date | null) => {
    rangeHoverRef.current = d;
    setRangeHoverState(d);
  }, []);

  const rangeMin = useMemo(() => {
    if (!rangeAnchor || !rangeHover) return null;
    return startOfDay(rangeAnchor <= rangeHover ? rangeAnchor : rangeHover);
  }, [rangeAnchor, rangeHover]);

  const rangeMax = useMemo(() => {
    if (!rangeAnchor || !rangeHover) return null;
    return startOfDay(rangeAnchor <= rangeHover ? rangeHover : rangeAnchor);
  }, [rangeAnchor, rangeHover]);

  const isInRange = useCallback(
    (d: Date): boolean => {
      if (!rangeMin || !rangeMax) return false;
      const day = startOfDay(d);
      return day >= rangeMin && day <= rangeMax;
    },
    [rangeMin, rangeMax]
  );

  // Build 6×7 grid starting on Monday (must be defined before finalizeRange)
  const cells = useMemo(() => {
    const monthStart = startOfMonth(date);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [date]);

  const finalizeRange = useCallback(() => {
    isSelectingRef.current = false;
    const anchor = rangeAnchorRef.current;
    const hover = rangeHoverRef.current;
    const min = anchor && hover ? startOfDay(anchor <= hover ? anchor : hover) : null;
    const max = anchor && hover ? startOfDay(anchor <= hover ? hover : anchor) : null;

    if (min && max) {
      if (isSameDay(min, max)) {
        onEventCreate?.({ start: min, end: addDays(min, 1) });
      } else {
        // Position popover below the cell corresponding to max
        const maxIdx = cells.findIndex((c) => isSameDay(c, max));
        const cellEl = maxIdx >= 0 ? document.querySelector(`[data-cell-idx="${maxIdx}"]`) : null;
        const rect = cellEl?.getBoundingClientRect();
        const top = rect
          ? Math.min(rect.bottom + 8, window.innerHeight - 132)
          : window.innerHeight / 2;
        const left = rect
          ? Math.min(rect.left, window.innerWidth - 272)
          : window.innerWidth / 2 - 128;
        setRangePopover({ start: min, end: addDays(max, 1), position: { top, left } });
      }
    }

    setRangeAnchor(null);
    setRangeHover(null);
  }, [cells, onEventCreate, setRangeAnchor, setRangeHover]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelectingRef.current) finalizeRange();
    };
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [finalizeRange]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = startOfDay(ev.start).toISOString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const dragEventRef = useRef<CalendarEvent | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData('eventId', event.id);
    dragEventRef.current = event;
  }, []);

  const handleDrop = (e: React.DragEvent, cellDate: Date) => {
    e.preventDefault();
    const ev = dragEventRef.current;
    if (!ev || !onEventMove) return;
    const duration = ev.end.getTime() - ev.start.getTime();
    const newStart = new Date(cellDate.getTime());
    newStart.setHours(ev.start.getHours(), ev.start.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);
    onEventMove(ev, newStart, newEnd, ev.doctorId);
    dragEventRef.current = null;
  };

  return (
    <div className={styles.monthView}>
      {/* Day headers */}
      <div className={styles.monthDayHeaders}>
        {t.calendar.dayNames.map((d) => (
          <div key={d} className={styles.monthDayHeader}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        role="grid"
        aria-label={t.calendar.monthLabel(monthFormatter.format(date))}
        tabIndex={0}
        className={styles.monthGrid}
        onMouseMove={(e) => {
          if (!isSelectingRef.current) return;
          const el = document.elementFromPoint(e.clientX, e.clientY);
          const cellEl = el?.closest('[data-cell-idx]');
          if (!cellEl) return;
          const idxStr = cellEl.getAttribute('data-cell-idx');
          if (idxStr === null) return;
          const hoverDate = cells[parseInt(idxStr, 10)];
          if (hoverDate) setRangeHover(startOfDay(hoverDate));
        }}
        onMouseUp={() => {
          if (!isSelectingRef.current) return;
          finalizeRange();
        }}
      >
        {chunk(cells, 7).map((week, weekIdx) => (
          // display: contents keeps these as direct CSS grid items of .monthGrid (so the
          // 7-column layout is unaffected) while giving each gridcell the role="row" ARIA
          // parent it requires — see aria-required-parent under axe.
          <div role="row" style={{ display: 'contents' }} key={weekIdx}>
            {week.map((cellDate, i) => {
              const idx = weekIdx * 7 + i;
              const key = startOfDay(cellDate).toISOString();
              const dayEvents = eventsByDay.get(key) ?? [];
              const isCurrentMonth = cellDate.getMonth() === date.getMonth();
              const isToday = isSameDay(cellDate, today);
              const visible = dayEvents.slice(0, 3);
              const overflow = dayEvents.length - 3;
              const inRange = isInRange(cellDate);

              const handleCellKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onEventCreate?.({ start: startOfDay(cellDate), end: addDays(startOfDay(cellDate), 1) });
                }
              };

              return (
                <div
                  key={idx}
                  role="gridcell"
                  tabIndex={0}
                  data-cell-idx={idx}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, cellDate)}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    isSelectingRef.current = true;
                    setRangeAnchor(startOfDay(cellDate));
                    setRangeHover(startOfDay(cellDate));
                  }}
                  onMouseEnter={() => {
                    if (!isSelectingRef.current) return;
                    setRangeHover(startOfDay(cellDate));
                  }}
                  onKeyDown={handleCellKeyDown}
                  className={cn(
                    styles.monthCell,
                    inRange
                      ? styles.monthCellInRange
                      : cn(
                          styles.monthCellDefault,
                          !isCurrentMonth && styles.monthCellOtherMonth,
                          isToday && styles.monthCellToday
                        )
                  )}
                >
                  <div className={styles.monthCellDateRow}>
                    <span
                      className={cn(
                        styles.monthCellDateNum,
                        isToday ? styles.monthCellDateNumToday : undefined
                      )}
                    >
                      {cellDate.getDate()}
                    </span>
                  </div>
                  <div>
                    {visible.map((ev) => (
                      <EventChip
                        key={ev.id}
                        event={ev}
                        resources={resources}
                        onClick={onEventClick}
                        onDragStart={handleDragStart}
                      />
                    ))}
                    {overflow > 0 && (
                      <button
                        type="button"
                        className={styles.monthCellOverflow}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateChange?.(cellDate);
                          onViewChange?.('day');
                        }}
                      >
                        {t.calendar.overflowCount(overflow)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {rangePopover && (
        <RangePopover
          start={rangePopover.start}
          end={rangePopover.end}
          position={rangePopover.position}
          onConfirm={() => {
            onRangeSelect?.({ from: rangePopover.start, to: rangePopover.end });
            setRangePopover(null);
          }}
          onClose={() => setRangePopover(null)}
        />
      )}
    </div>
  );
};
MonthView.displayName = 'MonthView';

// ─── TimeGrid (shared by WeekView & DayView) ──────────────────────────────────

interface TimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  resources?: CalendarResource[];
  minMinutes: number;
  maxMinutes: number;
  step: number;
  onEventClick: (e: CalendarEvent) => void;
  onEventCreate?: (info: CalendarSlotInfo) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
}

const TimeGrid: React.FC<TimeGridProps> = ({
  days, events, resources, minMinutes, maxMinutes, step,
  onEventClick, onEventCreate, onEventMove, onEventResize,
}) => {
  const t = useBipLocale();
  const today = useMemo(() => startOfDay(new Date()), []);
  const rangeMinutes = maxMinutes - minMinutes;
  const totalHeight = (rangeMinutes / 60) * HOUR_HEIGHT;

  // Hour labels
  const hourSlots = useMemo(() => {
    const slots: number[] = [];
    for (let m = minMinutes; m <= maxMinutes; m += 60) slots.push(m);
    return slots;
  }, [minMinutes, maxMinutes]);

  // Columns: if resources → days × resources, else → days
  const columns = useMemo(() => {
    if (resources && resources.length > 0) {
      return days.flatMap((day) =>
        resources.map((res) => ({ day, resource: res }))
      );
    }
    return days.map((day) => ({ day, resource: null as CalendarResource | null }));
  }, [days, resources]);

  // Map events to columns
  const eventsByColumn = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const col of columns) {
      const colKey = col.day.toISOString() + (col.resource?.id ?? '');
      const colEvents = events.filter((ev) => {
        const sameDay = isSameDay(ev.start, col.day);
        const sameRes = col.resource ? ev.doctorId === col.resource.id : true;
        return sameDay && sameRes;
      });
      map.set(colKey, colEvents);
    }
    return map;
  }, [columns, events]);

  const dragEventRef = useRef<CalendarEvent | null>(null);
  const dragOffsetRef = useRef(0);
  const resizeRef = useRef<{ event: CalendarEvent; startY: number; colEl: HTMLElement } | null>(null);

  const handleEventDragStart = useCallback((e: React.DragEvent, event: CalendarEvent, offsetMin: number) => {
    e.dataTransfer.setData('eventId', event.id);
    dragEventRef.current = event;
    dragOffsetRef.current = offsetMin;
  }, []);

  const handleColDrop = (e: React.DragEvent, col: { day: Date; resource: CalendarResource | null }) => {
    e.preventDefault();
    const ev = dragEventRef.current;
    if (!ev || !onEventMove) return;
    const colEl = e.currentTarget as HTMLElement;
    const rect = colEl.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const clickedMin = minMinutes + Math.round((relY / totalHeight) * rangeMinutes);
    const snapped = Math.round(clickedMin / step) * step;
    const startMin = snapped - dragOffsetRef.current;
    const duration = (ev.end.getTime() - ev.start.getTime()) / 60000;
    const newStart = setTimeFromMinutes(col.day, Math.max(minMinutes, Math.min(maxMinutes - duration, startMin)));
    const newEnd = addMinutes(newStart, duration);
    onEventMove(ev, newStart, newEnd, col.resource?.id ?? ev.doctorId);
    dragEventRef.current = null;
  };

  const handleColClick = (
    e: React.MouseEvent,
    col: { day: Date; resource: CalendarResource | null }
  ) => {
    if (!onEventCreate) return;
    const colEl = e.currentTarget as HTMLElement;
    const rect = colEl.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const clickedMin = minMinutes + Math.round((relY / totalHeight) * rangeMinutes);
    const snapped = Math.round(clickedMin / step) * step;
    const start = setTimeFromMinutes(col.day, snapped);
    const end = addMinutes(start, step);
    onEventCreate({ start, end, doctorId: col.resource?.id });
  };

  const handleResizeStart = useCallback((e: React.MouseEvent, event: CalendarEvent) => {
    const colEl = (e.currentTarget as HTMLElement).closest('[data-timegrid-col]') as HTMLElement;
    if (!colEl) return;
    resizeRef.current = { event, startY: e.clientY, colEl };
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMouseMove = (_e: MouseEvent) => {
      // visual feedback could be added here
    };
    const onMouseUp = (e: MouseEvent) => {
      const r = resizeRef.current;
      if (!r || !onEventResize) { resizeRef.current = null; return; }
      const rect = r.colEl.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const endMin = minMinutes + Math.round((relY / totalHeight) * rangeMinutes);
      const snapped = Math.round(endMin / step) * step;
      const clamped = Math.max(
        timeToMinutes(minutesToTimeStr(minMinutes)) + step,
        Math.min(maxMinutes, snapped)
      );
      const newEnd = setTimeFromMinutes(r.event.start, clamped);
      if (newEnd > r.event.start) onEventResize(r.event, newEnd);
      resizeRef.current = null;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [minMinutes, maxMinutes, rangeMinutes, step, totalHeight, onEventResize]);

  // Compute event position within a column
  const getEventPosition = (ev: CalendarEvent) => {
    const startMin = ev.start.getHours() * 60 + ev.start.getMinutes();
    const endMin = ev.end.getHours() * 60 + ev.end.getMinutes();
    const topPct = ((startMin - minMinutes) / rangeMinutes) * 100;
    const heightPct = ((endMin - startMin) / rangeMinutes) * 100;
    return { topPct, heightPct };
  };

  return (
    <div className={styles.timeGrid}>
      {/* Time labels */}
      <div className={styles.timeLabels}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          {hourSlots.slice(0, -1).map((m) => (
            <div
              key={m}
              className={styles.timeLabelItem}
              style={{ top: ((m - minMinutes) / rangeMinutes) * totalHeight - 8 }}
            >
              {minutesToTimeStr(m)}
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className={styles.timeColumnsOuter}>
        <div className={styles.timeColumnsInner}>
          {columns.map((col) => {
            const colKey = col.day.toISOString() + (col.resource?.id ?? '');
            const colEvents = eventsByColumn.get(colKey) ?? [];
            const isToday = isSameDay(col.day, today);

            return (
              <div
                key={colKey}
                className={styles.timeColumn}
              >
                {/* Column header */}
                <div
                  className={cn(
                    styles.timeColumnHeader,
                    isToday && styles.timeColumnHeaderToday
                  )}
                >
                  <div className={cn(styles.timeColumnHeaderWeekday, isToday && styles.timeColumnHeaderWeekdayToday)}>
                    {new Intl.DateTimeFormat(t.locale, { weekday: 'short' }).format(col.day).replace('.', '').toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      styles.timeColumnHeaderDay,
                      isToday && styles.timeColumnHeaderDayToday
                    )}
                  >
                    {col.day.getDate()}
                  </div>
                  {col.resource && (
                    <div className={styles.timeColumnResourceRow}>
                      <span
                        className={styles.timeColumnResourceDot}
                        style={{ backgroundColor: col.resource.color }}
                        aria-hidden="true"
                      />
                      <span className={styles.timeColumnResourceName}>{col.resource.name}</span>
                    </div>
                  )}
                </div>

                {/* Time slots */}
                <div
                  data-timegrid-col="true"
                  role="presentation"
                  className={styles.timeSlots}
                  style={{ height: totalHeight }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleColDrop(e, col)}
                  onClick={(e) => handleColClick(e, col)}
                >
                  {/* Horizontal grid lines */}
                  {hourSlots.slice(0, -1).map((m) => (
                    <div
                      key={m}
                      className={styles.timeGridLine}
                      style={{ top: ((m - minMinutes) / rangeMinutes) * totalHeight }}
                      aria-hidden="true"
                    />
                  ))}

                  {/* Events */}
                  {colEvents.map((ev) => {
                    const { topPct, heightPct } = getEventPosition(ev);
                    return (
                      <EventBlock
                        key={ev.id}
                        event={ev}
                        resources={resources}
                        topPct={topPct}
                        heightPct={heightPct}
                        leftPct={1}
                        widthPct={98}
                        onClick={onEventClick}
                        onDragStart={handleEventDragStart}
                        onResizeStart={handleResizeStart}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
TimeGrid.displayName = 'TimeGrid';

// ─── WeekView ─────────────────────────────────────────────────────────────────

interface WeekViewProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  date: Date;
  minMinutes: number;
  maxMinutes: number;
  step: number;
  onEventClick: (e: CalendarEvent) => void;
  onEventCreate?: (info: CalendarSlotInfo) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ date, ...rest }) => {
  const days = useMemo(() => {
    const mon = startOfWeek(date);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }, [date]);

  return <TimeGrid days={days} {...rest} />;
};
WeekView.displayName = 'WeekView';

// ─── DayView ──────────────────────────────────────────────────────────────────

interface DayViewProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  date: Date;
  minMinutes: number;
  maxMinutes: number;
  step: number;
  onEventClick: (e: CalendarEvent) => void;
  onEventCreate?: (info: CalendarSlotInfo) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, ...rest }) => {
  const days = useMemo(() => [startOfDay(date)], [date]);
  return <TimeGrid days={days} {...rest} />;
};
DayView.displayName = 'DayView';

// ─── AgendaView ───────────────────────────────────────────────────────────────

interface AgendaViewProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  date: Date;
  onEventClick: (e: CalendarEvent) => void;
}

const AGENDA_FILTER_ACTIVE_CLASSES: Record<CalendarEventStatus, string> = {
  pending: styles.agendaFilterActivePending,
  confirmed: styles.agendaFilterActiveConfirmed,
  completed: styles.agendaFilterActiveCompleted,
  cancelled: styles.agendaFilterActiveCancelled,
};

const AgendaView: React.FC<AgendaViewProps> = ({ events, resources, date, onEventClick }) => {
  const t = useBipLocale();
  const dayFullFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(t.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [t.locale]
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(t.locale, { hour: '2-digit', minute: '2-digit', hour12: false }),
    [t.locale]
  );
  const statusFilterConfig = useMemo(
    () =>
      (['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => ({
        status,
        label: t.calendar.statusLabels[status],
      })),
    [t.calendar.statusLabels]
  );

  const [activeStatuses, setActiveStatuses] = useState<Set<CalendarEventStatus>>(
    () => new Set(['pending', 'confirmed', 'completed', 'cancelled'])
  );

  const today = useMemo(() => startOfDay(new Date()), []);

  const toggleStatus = useCallback((status: CalendarEventStatus) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  const hasEventsInRange = useMemo(() => {
    const horizon = addDays(date, 30);
    return events.some((ev) => ev.start >= date && ev.start <= horizon);
  }, [events, date]);

  const groups = useMemo(() => {
    const horizon = addDays(date, 30);
    const filtered = events
      .filter((ev) => ev.start >= date && ev.start <= horizon && activeStatuses.has(ev.status))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const map = new Map<string, CalendarEvent[]>();
    for (const ev of filtered) {
      const key = startOfDay(ev.start).toISOString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return Array.from(map.entries()).map(([key, evs]) => ({
      date: new Date(key),
      events: evs,
    }));
  }, [events, date, activeStatuses]);

  return (
    <div className={styles.agendaView}>
      {/* Filter chips */}
      <div className={styles.agendaFilters}>
        {statusFilterConfig.map(({ status, label }) => (
          <button
            key={status}
            role="checkbox"
            aria-checked={activeStatuses.has(status)}
            onClick={() => toggleStatus(status)}
            className={cn(
              styles.agendaFilterBtn,
              activeStatuses.has(status)
                ? AGENDA_FILTER_ACTIVE_CLASSES[status]
                : styles.agendaFilterBtnInactive
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {groups.length === 0 ? (
        <div className={styles.agendaEmpty}>
          <svg
            aria-hidden="true"
            className={styles.agendaEmptyIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
          </svg>
          <p className={styles.agendaEmptyText}>
            {hasEventsInRange ? t.calendar.noEventsFiltered : t.calendar.noEventsUpcoming}
          </p>
        </div>
      ) : (
        <div className={styles.agendaList}>
          {groups.map(({ date: groupDate, events: groupEvents }) => {
            const isToday = isSameDay(groupDate, today);
            return (
              <div key={groupDate.toISOString()} className={styles.agendaGroup}>
                {/* Sticky day header */}
                <div className={styles.agendaDayHeader}>
                  <h3
                    className={cn(
                      styles.agendaDayTitle,
                      isToday && styles.agendaDayTitleToday
                    )}
                  >
                    {dayFullFormatter.format(groupDate)}
                    {isToday && (
                      <span className={styles.agendaTodayBadge}>
                        {t.calendar.today}
                      </span>
                    )}
                  </h3>
                </div>
                <div className={styles.agendaEvents}>
                  {groupEvents.map((ev) => {
                    const doctor = resources?.find((r) => r.id === ev.doctorId);
                    return (
                      <div
                        key={ev.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onEventClick(ev)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEventClick(ev)}
                        aria-label={`${ev.title}, ${timeFormatter.format(ev.start)}, ${t.calendar.statusLabels[ev.status]}`}
                        className={cn(
                          styles.agendaEventCard,
                          ev.status === 'cancelled' && styles.agendaEventCardCancelled
                        )}
                      >
                        {/* Time */}
                        <div className={styles.agendaEventTime}>
                          {timeFormatter.format(ev.start)}
                          <div className={styles.agendaEventTimeEnd}>
                            {timeFormatter.format(ev.end)}
                          </div>
                        </div>

                        {/* Color bar */}
                        <div
                          className={styles.agendaEventColorBar}
                          style={{
                            backgroundColor:
                              ev.color ??
                              (ev.status === 'pending'
                                ? 'var(--color-warning)'
                                : ev.status === 'confirmed'
                                  ? 'var(--color-primary)'
                                  : ev.status === 'completed'
                                    ? 'var(--color-success)'
                                    : 'var(--color-edge-disabled)'),
                          }}
                          aria-hidden="true"
                        />

                        {/* Content */}
                        <div className={styles.agendaEventContent}>
                          <div className={styles.agendaEventTitle}>{ev.title}</div>
                          {ev.patientName && (
                            <div className={styles.agendaEventSubtext}>
                              {ev.patientName}
                            </div>
                          )}
                          {ev.treatmentType && (
                            <div className={styles.agendaEventSubtext}>
                              {ev.treatmentType}
                            </div>
                          )}
                          {ev.notes && (
                            <div className={styles.agendaEventNotes}>
                              {ev.notes}
                            </div>
                          )}
                        </div>

                        {/* Doctor + Status */}
                        <div className={styles.agendaEventMeta}>
                          <span className={cn(styles.agendaStatusBadge, {
                            [styles.agendaStatusPending]: ev.status === 'pending',
                            [styles.agendaStatusConfirmed]: ev.status === 'confirmed',
                            [styles.agendaStatusCompleted]: ev.status === 'completed',
                            [styles.agendaStatusCancelled]: ev.status === 'cancelled',
                          })}>
                            {t.calendar.statusLabels[ev.status]}
                          </span>
                          {doctor && (
                            <div className={styles.agendaDoctorRow}>
                              <span
                                className={styles.agendaDoctorDot}
                                style={{ backgroundColor: doctor.color }}
                                aria-hidden="true"
                              />
                              {doctor.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
AgendaView.displayName = 'AgendaView';

// ─── Calendar (root) ──────────────────────────────────────────────────────────

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      events,
      resources,
      view,
      date,
      onViewChange,
      onDateChange,
      onEventClick,
      onEventCreate,
      onRangeSelect,
      onEventMove,
      onEventResize,
      minTime = '07:00',
      maxTime = '20:00',
      step = 30,
      className,
      disabled = false,
    },
    ref
  ) => {
    const t = useBipLocale();
    const [dragging, setDragging] = useState(false);

    const minMinutes = useMemo(() => timeToMinutes(minTime), [minTime]);
    const maxMinutes = useMemo(() => timeToMinutes(maxTime), [maxTime]);

    const handleEventClick = useCallback(
      (ev: CalendarEvent) => {
        if (disabled) return;
        onEventClick?.(ev);
      },
      [onEventClick, disabled]
    );

    const handleViewChange = useCallback(
      (v: CalendarView) => {
        if (disabled) return;
        onViewChange?.(v);
      },
      [onViewChange, disabled]
    );

    const handleDateChange = useCallback(
      (d: Date) => {
        if (disabled) return;
        onDateChange?.(d);
      },
      [onDateChange, disabled]
    );

    const handleEventCreate = useCallback(
      (info: CalendarSlotInfo) => {
        if (disabled) return;
        onEventCreate?.(info);
      },
      [onEventCreate, disabled]
    );

    const handleRangeSelect = useCallback(
      (range: DateRange) => {
        if (disabled) return;
        onRangeSelect?.(range);
      },
      [onRangeSelect, disabled]
    );

    const handleEventMove = useCallback(
      (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => {
        if (disabled) return;
        onEventMove?.(event, start, end, doctorId);
      },
      [onEventMove, disabled]
    );

    const handleEventResize = useCallback(
      (event: CalendarEvent, newEnd: Date) => {
        if (disabled) return;
        onEventResize?.(event, newEnd);
      },
      [onEventResize, disabled]
    );

    // Suppress unused warning
    void dragging;
    void setDragging;

    const sharedTimeGridProps = {
      events,
      resources,
      minMinutes,
      maxMinutes,
      step,
      onEventClick: handleEventClick,
      onEventCreate: handleEventCreate,
      onEventMove: handleEventMove,
      onEventResize: handleEventResize,
    };

    return (
      <div
        ref={ref}
        role="application"
        aria-label={t.calendar.calendarLabel}
        aria-disabled={disabled || undefined}
        className={cn(styles.calendar, disabled && styles.disabled, className)}
      >
        <CalendarHeader
          view={view}
          date={date}
          onViewChange={handleViewChange}
          onDateChange={handleDateChange}
        />

        {view === 'month' && (
          <MonthView
            events={events}
            resources={resources}
            date={date}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onRangeSelect={handleRangeSelect}
            onEventMove={handleEventMove}
            onDateChange={handleDateChange}
            onViewChange={handleViewChange}
          />
        )}

        {view === 'week' && <WeekView date={date} {...sharedTimeGridProps} />}
        {view === 'day' && <DayView date={date} {...sharedTimeGridProps} />}

        {view === 'agenda' && (
          <AgendaView
            events={events}
            resources={resources}
            date={date}
            onEventClick={handleEventClick}
          />
        )}
      </div>
    );
  }
);
Calendar.displayName = 'Calendar';
