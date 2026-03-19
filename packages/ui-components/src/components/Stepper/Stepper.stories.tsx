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
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div className="w-[560px]">
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
    <div className="w-[560px]">
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
    <div className="w-[560px]">
      <Stepper value={1} onChange={() => {}}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" status="error" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    </div>
  ),
};

export const DotVariant: Story = {
  args: { children: null, value: 1, onChange: () => {} },
  render: () => (
    <div className="w-[560px]">
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
    <div className="w-[640px]">
      <Stepper value={1} onChange={() => {}}>
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
    <div className="flex flex-col gap-6 w-[560px]">
      <Stepper value={step} onChange={setStep}>
        <StepperStep value={0} label="Datos personales" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
      <p className="text-sm text-txt-secondary text-center">
        Paso activo: <span className="font-medium text-txt">{steps[step]}</span>
      </p>
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 text-sm rounded border border-edge disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={step === steps.length - 1}
          onClick={() => setStep((s) => s + 1)}
          className="px-4 py-2 text-sm rounded bg-primary text-txt-white disabled:opacity-40"
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
