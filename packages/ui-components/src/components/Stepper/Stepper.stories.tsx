import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stepper, StepperStep } from './Stepper';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['circle', 'dot'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const AllCompleted: Story = {
  args: { children: null, value: 4, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={4} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const WithError: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" status="error" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const WithSuccess: Story = {
  args: { children: null, value: 2, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={2} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" status="success" />
        <StepperStep value={1} label="Información" status="success" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const WithWarning: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" status="warning" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const WithLoading: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Procesando..." status="loading" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const AllStatuses: Story = {
  args: { children: null, value: 4, onChange: () => {} },
  render: () => (
    <div style={{ width: 640 }}>
      <Stepper value={4} onChange={() => {}}>
        <StepperStep value={0} label="Completado" status="success" />
        <StepperStep value={1} label="Advertencia" status="warning" />
        <StepperStep value={2} label="Cargando" status="loading" />
        <StepperStep value={3} label="Error" status="error" />
      </Stepper>
    </div>
  ),
};

export const SmallSize: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}} size="sm">
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const LargeSize: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}} size="lg">
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const DotVariant: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 560 }}>
      <Stepper value={1} onChange={() => {}} variant="dot">
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const WithDescription: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 640 }}>
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" description="Nombre y RFC" />
        <StepperStep value={1} label="Información" description="Domicilio fiscal" />
        <StepperStep value={2} label="Revisión" description="Verifica tus datos" />
        <StepperStep value={3} label="Confirmación" description="Listo" />
      </Stepper>
    </div>
  ),
};

export const VerticalOrientation: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 280 }}>
      <Stepper value={1} onChange={() => {}} orientation="vertical">
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const VerticalWithDescription: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div style={{ width: 320 }}>
      <Stepper value={1} onChange={() => {}} orientation="vertical">
        <StepperStep value={0} label="Datos personales" description="Nombre y RFC" />
        <StepperStep value={1} label="Información" description="Domicilio fiscal" />
        <StepperStep value={2} label="Revisión" description="Verifica tus datos" />
        <StepperStep value={3} label="Confirmación" description="Listo" />
      </Stepper>
    </div>
  ),
};

const InteractiveStepper = () => {
  const [step, setStep] = useState(0);
  const steps = ['Datos personales', 'Información', 'Revisión', 'Confirmación'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 560 }}>
      <Stepper value={step} onChange={setStep}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>
        Paso activo: <strong style={{ color: 'var(--color-txt)' }}>{steps[step]}</strong>
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: 4, border: '1px solid var(--color-edge)', opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer', background: 'none' }}
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={step === steps.length - 1}
          onClick={() => setStep((s) => s + 1)}
          style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: 4, border: 'none', background: 'var(--color-primary)', color: 'var(--color-txt-white)', opacity: step === steps.length - 1 ? 0.4 : 1, cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  args: { children: null, value: 0, onChange: () => {} },
  render: () => <InteractiveStepper />,
};
