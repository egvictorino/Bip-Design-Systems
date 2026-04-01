import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a trigger button', () => {
    render(<TimePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('forwards ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<TimePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('trigger button always has an id', () => {
    render(<TimePicker />);
    expect(screen.getByRole('button').id).toBeTruthy();
  });

  it('uses provided id', () => {
    render(<TimePicker id="my-time" />);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'my-time');
  });

  // ── Label ───────────────────────────────────────────────────────────────────

  it('renders a label when label prop is provided', () => {
    render(<TimePicker label="Hora de consulta" />);
    expect(screen.getByText('Hora de consulta')).toBeInTheDocument();
  });

  it('label is linked to trigger via htmlFor/id', () => {
    render(<TimePicker label="Hora" />);
    const btn = screen.getByRole('button');
    const label = screen.getByText('Hora');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', btn.id);
  });

  // ── Placeholder & value ────────────────────────────────────────────────────

  it('shows placeholder when no value is provided', () => {
    render(<TimePicker placeholder="09:00" />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('defaults placeholder to HH:MM', () => {
    render(<TimePicker />);
    expect(screen.getByText('HH:MM')).toBeInTheDocument();
  });

  it('displays value when provided', () => {
    render(<TimePicker value="14:30" />);
    expect(screen.getByRole('button').textContent).toContain('14:30');
  });

  // ── Panel open / close ─────────────────────────────────────────────────────

  it('time panel is not visible initially', () => {
    render(<TimePicker />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens panel on trigger click', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('trigger has aria-expanded=false when closed', () => {
    render(<TimePicker />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-expanded=true when open', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    const trigger = document.querySelector('[aria-haspopup="dialog"]') as HTMLElement;
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes panel on Escape key', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('panel has role="dialog" with aria-label="Seleccionar hora"', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog', { name: 'Seleccionar hora' })).toBeInTheDocument();
  });

  // ── Column structure ───────────────────────────────────────────────────────

  it('renders "Horas" and "Minutos" listboxes when open', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox', { name: 'Horas' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Minutos' })).toBeInTheDocument();
  });

  it('renders 24 hour options', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
    const options = hoursListbox.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(24);
  });

  it('renders 12 minute options for step=5 (default)', () => {
    render(<TimePicker step={5} />);
    fireEvent.click(screen.getByRole('button'));
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const options = minutesListbox.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(12); // 0,5,10,...,55
  });

  it('renders 4 minute options for step=15', () => {
    render(<TimePicker step={15} />);
    fireEvent.click(screen.getByRole('button'));
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const options = minutesListbox.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(4); // 0,15,30,45
  });

  it('renders 2 minute options for step=30', () => {
    render(<TimePicker step={30} />);
    fireEvent.click(screen.getByRole('button'));
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const options = minutesListbox.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(2); // 0,30
  });

  // ── onChange ───────────────────────────────────────────────────────────────

  it('calls onChange when an hour is selected (defaults minute to 00)', () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
    const hour9 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
      (el) => el.textContent === '09'
    );
    fireEvent.click(hour9!);
    expect(onChange).toHaveBeenCalledWith('09:00');
  });

  it('calls onChange when a minute is selected with existing hour', () => {
    const onChange = vi.fn();
    render(<TimePicker value="09:00" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const min30 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
      (el) => el.textContent === '30'
    );
    fireEvent.click(min30!);
    expect(onChange).toHaveBeenCalledWith('09:30');
  });

  it('closes panel after selecting a minute', () => {
    render(<TimePicker value="09:00" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const min30 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
      (el) => el.textContent === '30'
    );
    fireEvent.click(min30!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selected hour is marked with aria-selected="true"', () => {
    render(<TimePicker value="14:30" />);
    fireEvent.click(screen.getByRole('button'));
    const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
    const hour14 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
      (el) => el.textContent === '14'
    );
    expect(hour14).toHaveAttribute('aria-selected', 'true');
  });

  it('selected minute is marked with aria-selected="true"', () => {
    render(<TimePicker value="14:30" step={5} />);
    fireEvent.click(screen.getByRole('button'));
    const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
    const min30 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
      (el) => el.textContent === '30'
    );
    expect(min30).toHaveAttribute('aria-selected', 'true');
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it('trigger is disabled when disabled=true', () => {
    render(<TimePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('renders errorMessage with role="alert"', () => {
    render(<TimePicker error errorMessage="Hora requerida" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Hora requerida');
  });

  it('links trigger to errorMessage via aria-describedby', () => {
    render(<TimePicker error errorMessage="Error" />);
    const btn = screen.getByRole('button');
    const alert = screen.getByRole('alert');
    expect(btn).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ────────────────────────────────────────────────────────────

  it('renders helper text', () => {
    render(<TimePicker helperText="Formato 24 horas" />);
    expect(screen.getByText('Formato 24 horas')).toBeInTheDocument();
  });

  it('links trigger to helperText via aria-describedby', () => {
    render(<TimePicker helperText="Ayuda" />);
    const btn = screen.getByRole('button');
    const helper = screen.getByText('Ayuda');
    expect(btn).toHaveAttribute('aria-describedby', helper.id);
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('size %s applies correct size class to trigger', (size) => {
    render(<TimePicker size={size} />);
    const sizeClass = `trigger${size.charAt(0).toUpperCase() + size.slice(1)}`;
    expect(screen.getByRole('button')).toHaveClass(sizeClass);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies containerFullWidth to container and triggerWrapperFullWidth to wrapper', () => {
    const { container } = render(<TimePicker fullWidth />);
    expect(container.firstChild).toHaveClass('containerFullWidth');
    expect(screen.getByRole('button').parentElement).toHaveClass('triggerWrapperFullWidth');
  });

  // ── Botón "Ahora" ─────────────────────────────────────────────────────────

  it('renders "Ahora" button when panel is open', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Ahora' })).toBeInTheDocument();
  });

  it('clicking "Ahora" calls onChange with current time rounded to step', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 6, 14, 23, 0)); // 14:23
    const onChange = vi.fn();
    render(<TimePicker step={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Ahora' }));
    expect(onChange).toHaveBeenCalledWith('14:20');
    vi.useRealTimers();
  });

  it('clicking "Ahora" closes the panel', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ahora' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ── Paso 1: Focus management & ARIA ───────────────────────────────────────

  describe('focus management', () => {
    it('panel receives focus when opened', () => {
      render(<TimePicker />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    it('focus returns to trigger after closing with Escape', () => {
      render(<TimePicker />);
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(trigger).toHaveFocus();
    });

    it('has an aria-live="polite" region in the DOM', () => {
      render(<TimePicker />);
      expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });

    it('listboxes have tabIndex=0 for keyboard access', () => {
      render(<TimePicker />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
      expect(hoursListbox).toHaveAttribute('tabindex', '0');
      expect(minutesListbox).toHaveAttribute('tabindex', '0');
    });

    it('option buttons have tabIndex=-1 to avoid tab stops', () => {
      render(<TimePicker />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const firstOption = hoursListbox.querySelector('[role="option"]') as HTMLElement;
      expect(firstOption).toHaveAttribute('tabindex', '-1');
    });
  });

  // ── Paso 2: Keyboard navigation ───────────────────────────────────────────

  describe('keyboard navigation', () => {
    it('ArrowDown moves cursor to next hour option', () => {
      render(<TimePicker value="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'ArrowDown' });
      const activeId = hoursListbox.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeEl = document.getElementById(activeId!);
      expect(activeEl?.textContent).toBe('10');
    });

    it('ArrowUp moves cursor to previous hour option', () => {
      render(<TimePicker value="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'ArrowUp' });
      const activeId = hoursListbox.getAttribute('aria-activedescendant');
      const activeEl = document.getElementById(activeId!);
      expect(activeEl?.textContent).toBe('08');
    });

    it('Home moves cursor to the first hour option', () => {
      render(<TimePicker value="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'Home' });
      const activeId = hoursListbox.getAttribute('aria-activedescendant');
      const activeEl = document.getElementById(activeId!);
      expect(activeEl?.textContent).toBe('00');
    });

    it('End moves cursor to the last hour option', () => {
      render(<TimePicker value="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'End' });
      const activeId = hoursListbox.getAttribute('aria-activedescendant');
      const activeEl = document.getElementById(activeId!);
      expect(activeEl?.textContent).toBe('23');
    });

    it('Enter selects the focused hour and calls onChange', () => {
      const onChange = vi.fn();
      render(<TimePicker value="09:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'ArrowDown' }); // focus → hour 10
      fireEvent.keyDown(hoursListbox, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith('10:00');
    });

    it('Space selects the focused hour and calls onChange', () => {
      const onChange = vi.fn();
      render(<TimePicker value="09:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      fireEvent.keyDown(hoursListbox, { key: 'ArrowDown' }); // focus → hour 10
      fireEvent.keyDown(hoursListbox, { key: ' ' });
      expect(onChange).toHaveBeenCalledWith('10:00');
    });

    it('Enter on focused minute selects and closes panel', () => {
      const onChange = vi.fn();
      render(<TimePicker value="09:00" onChange={onChange} step={5} />);
      fireEvent.click(screen.getByRole('button'));
      const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
      // focusedMinuteIdx starts at index of 0 (first minute option when value is "09:00")
      fireEvent.keyDown(minutesListbox, { key: 'ArrowDown' }); // focus → 05
      fireEvent.keyDown(minutesListbox, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith('09:05');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // ── Paso 3: minTime / maxTime ─────────────────────────────────────────────

  describe('minTime / maxTime constraints', () => {
    it('disables hours before minTime', () => {
      render(<TimePicker minTime="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const hour8 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '08'
      );
      expect(hour8).toBeDisabled();
      expect(hour8).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not disable the minTime hour itself', () => {
      render(<TimePicker minTime="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const hour9 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '09'
      );
      expect(hour9).not.toBeDisabled();
    });

    it('disables hours after maxTime', () => {
      render(<TimePicker maxTime="18:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const hour19 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '19'
      );
      expect(hour19).toBeDisabled();
    });

    it('disables minutes < minTime minute when selected hour equals minTime hour', () => {
      render(<TimePicker value="09:00" minTime="09:30" step={5} />);
      fireEvent.click(screen.getByRole('button'));
      const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
      const min15 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '15'
      );
      expect(min15).toBeDisabled();
    });

    it('does not disable minutes >= minTime minute when selected hour equals minTime hour', () => {
      render(<TimePicker value="09:00" minTime="09:30" step={5} />);
      fireEvent.click(screen.getByRole('button'));
      const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
      const min30 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '30'
      );
      expect(min30).not.toBeDisabled();
    });

    it('does not disable minutes when selected hour is after minTime hour', () => {
      render(<TimePicker value="10:00" minTime="09:30" step={5} />);
      fireEvent.click(screen.getByRole('button'));
      const minutesListbox = screen.getByRole('listbox', { name: 'Minutos' });
      const min00 = Array.from(minutesListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '00'
      );
      expect(min00).not.toBeDisabled();
    });

    it('auto-adjusts value below minTime and calls onChange', () => {
      const onChange = vi.fn();
      render(<TimePicker value="08:00" minTime="09:30" step={5} onChange={onChange} />);
      expect(onChange).toHaveBeenCalledWith('09:30');
    });

    it('auto-adjusts minute when value hour equals minTime hour but minute is below', () => {
      const onChange = vi.fn();
      render(<TimePicker value="09:15" minTime="09:30" step={15} onChange={onChange} />);
      expect(onChange).toHaveBeenCalledWith('09:30');
    });

    it('auto-adjusts value above maxTime and calls onChange', () => {
      const onChange = vi.fn();
      render(<TimePicker value="19:00" maxTime="18:00" step={5} onChange={onChange} />);
      expect(onChange).toHaveBeenCalledWith('18:00');
    });

    it('does not auto-adjust value already within min/max range', () => {
      const onChange = vi.fn();
      render(<TimePicker value="12:00" minTime="09:00" maxTime="18:00" onChange={onChange} />);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('keyboard navigation skips disabled options', () => {
      render(<TimePicker value="09:00" minTime="09:00" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      // focusedHourIdx = 9 (hour 9). ArrowUp should skip disabled hours 0-8 and stop at 9
      fireEvent.keyDown(hoursListbox, { key: 'ArrowUp' });
      // All hours < 9 are disabled, so cursor stays at 9
      const activeId = hoursListbox.getAttribute('aria-activedescendant');
      const activeEl = document.getElementById(activeId!);
      expect(activeEl?.textContent).toBe('09');
    });
  });

  // ── Paso 4: inputMode="text" ───────────────────────────────────────────────

  describe('inputMode="text"', () => {
    it('renders an input element when inputMode="text"', () => {
      render(<TimePicker inputMode="text" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('does not render a picker trigger button when inputMode="text"', () => {
      render(<TimePicker inputMode="text" />);
      expect(screen.queryByRole('button', { name: /hh:mm/i })).not.toBeInTheDocument();
    });

    it('shows current value in the text input', () => {
      render(<TimePicker inputMode="text" value="14:30" />);
      expect(screen.getByRole('textbox')).toHaveValue('14:30');
    });

    it('calls onChange when a valid time is typed', () => {
      const onChange = vi.fn();
      render(<TimePicker inputMode="text" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '14:30' } });
      expect(onChange).toHaveBeenCalledWith('14:30');
    });

    it('normalizes single-digit hour "9:30" to "09:30"', () => {
      const onChange = vi.fn();
      render(<TimePicker inputMode="text" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '9:30' } });
      expect(onChange).toHaveBeenCalledWith('09:30');
    });

    it('does not call onChange for invalid input "25:00"', () => {
      const onChange = vi.fn();
      render(<TimePicker inputMode="text" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '25:00' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange for partial input "14:"', () => {
      const onChange = vi.fn();
      render(<TimePicker inputMode="text" onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '14:' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('reverts to last valid value on blur with invalid text', () => {
      render(<TimePicker inputMode="text" value="09:00" />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('09:00');
    });

    it('clears to empty string on blur when input is empty', () => {
      render(<TimePicker inputMode="text" value="09:00" />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);
      expect(input).toHaveValue('');
    });

    it('links text input to label and message via aria-describedby', () => {
      render(<TimePicker inputMode="text" label="Hora" helperText="HH:MM" id="t1" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 't1');
      expect(input).toHaveAttribute('aria-describedby', 't1-message');
    });

    it('text input is disabled when disabled=true', () => {
      render(<TimePicker inputMode="text" disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('default picker mode still renders a button (regression)', () => {
      render(<TimePicker />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('clock icon button opens the picker in text mode', () => {
      render(<TimePicker inputMode="text" />);
      fireEvent.click(screen.getByRole('button', { name: 'Abrir selector de hora' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // ── Paso 5: hourCycle="12" ─────────────────────────────────────────────────

  describe('hourCycle="12"', () => {
    it('renders 12 hour options (not 24) in hourCycle="12" mode', () => {
      render(<TimePicker hourCycle="12" />);
      fireEvent.click(screen.getByRole('button'));
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      expect(hoursListbox.querySelectorAll('[role="option"]')).toHaveLength(12);
    });

    it('shows the AM/PM listbox when hourCycle="12"', () => {
      render(<TimePicker hourCycle="12" />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('listbox', { name: 'AM/PM' })).toBeInTheDocument();
    });

    it('does not show AM/PM listbox in default 24h mode', () => {
      render(<TimePicker />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('listbox', { name: 'AM/PM' })).not.toBeInTheDocument();
    });

    it('displays time in 12h format on the trigger (14:30 → "02:30 PM")', () => {
      render(<TimePicker hourCycle="12" value="14:30" />);
      const trigger = screen.getByRole('button');
      expect(trigger.textContent).toContain('02:30');
      expect(trigger.textContent).toContain('PM');
    });

    it('displays "12:00 AM" for value="00:00" (midnight)', () => {
      render(<TimePicker hourCycle="12" value="00:00" />);
      expect(screen.getByRole('button').textContent).toContain('12:00 AM');
    });

    it('displays "12:00 PM" for value="12:00" (noon)', () => {
      render(<TimePicker hourCycle="12" value="12:00" />);
      expect(screen.getByRole('button').textContent).toContain('12:00 PM');
    });

    it('calls onChange with 24h value when selecting hour in PM mode', () => {
      const onChange = vi.fn();
      render(<TimePicker hourCycle="12" value="14:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      // value="14:00" → PM. Clicking "03" (3 PM) → onChange('15:00')
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const hour3 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '03'
      );
      fireEvent.click(hour3!);
      expect(onChange).toHaveBeenCalledWith('15:00');
    });

    it('calls onChange with 24h value when selecting hour in AM mode', () => {
      const onChange = vi.fn();
      render(<TimePicker hourCycle="12" value="09:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      // value="09:00" → AM. Clicking "11" (11 AM) → onChange('11:00')
      const hoursListbox = screen.getByRole('listbox', { name: 'Horas' });
      const hour11 = Array.from(hoursListbox.querySelectorAll('[role="option"]')).find(
        (el) => el.textContent === '11'
      );
      fireEvent.click(hour11!);
      expect(onChange).toHaveBeenCalledWith('11:00');
    });

    it('switching from PM to AM calls onChange with correct 24h value', () => {
      const onChange = vi.fn();
      render(<TimePicker hourCycle="12" value="14:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      // value="14:00" → 2 PM. Switching to AM → 2 AM = 02:00
      const amOption = Array.from(
        screen.getByRole('listbox', { name: 'AM/PM' }).querySelectorAll('[role="option"]')
      ).find((el) => el.textContent === 'AM');
      fireEvent.click(amOption!);
      expect(onChange).toHaveBeenCalledWith('02:00');
    });

    it('switching from AM to PM calls onChange with correct 24h value', () => {
      const onChange = vi.fn();
      render(<TimePicker hourCycle="12" value="09:00" onChange={onChange} />);
      fireEvent.click(screen.getByRole('button'));
      // value="09:00" → 9 AM. Switching to PM → 9 PM = 21:00
      const pmOption = Array.from(
        screen.getByRole('listbox', { name: 'AM/PM' }).querySelectorAll('[role="option"]')
      ).find((el) => el.textContent === 'PM');
      fireEvent.click(pmOption!);
      expect(onChange).toHaveBeenCalledWith('21:00');
    });

    it('selected period is marked with aria-selected="true"', () => {
      render(<TimePicker hourCycle="12" value="14:00" />);
      fireEvent.click(screen.getByRole('button'));
      const pmOption = Array.from(
        screen.getByRole('listbox', { name: 'AM/PM' }).querySelectorAll('[role="option"]')
      ).find((el) => el.textContent === 'PM');
      expect(pmOption).toHaveAttribute('aria-selected', 'true');
    });

    it('hourCycle="24" still renders 24 hour options (regression)', () => {
      render(<TimePicker hourCycle="24" />);
      fireEvent.click(screen.getByRole('button'));
      expect(
        screen.getByRole('listbox', { name: 'Horas' }).querySelectorAll('[role="option"]')
      ).toHaveLength(24);
    });
  });
});
