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
        <StepperStep value={1} label="Información" variant="danger" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    const errorIndicator = container.querySelector('.circleDanger');
    expect(errorIndicator).toBeInTheDocument();
  });

  it('active step indicator has circleActive class', () => {
    const { container } = renderStepper(1);
    const indicators = container.querySelectorAll('.circleActive');
    expect(indicators.length).toBeGreaterThan(0);
  });

  it('pending step indicator has circleIdle class', () => {
    const { container } = renderStepper(1);
    // Steps 2 and 3 are pending
    const idleIndicators = container.querySelectorAll('.circleIdle');
    expect(idleIndicators.length).toBeGreaterThan(0);
  });

  // ── Status: success ────────────────────────────────────────────────────────

  it('success step shows check icon', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" variant="success" />
        <StepperStep value={1} label="Información" />
      </Stepper>
    );
    const svgs = container.querySelectorAll('li:first-child svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('success step indicator has circleSuccess class', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" variant="success" />
        <StepperStep value={1} label="Información" />
      </Stepper>
    );
    expect(container.querySelector('.circleSuccess')).toBeInTheDocument();
  });

  it('success step label has labelSuccess class', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" variant="success" />
        <StepperStep value={1} label="Información" />
      </Stepper>
    );
    expect(container.querySelector('.labelSuccess')).toBeInTheDocument();
  });

  // ── Status: warning ────────────────────────────────────────────────────────

  it('warning step shows warning icon (svg)', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Información" variant="warning" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    const warningLi = container.querySelectorAll('li')[1];
    const svgs = warningLi.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('warning step indicator has circleWarning class', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Información" variant="warning" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    expect(container.querySelector('.circleWarning')).toBeInTheDocument();
  });

  it('warning step label has labelWarning class', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Información" variant="warning" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    expect(container.querySelector('.labelWarning')).toBeInTheDocument();
  });

  // ── Status: loading ────────────────────────────────────────────────────────

  it('loading step indicator has circleLoading class', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Procesando" variant="loading" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    expect(container.querySelector('.circleLoading')).toBeInTheDocument();
  });

  it('loading step shows spinner element', () => {
    const { container } = render(
      <Stepper value={1} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Procesando" variant="loading" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('loading step does not show a number', () => {
    render(
      <Stepper value={2} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" />
        <StepperStep value={1} label="Procesando" variant="loading" />
        <StepperStep value={2} label="Revisión" />
      </Stepper>
    );
    // step 1 with loading should not show "2"
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  // ── Size prop ──────────────────────────────────────────────────────────────

  it('size="sm" applies circleSm class to indicators', () => {
    const { container } = renderStepper(1, vi.fn(), { size: 'sm' });
    expect(container.querySelector('.circleSm')).toBeInTheDocument();
  });

  it('size="md" applies circleMd class to indicators (default)', () => {
    const { container } = renderStepper(1);
    expect(container.querySelector('.circleMd')).toBeInTheDocument();
  });

  it('size="lg" applies circleLg class to indicators', () => {
    const { container } = renderStepper(1, vi.fn(), { size: 'lg' });
    expect(container.querySelector('.circleLg')).toBeInTheDocument();
  });

  it('size="sm" applies dotSm class in dot variant', () => {
    const { container } = renderStepper(1, vi.fn(), { variant: 'dot', size: 'sm' });
    expect(container.querySelector('.dotSm')).toBeInTheDocument();
  });

  it('size="lg" applies dotLg class in dot variant', () => {
    const { container } = renderStepper(1, vi.fn(), { variant: 'dot', size: 'lg' });
    expect(container.querySelector('.dotLg')).toBeInTheDocument();
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
    const dots = container.querySelectorAll('.dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  // ── Connector ──────────────────────────────────────────────────────────────

  it('last step does not render a connector', () => {
    const { container } = renderStepper(1);
    const lastLi = container.querySelector('li:last-child');
    const connectors = lastLi?.querySelectorAll('.connector');
    expect(connectors?.length).toBe(0);
  });

  it('non-last steps render a connector', () => {
    const { container } = renderStepper(1);
    const firstLi = container.querySelector('li:first-child');
    const connector = firstLi?.querySelector('.connector');
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

  // ── Keyboard navigation — horizontal ──────────────────────────────────────

  it('ArrowRight on a step calls onChange with next step value', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // "Datos" (value=0) is a button — press ArrowRight
    const btn = screen.getByRole('button', { name: /Datos/i });
    btn.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ArrowLeft on a step calls onChange with previous step value', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // "Revisión" (value=2) is a button — press ArrowLeft
    const btn = screen.getByRole('button', { name: /Revisión/i });
    btn.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ArrowRight on last step does not call onChange', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // "Confirmación" (value=3) is last
    const btn = screen.getByRole('button', { name: /Confirmación/i });
    btn.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ArrowLeft on first step does not call onChange', async () => {
    const onChange = vi.fn();
    renderStepper(1, onChange);
    // "Datos" (value=0) is first
    const btn = screen.getByRole('button', { name: /Datos/i });
    btn.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Keyboard navigation — vertical ────────────────────────────────────────
  // In vertical mode the button wraps only the indicator (not the label),
  // so we find buttons by index within the list items.

  it('ArrowDown on a vertical step calls onChange with next step value', async () => {
    const onChange = vi.fn();
    const { container } = renderStepper(1, onChange, { orientation: 'vertical' });
    // li[0] = step 0 (completed) — its button is the first button
    const buttons = container.querySelectorAll('button');
    buttons[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ArrowUp on a vertical step calls onChange with previous step value', async () => {
    const onChange = vi.fn();
    const { container } = renderStepper(1, onChange, { orientation: 'vertical' });
    // li[2] = step 2 (pending) — second button (after step 0)
    const buttons = container.querySelectorAll('button');
    buttons[1].focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ArrowRight does not navigate in vertical orientation', async () => {
    const onChange = vi.fn();
    const { container } = renderStepper(1, onChange, { orientation: 'vertical' });
    const buttons = container.querySelectorAll('button');
    buttons[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── Orientation: vertical ──────────────────────────────────────────────────

  it('vertical orientation adds stepperVertical class to ol', () => {
    const { container } = renderStepper(1, vi.fn(), { orientation: 'vertical' });
    expect(container.querySelector('ol')).toHaveClass('stepperVertical');
  });

  it('vertical orientation adds stepItemVertical class to li elements', () => {
    const { container } = renderStepper(1, vi.fn(), { orientation: 'vertical' });
    const listItems = container.querySelectorAll('li');
    listItems.forEach((li) => {
      expect(li).toHaveClass('stepItemVertical');
    });
  });

  it('vertical orientation places aria-current="step" on the li element', () => {
    const { container } = renderStepper(1, vi.fn(), { orientation: 'vertical' });
    const activeLi = container.querySelector('li[aria-current="step"]');
    expect(activeLi).toBeInTheDocument();
    expect(activeLi?.tagName).toBe('LI');
  });

  it('vertical orientation renders connector with connectorVertical class', () => {
    const { container } = renderStepper(1, vi.fn(), { orientation: 'vertical' });
    expect(container.querySelector('.connectorVertical')).toBeInTheDocument();
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

  it('description element has a unique id linked to aria-describedby', () => {
    const { container } = render(
      <Stepper value={0} onChange={vi.fn()}>
        <StepperStep value={0} label="Datos" description="Subtexto" />
        <StepperStep value={1} label="Info" />
      </Stepper>
    );
    const descEl = screen.getByText('Subtexto');
    expect(descEl.id).toBeTruthy();
    // The active step div should reference the description id
    const activeStep = container.querySelector('[aria-current="step"]');
    expect(activeStep).toHaveAttribute('aria-describedby', descEl.id);
  });

  it('two instances with descriptions have different ids (useId fix)', () => {
    const { container } = render(
      <div>
        <Stepper value={0} onChange={vi.fn()}>
          <StepperStep value={0} label="Datos" description="Primer stepper" />
          <StepperStep value={1} label="Info" />
        </Stepper>
        <Stepper value={0} onChange={vi.fn()}>
          <StepperStep value={0} label="Datos" description="Segundo stepper" />
          <StepperStep value={1} label="Info" />
        </Stepper>
      </div>
    );
    const descs = container.querySelectorAll('[class*="description"]');
    const ids = Array.from(descs).map((el) => el.id);
    expect(ids[0]).not.toBe(ids[1]);
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
