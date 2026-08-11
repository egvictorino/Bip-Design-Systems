import type { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineItem } from './Timeline';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '24rem' }}>
      <Timeline>
        <TimelineItem date="10/03/2024" title="Primera consulta" description="Evaluación inicial, toma de radiografías panorámicas." />
        <TimelineItem date="20/03/2024" title="Plan de tratamiento" description="Se definió extracción del molar 38 y ortodoncia." variant="success" />
        <TimelineItem date="05/04/2024" title="Extracción molar 38" description="Procedimiento sin complicaciones." variant="success" />
        <TimelineItem date="15/04/2024" title="Inicio de ortodoncia" description="Colocación de brackets metálicos." />
        <TimelineItem date="Pendiente" title="Revisión mensual" variant="warning" description="Agendar cita de seguimiento." />
      </Timeline>
    </div>
  ),
};

export const ConIconos: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '24rem' }}>
      <Timeline>
        <TimelineItem
          date="01/01/2024"
          title="Registro de paciente"
          icon="👤"
          variant="default"
        />
        <TimelineItem
          date="10/01/2024"
          title="Pago realizado"
          description="$3,500 MXN — Tarjeta terminación 4512"
          icon="💳"
          variant="success"
        />
        <TimelineItem
          date="15/01/2024"
          title="Cita cancelada"
          description="El paciente no se presentó."
          icon="✕"
          variant="danger"
        />
        <TimelineItem
          date="20/01/2024"
          title="Nueva cita agendada"
          icon="📅"
          variant="default"
        />
      </Timeline>
    </div>
  ),
};

export const Psiquiatrico: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '24rem' }}>
      <Timeline>
        <TimelineItem date="03/03/2024" title="Evaluación inicial" description="PHQ-9: 18 puntos — Depresión moderada severa." variant="danger" />
        <TimelineItem date="10/03/2024" title="Inicio de tratamiento" description="Fluoxetina 20mg/día + terapia cognitivo-conductual." variant="default" />
        <TimelineItem date="24/03/2024" title="Seguimiento" description="PHQ-9: 12 puntos — Mejoría observada." variant="warning" />
        <TimelineItem date="07/04/2024" title="Revisión" description="PHQ-9: 6 puntos — Respuesta adecuada al tratamiento." variant="success" />
      </Timeline>
    </div>
  ),
};

export const AllVariants: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '24rem' }}>
      <Timeline aria-label="Variantes de estado">
        <TimelineItem title="Default" description="Estado por defecto." variant="default" date="01/01/2024" />
        <TimelineItem title="Success" description="Tarea completada correctamente." variant="success" date="02/01/2024" />
        <TimelineItem title="Warning" description="Requiere atención." variant="warning" date="03/01/2024" />
        <TimelineItem title="Error" description="Se detectó un problema." variant="danger" date="04/01/2024" />
      </Timeline>
    </div>
  ),
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: '#929292', marginBottom: '0.5rem' }}>sm</p>
        <Timeline aria-label="Tamaño pequeño">
          <TimelineItem title="Consulta" date="10/03/2024" size="sm" variant="default" />
          <TimelineItem title="Seguimiento" date="20/03/2024" size="sm" variant="success" />
          <TimelineItem title="Alta" date="30/03/2024" size="sm" variant="success" />
        </Timeline>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: '#929292', marginBottom: '0.5rem' }}>md (default)</p>
        <Timeline aria-label="Tamaño mediano">
          <TimelineItem title="Consulta" date="10/03/2024" size="md" variant="default" />
          <TimelineItem title="Seguimiento" date="20/03/2024" size="md" variant="success" />
          <TimelineItem title="Alta" date="30/03/2024" size="md" variant="success" />
        </Timeline>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: '#929292', marginBottom: '0.5rem' }}>lg</p>
        <Timeline aria-label="Tamaño grande">
          <TimelineItem title="Consulta" date="10/03/2024" size="lg" variant="default" />
          <TimelineItem title="Seguimiento" date="20/03/2024" size="lg" variant="success" />
          <TimelineItem title="Alta" date="30/03/2024" size="lg" variant="success" />
        </Timeline>
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { children: null },
  render: () => (
    <Timeline orientation="horizontal" aria-label="Proceso de atención">
      <TimelineItem date="10/03/2024" title="Registro" description="Datos del paciente." variant="success" />
      <TimelineItem date="15/03/2024" title="Diagnóstico" description="Evaluación clínica." variant="success" />
      <TimelineItem date="20/03/2024" title="Tratamiento" description="Inicio de protocolo." variant="default" />
      <TimelineItem date="Pendiente" title="Revisión" description="Cita de seguimiento." variant="warning" />
    </Timeline>
  ),
};

export const HorizontalConIconos: Story = {
  args: { children: null },
  render: () => (
    <Timeline orientation="horizontal" aria-label="Etapas del proceso">
      <TimelineItem title="Registro" icon="👤" variant="success" date="01/01/2024" />
      <TimelineItem title="Pago" icon="💳" variant="success" date="05/01/2024" />
      <TimelineItem title="Cita" icon="📅" variant="default" date="10/01/2024" />
      <TimelineItem title="Alta" icon="✓" variant="warning" date="Pendiente" />
    </Timeline>
  ),
};
