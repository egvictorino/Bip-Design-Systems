import type { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineItem } from './Timeline';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div className="w-96">
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
    <div className="w-96">
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
          variant="error"
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
    <div className="w-96">
      <Timeline>
        <TimelineItem date="03/03/2024" title="Evaluación inicial" description="PHQ-9: 18 puntos — Depresión moderada severa." variant="error" />
        <TimelineItem date="10/03/2024" title="Inicio de tratamiento" description="Fluoxetina 20mg/día + terapia cognitivo-conductual." variant="default" />
        <TimelineItem date="24/03/2024" title="Seguimiento" description="PHQ-9: 12 puntos — Mejoría observada." variant="warning" />
        <TimelineItem date="07/04/2024" title="Revisión" description="PHQ-9: 6 puntos — Respuesta adecuada al tratamiento." variant="success" />
      </Timeline>
    </div>
  ),
};
