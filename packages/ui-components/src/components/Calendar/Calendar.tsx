import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';

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
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onEventResize?: (event: CalendarEvent, newEnd: Date) => void;
  minTime?: string;
  maxTime?: string;
  step?: 15 | 30 | 60;
  className?: string;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

const MONTH_FORMATTER = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' });
const TIME_FORMATTER = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
const DAY_LONG_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// ─── Constants ────────────────────────────────────────────────────────────────

const HOUR_HEIGHT = 60; // px per hour
const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const VIEWS: { value: CalendarView; label: string }[] = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' },
  { value: 'agenda', label: 'Agenda' },
];

const STATUS_STYLES: Record<CalendarEventStatus, string> = {
  pending: 'bg-warning-light text-warning-text border-l-2 border-warning',
  confirmed: 'bg-primary text-txt-white border-l-2 border-primary-press',
  completed: 'bg-success-light text-success-text border-l-2 border-success',
  cancelled: 'bg-disabled text-txt-disabled border-l-2 border-edge-disabled line-through',
};

const STATUS_LABELS: Record<CalendarEventStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

// ─── CalendarHeader ───────────────────────────────────────────────────────────

interface CalendarHeaderProps {
  view: CalendarView;
  date: Date;
  onViewChange: (v: CalendarView) => void;
  onDateChange: (d: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ view, date, onViewChange, onDateChange }) => {
  const title = useMemo(() => {
    if (view === 'month') {
      return MONTH_FORMATTER.format(date).replace(/^\w/, (c) => c.toUpperCase());
    }
    if (view === 'week') {
      const mon = startOfWeek(date);
      const sun = addDays(mon, 6);
      if (mon.getMonth() === sun.getMonth()) {
        return `${mon.getDate()} – ${sun.getDate()} ${new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(sun)}`;
      }
      return `${mon.getDate()} ${new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(mon)} – ${sun.getDate()} ${new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' }).format(sun)}`;
    }
    if (view === 'day') {
      return DAY_LONG_FORMATTER.format(date).replace(/^\w/, (c) => c.toUpperCase());
    }
    return 'Próximos eventos';
  }, [view, date]);

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
    <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-surface-1 flex-shrink-0">
      {/* Nav */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Período anterior"
          onClick={handlePrev}
          className="p-1.5 rounded hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <svg aria-hidden="true" className="w-4 h-4 text-txt-secondary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleToday}
          className="px-3 py-1 text-sm rounded border border-edge hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-txt transition-colors"
        >
          Hoy
        </button>
        <button
          type="button"
          aria-label="Período siguiente"
          onClick={handleNext}
          className="p-1.5 rounded hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <svg aria-hidden="true" className="w-4 h-4 text-txt-secondary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-txt capitalize">{title}</h2>

      {/* View switcher */}
      <div className="flex items-center gap-1 rounded-md border border-edge overflow-hidden">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            aria-pressed={view === v.value}
            onClick={() => onViewChange(v.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
              view === v.value ? 'bg-primary text-txt-white' : 'bg-surface-1 text-txt-secondary hover:bg-surface-2'
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
      aria-label={`${event.title}, ${TIME_FORMATTER.format(event.start)}, ${STATUS_LABELS[event.status]}`}
      style={customStyle}
      className={cn(
        'w-full text-left text-xs px-1.5 py-0.5 rounded truncate cursor-pointer mb-0.5',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
        !event.color && STATUS_STYLES[event.status]
      )}
    >
      <span className="font-medium">{TIME_FORMATTER.format(event.start)}</span>{' '}
      {event.title}
      {doctor && (
        <span
          className="ml-1 inline-block w-1.5 h-1.5 rounded-full align-middle"
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
      aria-label={`${event.title}, ${TIME_FORMATTER.format(event.start)} – ${TIME_FORMATTER.format(event.end)}, ${STATUS_LABELS[event.status]}`}
      style={{
        position: 'absolute',
        top: `${topPct}%`,
        height: `${Math.max(heightPct, 2)}%`,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        ...customStyle,
      }}
      className={cn(
        'rounded px-1.5 py-0.5 overflow-hidden cursor-pointer z-10 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        !event.color && STATUS_STYLES[event.status]
      )}
    >
      <div className="text-xs font-semibold truncate">{event.title}</div>
      {heightPct > 4 && (
        <div className="text-xs opacity-80 truncate">
          {event.patientName && <span>{event.patientName}</span>}
          {event.patientName && event.treatmentType && <span> · </span>}
          {event.treatmentType && <span>{event.treatmentType}</span>}
        </div>
      )}
      {doctor && heightPct > 6 && (
        <div className="text-xs opacity-70 truncate flex items-center gap-1">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: doctor.color }}
            aria-hidden="true"
          />
          {doctor.name}
        </div>
      )}
      {/* Resize handle */}
      <div
        className="absolute bottom-0 inset-x-0 h-2 cursor-s-resize"
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, event); }}
        aria-hidden="true"
      />
    </div>
  );
});
EventBlock.displayName = 'EventBlock';

// ─── MonthView ────────────────────────────────────────────────────────────────

interface MonthViewProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  date: Date;
  onEventClick: (e: CalendarEvent) => void;
  onEventCreate?: (info: CalendarSlotInfo) => void;
  onEventMove?: (event: CalendarEvent, start: Date, end: Date, doctorId?: string) => void;
  onDateChange?: (d: Date) => void;
  onViewChange?: (v: CalendarView) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  events, resources, date, onEventClick, onEventCreate, onEventMove, onDateChange, onViewChange,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);

  // Build 6×7 grid starting on Monday
  const cells = useMemo(() => {
    const monthStart = startOfMonth(date);
    const gridStart = startOfWeek(monthStart);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [date]);

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
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-edge bg-surface-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-txt-secondary">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        role="grid"
        aria-label={`Mes ${MONTH_FORMATTER.format(date)}`}
        className="grid grid-cols-7 flex-1 overflow-y-auto"
        style={{ gridTemplateRows: 'repeat(6, minmax(0, 1fr))' }}
      >
        {cells.map((cellDate, idx) => {
          const key = startOfDay(cellDate).toISOString();
          const dayEvents = eventsByDay.get(key) ?? [];
          const isCurrentMonth = cellDate.getMonth() === date.getMonth();
          const isToday = isSameDay(cellDate, today);
          const visible = dayEvents.slice(0, 3);
          const overflow = dayEvents.length - 3;

          const handleCellCreate = () =>
            onEventCreate?.({ start: cellDate, end: addDays(cellDate, 1) });

          return (
            <div
              key={idx}
              role="gridcell"
              tabIndex={0}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, cellDate)}
              onClick={handleCellCreate}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCellCreate()}
              className={cn(
                'min-h-[100px] p-1 border-b border-r border-edge cursor-pointer hover:bg-surface-2 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                !isCurrentMonth && 'bg-surface-2 opacity-60',
                isToday && 'bg-selected'
              )}
            >
              <div className="flex items-center justify-end mb-1">
                <span
                  className={cn(
                    'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                    isToday ? 'bg-primary text-txt-white' : 'text-txt-secondary'
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
                    className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateChange?.(cellDate);
                      onViewChange?.('day');
                    }}
                  >
                    +{overflow} más
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
    <div className="flex flex-1 overflow-hidden">
      {/* Time labels */}
      <div className="w-14 flex-shrink-0 border-r border-edge bg-surface-1 overflow-y-auto">
        <div style={{ height: totalHeight, position: 'relative' }}>
          {hourSlots.slice(0, -1).map((m) => (
            <div
              key={m}
              className="absolute w-full pr-2 text-right text-xs text-txt-disabled"
              style={{ top: ((m - minMinutes) / rangeMinutes) * totalHeight - 8 }}
            >
              {minutesToTimeStr(m)}
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex flex-1 min-w-0">
          {columns.map((col) => {
            const colKey = col.day.toISOString() + (col.resource?.id ?? '');
            const colEvents = eventsByColumn.get(colKey) ?? [];
            const isToday = isSameDay(col.day, today);

            return (
              <div
                key={colKey}
                className="flex flex-col flex-1 min-w-[80px] border-r border-edge last:border-r-0"
              >
                {/* Column header */}
                <div
                  className={cn(
                    'px-2 py-2 text-center text-xs border-b border-edge bg-surface-2 flex-shrink-0',
                    isToday && 'bg-selected'
                  )}
                >
                  <div className={cn('font-semibold', isToday ? 'text-primary' : 'text-txt-secondary')}>
                    {new Intl.DateTimeFormat('es-MX', { weekday: 'short' }).format(col.day).replace('.', '').toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-bold mx-auto w-7 h-7 flex items-center justify-center rounded-full',
                      isToday ? 'bg-primary text-txt-white' : 'text-txt'
                    )}
                  >
                    {col.day.getDate()}
                  </div>
                  {col.resource && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: col.resource.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-txt-secondary">{col.resource.name}</span>
                    </div>
                  )}
                </div>

                {/* Time slots */}
                <div
                  data-timegrid-col="true"
                  role="presentation"
                  className="relative flex-1 cursor-pointer"
                  style={{ height: totalHeight }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleColDrop(e, col)}
                  onClick={(e) => handleColClick(e, col)}
                >
                  {/* Horizontal grid lines */}
                  {hourSlots.slice(0, -1).map((m) => (
                    <div
                      key={m}
                      className="absolute inset-x-0 border-t border-edge"
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

const DAY_FULL_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const AgendaView: React.FC<AgendaViewProps> = ({ events, resources, date, onEventClick }) => {
  const groups = useMemo(() => {
    const horizon = addDays(date, 30);
    const filtered = events
      .filter((ev) => ev.start >= date && ev.start <= horizon)
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
  }, [events, date]);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-16 text-txt-secondary">
        <svg aria-hidden="true" className="w-12 h-12 mb-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium">No hay eventos en los próximos 30 días</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
      {groups.map(({ date: groupDate, events: groupEvents }) => (
        <div key={groupDate.toISOString()}>
          <h3 className="text-sm font-semibold text-txt-secondary mb-2 capitalize">
            {DAY_FULL_FORMATTER.format(groupDate)}
          </h3>
          <div className="space-y-2">
            {groupEvents.map((ev) => {
              const doctor = resources?.find((r) => r.id === ev.doctorId);
              return (
                <div
                  key={ev.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onEventClick(ev)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEventClick(ev)}
                  aria-label={`${ev.title}, ${TIME_FORMATTER.format(ev.start)}, ${STATUS_LABELS[ev.status]}`}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    'hover:bg-surface-2 transition-colors',
                    ev.status === 'cancelled' && 'opacity-60'
                  )}
                >
                  {/* Time */}
                  <div className="flex-shrink-0 text-sm font-semibold text-txt-secondary w-20">
                    {TIME_FORMATTER.format(ev.start)}
                    <div className="text-xs font-normal text-txt-disabled">
                      {TIME_FORMATTER.format(ev.end)}
                    </div>
                  </div>

                  {/* Color bar */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: ev.color ??
                        (ev.status === 'pending' ? 'var(--color-warning)' :
                         ev.status === 'confirmed' ? 'var(--color-primary)' :
                         ev.status === 'completed' ? 'var(--color-success)' :
                         'var(--color-edge-disabled)'),
                    }}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-txt truncate">{ev.title}</div>
                    {ev.patientName && (
                      <div className="text-xs text-txt-secondary truncate">{ev.patientName}</div>
                    )}
                    {ev.treatmentType && (
                      <div className="text-xs text-txt-secondary truncate">{ev.treatmentType}</div>
                    )}
                  </div>

                  {/* Doctor + Status */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-medium',
                        ev.status === 'pending' && 'bg-warning-light text-warning-text',
                        ev.status === 'confirmed' && 'bg-primary text-txt-white',
                        ev.status === 'completed' && 'bg-success-light text-success-text',
                        ev.status === 'cancelled' && 'bg-disabled text-txt-disabled'
                      )}
                    >
                      {STATUS_LABELS[ev.status]}
                    </span>
                    {doctor && (
                      <div className="flex items-center gap-1 text-xs text-txt-secondary">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
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
      ))}
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
      onEventMove,
      onEventResize,
      minTime = '07:00',
      maxTime = '20:00',
      step = 30,
      className,
    },
    ref
  ) => {
    const [dragging, setDragging] = useState(false);

    const minMinutes = useMemo(() => timeToMinutes(minTime), [minTime]);
    const maxMinutes = useMemo(() => timeToMinutes(maxTime), [maxTime]);

    const handleEventClick = useCallback(
      (ev: CalendarEvent) => onEventClick?.(ev),
      [onEventClick]
    );

    const handleViewChange = useCallback(
      (v: CalendarView) => onViewChange?.(v),
      [onViewChange]
    );

    const handleDateChange = useCallback(
      (d: Date) => onDateChange?.(d),
      [onDateChange]
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
      onEventCreate,
      onEventMove,
      onEventResize,
    };

    return (
      <div
        ref={ref}
        role="application"
        aria-label="Calendario"
        className={cn('flex flex-col bg-surface-1 border border-edge rounded-lg overflow-hidden', className)}
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
            onEventCreate={onEventCreate}
            onEventMove={onEventMove}
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
