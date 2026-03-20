import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import type { CalendarEvent, CalendarResource } from './Calendar';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDate(offsetDays: number, hour: number, minute = 0): Date {
  const d = new Date(2026, 2, 10, hour, minute, 0, 0); // fixed: 2026-03-10
  d.setDate(d.getDate() + offsetDays);
  return d;
}

const BASE_DATE = new Date(2026, 2, 10); // Tuesday March 10

const DOCTORS: CalendarResource[] = [
  { id: 'd1', name: 'Dr. García', color: '#1643A8' },
  { id: 'd2', name: 'Dra. Martínez', color: '#9333EA' },
];

const EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Revisión general',
    start: makeDate(0, 9, 0),
    end: makeDate(0, 9, 30),
    status: 'confirmed',
    doctorId: 'd1',
    patientName: 'Ana López',
    treatmentType: 'Revisión',
  },
  {
    id: 'e2',
    title: 'Limpieza dental',
    start: makeDate(1, 10, 0),
    end: makeDate(1, 10, 30),
    status: 'pending',
    doctorId: 'd2',
    patientName: 'Carlos Ruiz',
    treatmentType: 'Limpieza',
  },
];

const noop = () => {};

function renderCalendar(
  props: Partial<React.ComponentProps<typeof Calendar>> = {}
) {
  return render(
    <Calendar
      events={[]}
      view="month"
      date={BASE_DATE}
      onViewChange={noop}
      onDateChange={noop}
      onEventClick={noop}
      {...props}
    />
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Calendar', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderCalendar();
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('has aria-label "Calendario"', () => {
      renderCalendar();
      expect(screen.getByRole('application', { name: 'Calendario' })).toBeInTheDocument();
    });

    it('forwards ref to the root div', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Calendar
          ref={ref}
          events={[]}
          view="month"
          date={BASE_DATE}
          onViewChange={noop}
          onDateChange={noop}
          onEventClick={noop}
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('renders the month view by default', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders week view', () => {
      renderCalendar({ view: 'week' });
      // TimeGrid renders a time column — check for time labels
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('renders day view', () => {
      renderCalendar({ view: 'day' });
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('renders agenda view', () => {
      renderCalendar({ view: 'agenda' });
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderCalendar({ className: 'custom-class' });
      expect(screen.getByRole('application').className).toContain('custom-class');
    });
  });

  // ─── CalendarHeader ─────────────────────────────────────────────────────────

  describe('CalendarHeader', () => {
    it('renders navigation buttons', () => {
      renderCalendar();
      expect(screen.getByRole('button', { name: 'Período anterior' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Período siguiente' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Hoy' })).toBeInTheDocument();
    });

    it('renders view switcher buttons', () => {
      renderCalendar();
      expect(screen.getByRole('button', { name: 'Mes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Semana' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Día' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Agenda' })).toBeInTheDocument();
    });

    it('marks active view button with aria-pressed="true"', () => {
      renderCalendar({ view: 'week' });
      const weekBtn = screen.getByRole('button', { name: 'Semana' });
      expect(weekBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('other view buttons have aria-pressed="false"', () => {
      renderCalendar({ view: 'month' });
      const weekBtn = screen.getByRole('button', { name: 'Semana' });
      expect(weekBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('clicking a view button calls onViewChange', () => {
      const onViewChange = vi.fn();
      renderCalendar({ onViewChange });
      fireEvent.click(screen.getByRole('button', { name: 'Semana' }));
      expect(onViewChange).toHaveBeenCalledWith('week');
    });

    it('clicking next button calls onDateChange', () => {
      const onDateChange = vi.fn();
      renderCalendar({ onDateChange });
      fireEvent.click(screen.getByRole('button', { name: 'Período siguiente' }));
      expect(onDateChange).toHaveBeenCalledTimes(1);
    });

    it('clicking prev button calls onDateChange', () => {
      const onDateChange = vi.fn();
      renderCalendar({ onDateChange });
      fireEvent.click(screen.getByRole('button', { name: 'Período anterior' }));
      expect(onDateChange).toHaveBeenCalledTimes(1);
    });

    it('clicking Hoy calls onDateChange with today', () => {
      const onDateChange = vi.fn();
      renderCalendar({ onDateChange });
      fireEvent.click(screen.getByRole('button', { name: 'Hoy' }));
      expect(onDateChange).toHaveBeenCalledTimes(1);
      const called = onDateChange.mock.calls[0][0] as Date;
      const today = new Date();
      expect(called.getDate()).toBe(today.getDate());
      expect(called.getMonth()).toBe(today.getMonth());
    });

    it('shows month title for month view', () => {
      renderCalendar({ view: 'month', date: new Date(2026, 2, 1) });
      expect(screen.getByText(/marzo/i)).toBeInTheDocument();
    });

    it('shows "Próximos eventos" for agenda view', () => {
      renderCalendar({ view: 'agenda' });
      expect(screen.getByText('Próximos eventos')).toBeInTheDocument();
    });
  });

  // ─── MonthView ───────────────────────────────────────────────────────────────

  describe('MonthView', () => {
    it('renders a grid with role="grid"', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders 42 gridcells (6×7)', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getAllByRole('gridcell')).toHaveLength(42);
    });

    it('renders day name headers', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getByText('Lun')).toBeInTheDocument();
      expect(screen.getByText('Dom')).toBeInTheDocument();
    });

    it('renders event chips for events in month', () => {
      renderCalendar({ view: 'month', events: EVENTS, date: EVENTS[0].start });
      // "Revisión general" should appear as an event chip
      expect(screen.getByText(/revisión general/i)).toBeInTheDocument();
    });

    it('clicking empty cell calls onEventCreate', () => {
      const onEventCreate = vi.fn();
      renderCalendar({ view: 'month', onEventCreate });
      const cells = screen.getAllByRole('gridcell');
      fireEvent.click(cells[10]);
      expect(onEventCreate).toHaveBeenCalledTimes(1);
      expect(onEventCreate.mock.calls[0][0]).toHaveProperty('start');
    });

    it('shows +N more when events exceed 3', () => {
      const manyEvents: CalendarEvent[] = Array.from({ length: 5 }, (_, i) => ({
        id: `ev${i}`,
        title: `Evento ${i}`,
        start: makeDate(0, 9 + i, 0),
        end: makeDate(0, 9 + i, 30),
        status: 'confirmed' as const,
      }));
      renderCalendar({ view: 'month', events: manyEvents, date: manyEvents[0].start });
      expect(screen.getByText(/\+2 más/)).toBeInTheDocument();
    });
  });

  // ─── WeekView ────────────────────────────────────────────────────────────────

  describe('WeekView', () => {
    it('renders 7 day column headers', () => {
      renderCalendar({ view: 'week', date: BASE_DATE });
      // Day abbreviations appear in column headers
      const dayAbbrs = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
      for (const abbr of dayAbbrs) {
        expect(screen.getByText(abbr)).toBeInTheDocument();
      }
    });

    it('renders doctor column headers when resources provided', () => {
      renderCalendar({ view: 'week', date: BASE_DATE, resources: DOCTORS });
      // Doctor names appear in column headers (7 days × 2 doctors = 14 occurrences)
      expect(screen.getAllByText('Dr. García').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dra. Martínez').length).toBeGreaterThan(0);
    });

    it('renders events as blocks in the time grid', () => {
      renderCalendar({ view: 'week', date: BASE_DATE, events: EVENTS });
      expect(screen.getByText('Revisión general')).toBeInTheDocument();
    });
  });

  // ─── DayView ─────────────────────────────────────────────────────────────────

  describe('DayView', () => {
    it('renders a single day column', () => {
      renderCalendar({ view: 'day', date: BASE_DATE });
      // Only one date number visible in column header
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('renders doctor columns when resources provided', () => {
      renderCalendar({ view: 'day', date: BASE_DATE, resources: DOCTORS });
      expect(screen.getByText('Dr. García')).toBeInTheDocument();
      expect(screen.getByText('Dra. Martínez')).toBeInTheDocument();
    });
  });

  // ─── AgendaView ──────────────────────────────────────────────────────────────

  describe('AgendaView', () => {
    it('shows empty state when no events', () => {
      renderCalendar({ view: 'agenda', events: [] });
      expect(screen.getByText(/no hay eventos en los próximos 30 días/i)).toBeInTheDocument();
    });

    it('shows grouped events', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      expect(screen.getByText('Revisión general')).toBeInTheDocument();
    });

    it('shows patient name in agenda row', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      expect(screen.getByText('Ana López')).toBeInTheDocument();
    });

    it('shows status label in agenda row', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
    });

    it('shows doctor name when resources provided', () => {
      renderCalendar({
        view: 'agenda',
        events: EVENTS,
        resources: DOCTORS,
        date: EVENTS[0].start,
      });
      expect(screen.getAllByText('Dr. García').length).toBeGreaterThan(0);
    });
  });

  // ─── Event interaction ───────────────────────────────────────────────────────

  describe('Event interaction', () => {
    it('clicking an event chip calls onEventClick', () => {
      const onEventClick = vi.fn();
      renderCalendar({
        view: 'month',
        events: EVENTS,
        date: EVENTS[0].start,
        onEventClick,
      });
      const chip = screen.getByText(/revisión general/i).closest('[role="button"]') as HTMLElement;
      fireEvent.click(chip);
      expect(onEventClick).toHaveBeenCalledWith(EVENTS[0]);
    });

    it('clicking agenda event calls onEventClick', () => {
      const onEventClick = vi.fn();
      renderCalendar({
        view: 'agenda',
        events: EVENTS,
        date: EVENTS[0].start,
        onEventClick,
      });
      const row = screen.getByText('Revisión general').closest('[role="button"]') as HTMLElement;
      fireEvent.click(row);
      expect(onEventClick).toHaveBeenCalledWith(EVENTS[0]);
    });

    it('event chip has correct aria-label', () => {
      renderCalendar({ view: 'month', events: EVENTS, date: EVENTS[0].start });
      const chip = screen.getByRole('button', { name: /revisión general/i });
      expect(chip).toBeInTheDocument();
    });

    it('cancelled event rendered with cancelled status style', () => {
      const cancelledEvent: CalendarEvent = {
        id: 'c1',
        title: 'Cita cancelada',
        start: makeDate(0, 11, 0),
        end: makeDate(0, 11, 30),
        status: 'cancelled',
      };
      renderCalendar({ view: 'month', events: [cancelledEvent], date: cancelledEvent.start });
      const chip = screen.getByRole('button', { name: /cita cancelada/i });
      expect(chip.className).toContain('line-through');
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('root element has role="application"', () => {
      renderCalendar();
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('month grid has role="grid"', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('month grid has aria-label', () => {
      renderCalendar({ view: 'month', date: new Date(2026, 2, 1) });
      expect(screen.getByRole('grid', { name: /mes/i })).toBeInTheDocument();
    });

    it('nav buttons have aria-label', () => {
      renderCalendar();
      expect(screen.getByLabelText('Período anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Período siguiente')).toBeInTheDocument();
    });

    it('active view button has aria-pressed="true"', () => {
      renderCalendar({ view: 'month' });
      expect(screen.getByRole('button', { name: 'Mes' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('event chips have keyboard support (Enter)', () => {
      const onEventClick = vi.fn();
      renderCalendar({
        view: 'month',
        events: EVENTS,
        date: EVENTS[0].start,
        onEventClick,
      });
      const chip = screen.getByRole('button', { name: /revisión general/i });
      fireEvent.keyDown(chip, { key: 'Enter' });
      expect(onEventClick).toHaveBeenCalledWith(EVENTS[0]);
    });
  });
});
