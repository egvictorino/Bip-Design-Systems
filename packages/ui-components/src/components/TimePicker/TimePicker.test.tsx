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

  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-lg'],
  ] as const)('size %s applies correct text class', (size, textClass) => {
    render(<TimePicker size={size} />);
    expect(screen.getByRole('button')).toHaveClass(textClass);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies w-full to container and trigger', () => {
    const { container } = render(<TimePicker fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
    expect(screen.getByRole('button')).toHaveClass('w-full');
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
});
