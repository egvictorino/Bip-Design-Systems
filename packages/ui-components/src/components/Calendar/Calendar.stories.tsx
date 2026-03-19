import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import type { CalendarEvent, CalendarResource, CalendarView } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    view: { control: 'select', options: ['month', 'week', 'day', 'agenda'] },
    step: { control: 'select', options: [15, 30, 60] },
    events: { control: false },
    resources: { control: false },
    onEventClick: { control: false },
    onEventCreate: { control: false },
    onEventMove: { control: false },
    onEventResize: { control: false },
    onViewChange: { control: false },
    onDateChange: { control: false },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Shared mock data ─────────────────────────────────────────────────────────

const DOCTORS: CalendarResource[] = [
  { id: 'd1', name: 'Dr. García', color: '#1643A8' },
  { id: 'd2', name: 'Dra. Martínez', color: '#9333EA' },
  { id: 'd3', name: 'Dr. Ramos', color: '#059669' },
];

function makeDate(offsetDays: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
}

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
    start: makeDate(0, 10, 30),
    end: makeDate(0, 11, 0),
    status: 'pending',
    doctorId: 'd2',
    patientName: 'Carlos Ruiz',
    treatmentType: 'Limpieza',
  },
  {
    id: 'e3',
    title: 'Extracción molar',
    start: makeDate(0, 14, 0),
    end: makeDate(0, 15, 0),
    status: 'confirmed',
    doctorId: 'd1',
    patientName: 'María Torres',
    treatmentType: 'Cirugía',
  },
  {
    id: 'e4',
    title: 'Ortodoncia — ajuste',
    start: makeDate(1, 8, 30),
    end: makeDate(1, 9, 0),
    status: 'completed',
    doctorId: 'd3',
    patientName: 'Luis Mendoza',
    treatmentType: 'Ortodoncia',
  },
  {
    id: 'e5',
    title: 'Blanqueamiento',
    start: makeDate(1, 11, 0),
    end: makeDate(1, 12, 0),
    status: 'pending',
    doctorId: 'd2',
    patientName: 'Sofía Castro',
    treatmentType: 'Estética',
  },
  {
    id: 'e6',
    title: 'Endodoncia',
    start: makeDate(2, 9, 0),
    end: makeDate(2, 10, 30),
    status: 'confirmed',
    doctorId: 'd1',
    patientName: 'Roberto Silva',
    treatmentType: 'Endodoncia',
  },
  {
    id: 'e7',
    title: 'Consulta cancelada',
    start: makeDate(2, 15, 0),
    end: makeDate(2, 15, 30),
    status: 'cancelled',
    doctorId: 'd2',
    patientName: 'Elena Vega',
    treatmentType: 'Revisión',
  },
  {
    id: 'e8',
    title: 'Implante dental',
    start: makeDate(3, 10, 0),
    end: makeDate(3, 12, 0),
    status: 'confirmed',
    doctorId: 'd3',
    patientName: 'Jorge Herrera',
    treatmentType: 'Implante',
  },
  {
    id: 'e9',
    title: 'Radiografía panorámica',
    start: makeDate(5, 9, 30),
    end: makeDate(5, 10, 0),
    status: 'pending',
    doctorId: 'd1',
    patientName: 'Valeria Moreno',
    treatmentType: 'Diagnóstico',
  },
  {
    id: 'e10',
    title: 'Control post-operatorio',
    start: makeDate(7, 11, 0),
    end: makeDate(7, 11, 30),
    status: 'pending',
    doctorId: 'd3',
    patientName: 'Jorge Herrera',
    treatmentType: 'Seguimiento',
    notes: 'Revisar evolución del implante colocado la semana anterior.',
  },
];

// ─── Controlled wrapper ───────────────────────────────────────────────────────

function ControlledCalendar(
  props: Omit<React.ComponentProps<typeof Calendar>, 'view' | 'date' | 'onViewChange' | 'onDateChange'>
) {
  const [view, setView] = useState<CalendarView>('week');
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ height: 700 }}>
      <Calendar
        {...props}
        view={view}
        date={date}
        onViewChange={setView}
        onDateChange={setDate}
        onEventClick={(ev) => alert(`Cita: ${ev.title}\nPaciente: ${ev.patientName ?? '—'}\nEstado: ${ev.status}`)}
        onEventCreate={(info) => alert(`Nueva cita\nInicio: ${info.start.toLocaleTimeString('es-MX')}`)}
        onEventMove={(ev, start) => alert(`Movida: ${ev.title} → ${start.toLocaleString('es-MX')}`)}
        onEventResize={(ev, end) => alert(`Redimensionada: ${ev.title} → fin ${end.toLocaleTimeString('es-MX')}`)}
      />
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const WeekViewStory: Story = {
  name: 'Vista Semana (multi-doctor)',
  args: { view: 'week', date: new Date(), events: [], resources: [] },
  render: () => (
    <ControlledCalendar events={EVENTS} resources={DOCTORS} />
  ),
};

export const MonthViewStory: Story = {
  name: 'Vista Mes',
  args: { view: 'month', date: new Date(), events: [], resources: [] },
  render: () => {
    function Wrapper() {
      const [view, setView] = useState<CalendarView>('month');
      const [date, setDate] = useState(new Date());
      return (
        <div style={{ height: 700 }}>
          <Calendar
            events={EVENTS}
            resources={DOCTORS}
            view={view}
            date={date}
            onViewChange={setView}
            onDateChange={setDate}
            onEventClick={(ev) => alert(`Cita: ${ev.title}`)}
            onEventCreate={(info) => alert(`Nueva cita el ${info.start.toLocaleDateString('es-MX')}`)}
            onEventMove={(ev, start) => alert(`Movida: ${ev.title} → ${start.toLocaleDateString('es-MX')}`)}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
};

export const DayViewStory: Story = {
  name: 'Vista Día (multi-doctor)',
  args: { view: 'day', date: new Date(), events: [], resources: [] },
  render: () => {
    function Wrapper() {
      const [view, setView] = useState<CalendarView>('day');
      const [date, setDate] = useState(new Date());
      return (
        <div style={{ height: 700 }}>
          <Calendar
            events={EVENTS}
            resources={DOCTORS}
            view={view}
            date={date}
            onViewChange={setView}
            onDateChange={setDate}
            onEventClick={(ev) => alert(`Cita: ${ev.title}`)}
            onEventCreate={(info) => alert(`Nueva cita a las ${info.start.toLocaleTimeString('es-MX')}`)}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
};

export const AgendaViewStory: Story = {
  name: 'Vista Agenda',
  args: { view: 'agenda', date: new Date(), events: [], resources: [] },
  render: () => {
    function Wrapper() {
      const [view, setView] = useState<CalendarView>('agenda');
      const [date, setDate] = useState(new Date());
      return (
        <div style={{ height: 700 }}>
          <Calendar
            events={EVENTS}
            resources={DOCTORS}
            view={view}
            date={date}
            onViewChange={setView}
            onDateChange={setDate}
            onEventClick={(ev) => alert(`Cita: ${ev.title}\nPaciente: ${ev.patientName ?? '—'}`)}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
};

export const EmptyAgenda: Story = {
  name: 'Agenda vacía',
  args: { view: 'agenda', date: new Date(), events: [], resources: [] },
  render: () => {
    function Wrapper() {
      const [view, setView] = useState<CalendarView>('agenda');
      const [date, setDate] = useState(new Date());
      return (
        <div style={{ height: 500 }}>
          <Calendar
            events={[]}
            view={view}
            date={date}
            onViewChange={setView}
            onDateChange={setDate}
            onEventClick={() => {}}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
};
