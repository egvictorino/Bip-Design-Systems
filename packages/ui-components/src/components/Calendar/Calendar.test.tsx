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
      fireEvent.mouseDown(cells[10], { button: 0 });
      fireEvent.mouseUp(cells[10]);
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
      // Multiple "Confirmada" texts exist (filter chip + event badge)
      expect(screen.getAllByText('Confirmada').length).toBeGreaterThan(0);
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

    // ── Filter chips ──────────────────────────────────────────────────────────

    it('renders 4 status filter chips', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      const chips = screen.getAllByRole('checkbox');
      expect(chips).toHaveLength(4);
    });

    it('all filter chips start checked', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      const chips = screen.getAllByRole('checkbox');
      chips.forEach((chip) => expect(chip).toHaveAttribute('aria-checked', 'true'));
    });

    it('clicking a filter chip unchecks it', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      const pendienteChip = screen.getByRole('checkbox', { name: /pendiente/i });
      fireEvent.click(pendienteChip);
      expect(pendienteChip).toHaveAttribute('aria-checked', 'false');
    });

    it('unchecking a status hides events of that status', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      // "Limpieza dental" is pending — uncheck Pendiente
      expect(screen.getByText('Limpieza dental')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('checkbox', { name: /pendiente/i }));
      expect(screen.queryByText('Limpieza dental')).not.toBeInTheDocument();
    });

    it('unchecking a status keeps events of other statuses visible', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      fireEvent.click(screen.getByRole('checkbox', { name: /pendiente/i }));
      // "Revisión general" is confirmed — should still be visible
      expect(screen.getByText('Revisión general')).toBeInTheDocument();
    });

    it('filtering all events out shows "no hay eventos con los filtros seleccionados"', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      // Uncheck all chips
      screen.getAllByRole('checkbox').forEach((chip) => fireEvent.click(chip));
      expect(
        screen.getByText(/no hay eventos con los filtros seleccionados/i)
      ).toBeInTheDocument();
    });

    it('re-checking a chip restores the hidden events', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      const pendienteChip = screen.getByRole('checkbox', { name: /pendiente/i });
      fireEvent.click(pendienteChip); // uncheck
      expect(screen.queryByText('Limpieza dental')).not.toBeInTheDocument();
      fireEvent.click(pendienteChip); // re-check
      expect(screen.getByText('Limpieza dental')).toBeInTheDocument();
    });

    // ── Notes ─────────────────────────────────────────────────────────────────

    it('shows event notes when present', () => {
      const eventWithNotes: CalendarEvent = {
        id: 'n1',
        title: 'Cita con notas',
        start: makeDate(0, 10, 0),
        end: makeDate(0, 10, 30),
        status: 'confirmed',
        notes: 'Nota de prueba para verificar renderizado.',
      };
      renderCalendar({ view: 'agenda', events: [eventWithNotes], date: eventWithNotes.start });
      expect(screen.getByText('Nota de prueba para verificar renderizado.')).toBeInTheDocument();
    });

    it('does not render notes section when event has no notes', () => {
      renderCalendar({ view: 'agenda', events: EVENTS, date: EVENTS[0].start });
      // EVENTS[0] has no notes — check that no italic note element appears for that event
      const row = screen.getByText('Revisión general').closest('[role="button"]') as HTMLElement;
      expect(row.querySelector('.italic')).toBeNull();
    });

    // ── Today indicator ───────────────────────────────────────────────────────

    it('shows "Hoy" badge inside the heading when events fall on today', () => {
      const todayEvent: CalendarEvent = {
        id: 't1',
        title: 'Evento de hoy',
        start: (() => {
          const d = new Date();
          d.setHours(10, 0, 0, 0);
          return d;
        })(),
        end: (() => {
          const d = new Date();
          d.setHours(10, 30, 0, 0);
          return d;
        })(),
        status: 'confirmed',
      };
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      renderCalendar({ view: 'agenda', events: [todayEvent], date: todayStart });
      // The header always has a "Hoy" nav button; the badge adds a second one inside an h3
      const allHoy = screen.getAllByText('Hoy');
      expect(allHoy.length).toBeGreaterThan(1);
      // The badge is a <span> inside an <h3>
      const badge = allHoy.find((el) => el.tagName === 'SPAN');
      expect(badge).toBeTruthy();
    });

    it('does not show "Hoy" badge in headings for non-today groups', () => {
      // BASE_DATE is 2026-03-10, which is not today
      renderCalendar({ view: 'agenda', events: EVENTS, date: BASE_DATE });
      // Only the nav "Hoy" button should exist — no <span> badge
      const allHoy = screen.getAllByText('Hoy');
      const badge = allHoy.find((el) => el.tagName === 'SPAN');
      expect(badge).toBeUndefined();
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
      expect(chip.className).toContain('statusCancelled');
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

  // ─── Range Selection ─────────────────────────────────────────────────────────

  describe('Range Selection', () => {
    it('mousedown + mouseup on the same cell fires onEventCreate (single click)', () => {
      const onEventCreate = vi.fn();
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onEventCreate, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseUp(grid);
      expect(onEventCreate).toHaveBeenCalledTimes(1);
      expect(onRangeSelect).not.toHaveBeenCalled();
    });

    it('mousedown on cell A + mouseenter cell B + mouseup on grid opens range popover', () => {
      const onEventCreate = vi.fn();
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onEventCreate, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      // onRangeSelect is NOT called yet — popover appears first
      expect(onRangeSelect).not.toHaveBeenCalled();
      expect(onEventCreate).not.toHaveBeenCalled();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('range end date is always >= range start date (inverse drag normalizes, popover opens)', () => {
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[6], { button: 0 });
      fireEvent.mouseEnter(cells[2]);
      fireEvent.mouseUp(grid);
      // Popover opens — onRangeSelect fires only when "Crear evento" is clicked
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /crear evento/i }));
      expect(onRangeSelect).toHaveBeenCalledTimes(1);
      const [start, end] = onRangeSelect.mock.calls[0] as [Date, Date];
      expect(end.getTime()).toBeGreaterThan(start.getTime());
    });

    it('right-click mousedown does not start range selection', () => {
      const onEventCreate = vi.fn();
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onEventCreate, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 2 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      expect(onRangeSelect).not.toHaveBeenCalled();
      expect(onEventCreate).not.toHaveBeenCalled();
    });

    it('onRangeSelect not provided does not throw', () => {
      renderCalendar({ view: 'month', date: BASE_DATE });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      expect(() => {
        fireEvent.mouseDown(cells[0], { button: 0 });
        fireEvent.mouseEnter(cells[3]);
        fireEvent.mouseUp(grid);
      }).not.toThrow();
    });

    it('cells in range get the highlight class monthCellInRange', () => {
      renderCalendar({ view: 'month', date: BASE_DATE });
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[2]);
      expect(cells[0].className).toContain('monthCellInRange');
      expect(cells[1].className).toContain('monthCellInRange');
      expect(cells[2].className).toContain('monthCellInRange');
      expect(cells[5].className).not.toContain('monthCellInRange');
    });

    it('global mouseup outside grid finalizes range and opens popover', () => {
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onRangeSelect });
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[3]);
      fireEvent.mouseUp(document);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(onRangeSelect).not.toHaveBeenCalled();
    });
  });

  // ─── Range Popover ───────────────────────────────────────────────────────────

  describe('Range Popover', () => {
    function openPopover() {
      renderCalendar({ view: 'month', date: BASE_DATE });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      return screen.getByRole('dialog');
    }

    it('popover shows "Crear evento" button and close button', () => {
      openPopover();
      expect(screen.getByRole('button', { name: /crear evento/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
    });

    it('clicking "Crear evento" calls onRangeSelect with correct dates and closes popover', () => {
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      fireEvent.click(screen.getByRole('button', { name: /crear evento/i }));
      expect(onRangeSelect).toHaveBeenCalledTimes(1);
      const [start, end] = onRangeSelect.mock.calls[0] as [Date, Date];
      expect(start).toBeInstanceOf(Date);
      expect(end).toBeInstanceOf(Date);
      expect(end.getTime()).toBeGreaterThan(start.getTime());
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('clicking the backdrop closes popover without calling onRangeSelect', () => {
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      // The backdrop is the first sibling — the fixed inset-0 div
      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.previousSibling as HTMLElement;
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onRangeSelect).not.toHaveBeenCalled();
    });

    it('pressing Escape closes popover without calling onRangeSelect', () => {
      const onRangeSelect = vi.fn();
      renderCalendar({ view: 'month', date: BASE_DATE, onRangeSelect });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onRangeSelect).not.toHaveBeenCalled();
    });

    it('second drag while popover is open replaces the popover', () => {
      renderCalendar({ view: 'month', date: BASE_DATE });
      const grid = screen.getByRole('grid');
      const cells = screen.getAllByRole('gridcell');
      // First drag → popover opens
      fireEvent.mouseDown(cells[0], { button: 0 });
      fireEvent.mouseEnter(cells[4]);
      fireEvent.mouseUp(grid);
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      // Second drag → same popover replaces (still 1)
      fireEvent.mouseDown(cells[7], { button: 0 });
      fireEvent.mouseEnter(cells[12]);
      fireEvent.mouseUp(grid);
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
    });
  });
});
