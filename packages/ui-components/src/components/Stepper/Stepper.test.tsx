import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Stepper, StepperStep } from './Stepper';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderStepper = (value = 1, onChange = vi.fn(), props: Record<string, unknown> = {}) =>
  render(
    <Stepper value={value} onChange={onChange} {...props}>
      <StepperStep value={0} label="Datos" />
      <StepperStep value={1} label="Información" />
      <StepperStep value={2} label="Revisión" />
      <StepperStep value={3} label="Confirmación" />
    </Stepper>
  );

describe('Stepper', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders an ordered list with aria-label', () => {
    renderStepper();
    expect(screen.getByRole('list', { name: 'Pasos del proceso' })).toBeInTheDocument();
  });

  it('renders all step labels', () => {
    renderStepper();
    expect(screen.getByText('Datos')).toBeInTheDocument();
    expect(screen.getByText('Información')).toBeInTheDocument();
    expect(screen.getByText('Revisión')).toBeInTheDocument();
    expect(screen.getByText('Confirmación')).toBeInTheDocument();
  });

  it('renders list items for each step', () => {
    renderStepper();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  // ── States ─────────────────────────────────────────────────────────────────

  it('active step has aria-current="step"', () => {
    renderStepper(1);
    const activeElements = document.querySelectorAll('[aria-current="step"]');
    expect(activeElements).toHaveLength(1);
    expect(activeElements[0]).toBeInTheDocument();
  });

  it('non-active steps do not have aria-current', () => {
    renderStepper(1);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toHaveAttribute('aria-current');
    });
  });

  it('completed step shows check icon (svg)', () => {
    const { container } = renderStepper(2);
    // step 0 and 1 are completed (value < activeValue=2)
    const svgs = container.querySelectorAll('li:first-child svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('error step shows X icon and danger color', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Información" status="error" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    // The error step's indicator has bg-danger class
    const errorIndicator = container.querySelector('.bg-danger');
    expect(errorIndicator).toBeInTheDocument();
  });

  it('active step indicator has bg-primary class', () => {
    const { container } = renderStepper(1);
    // Active step is index 1 — its indicator has bg-primary
    const indicators = container.querySelectorAll('.bg-primary');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('pending step indicator has bg-disabled class', () => {
    const { container } = renderStepper(1);
    // Steps 2 and 3 are pending
    const disabledIndicators = container.querySelectorAll('.bg-disabled');
    expect(disabledIndicators.length).toBeGreaterThan(0);
  });

  // ── Circle variant ─────────────────────────────────────────────────────────

  it('circle variant shows step numbers for pending/active steps', () => {
    renderStepper(0);
    // Steps 1, 2, 3 are pending — should show "2", "3", "4"
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('circle variant shows 1-based numbers', () => {
    renderStepper(0);
    // Step 0 is active, steps 1-3 are pending and show numbers 2,3,4
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // ── Dot variant ────────────────────────────────────────────────────────────

  it('dot variant does not show step numbers', () => {
    renderStepper(1, vi.fn(), { variant: 'dot' });
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('dot variant renders small dot indicators', () => {
    const { container } = renderStepper(1, vi.fn(), { variant: 'dot' });
    const dots = container.querySelectorAll('.w-3.h-3.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });

  // ── Connector ──────────────────────────────────────────────────────────────

  it('last step does not render a connector', () => {
    const { container } = renderStepper(1);
    const lastLi = container.querySelector('li:last-child');
    // Connector is a div with h-px — last step should have only 1 child (the step block)
    const hPxDivs = lastLi?.querySelectorAll('.h-px');
    expect(hPxDivs?.length).toBe(0);
  });

  it('non-last steps render a connector', () => {
    const { container } = renderStepper(1);
    const firstLi = container.querySelector('li:first-child');
    const connector = firstLi?.querySelector('.h-px');
    expect(connector).toBeInTheDocument();
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  it('clicking a pending step calls onChange with its value', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // Step "Revisión" (value=2) is pending
    await userEvent.click(screen.getByRole('button', { name: /Revisión/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('clicking a completed step calls onChange with its value', async () => {
    const onChange = vi.fn();
    renderStepper(2, onChange);
    // Step "Datos" (value=0) is completed
    await userEvent.click(screen.getByRole('button', { name: /Datos/i }));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('active step is not a button and does not call onChange on click', () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // "Información" is the active step — it should not be a button
    const buttons = screen.getAllByRole('button');
    const buttonLabels = buttons.map((b) => b.textContent);
    // none of the buttons should contain just "Información"
    expect(buttonLabels.some((t) => t?.includes('Información') && !t?.includes('Datos'))).toBe(
      false
    );
  });

  it('disabled step cannot be clicked', async () => {
    const onChange = vi.fn();
    render(
      <Stepper value={1} onChange={onChange}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Información" />
        <StepperStep value={2} label="Revisión" disabled />
        <StepperStep value={3} label="Confirmación" />
      </Stepper>
    );
    const disabledBtn = screen.getByRole('button', { name: /Revisión/i });
    expect(disabledBtn).toBeDisabled();
    await userEvent.click(disabledBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Description ────────────────────────────────────────────────────────────

  it('renders description text when provided', () => {
    render(
      <Stepper value={0} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" description="Nombre y RFC" />
        <StepperStep value={1} label="Info" />
      </Stepper>
    );
    expect(screen.getByText('Nombre y RFC')).toBeInTheDocument();
  });

  it('description element has an id linked to the step', () => {
    const { container } = render(
      <Stepper value={0} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" description="Subtexto" />
        <StepperStep value={1} label="Info" />
      </Stepper>
    );
    const descEl = container.querySelector('#stepper-step-0-desc');
    expect(descEl).toBeInTheDocument();
    expect(descEl?.textContent).toBe('Subtexto');
  });

  it('step without description does not set aria-describedby', () => {
    renderStepper(1);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toHaveAttribute('aria-describedby');
    });
  });

  // ── className override ──────────────────────────────────────────────────────

  it('accepts custom className on Stepper root', () => {
    const { container } = renderStepper(0, vi.fn(), { className: 'custom-root' });
    expect(container.querySelector('ol')).toHaveClass('custom-root');
  });

  it('accepts custom className on StepperStep', () => {
    const { container } = render(
      <Stepper value={0} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" className="custom-step" />
        <StepperStep value={1} label="Info" />
      </Stepper>
    );
    expect(container.querySelector('.custom-step')).toBeInTheDocument();
  });

  // ── Guard ──────────────────────────────────────────────────────────────────

  it('throws if StepperStep is used outside Stepper', () => {
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => render(<StepperStep value={0} label="Solo" />)).toThrow(
      '<StepperStep> must be used inside <Stepper>'
    );
    console.error = originalError;
  });
});
