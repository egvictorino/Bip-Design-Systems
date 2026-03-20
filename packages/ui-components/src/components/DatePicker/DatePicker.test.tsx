import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

const MARCH_15_2026 = new Date(2026, 2, 15);

describe('DatePicker', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a trigger button', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('forwards ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('trigger button always has an id', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button').id).toBeTruthy();
  });

  it('uses provided id', () => {
    render(<DatePicker id="my-date" />);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'my-date');
  });

  // ── Label ───────────────────────────────────────────────────────────────────

  it('renders a label when label prop is provided', () => {
    render(<DatePicker label="Fecha de nacimiento" />);
    expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument();
  });

  it('label is linked to trigger via htmlFor/id', () => {
    render(<DatePicker label="Fecha" />);
    const btn = screen.getByRole('button');
    const label = screen.getByText('Fecha');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', btn.id);
  });

  // ── Placeholder & value ────────────────────────────────────────────────────

  it('shows placeholder when no value is provided', () => {
    render(<DatePicker placeholder="Selecciona fecha" />);
    expect(screen.getByText('Selecciona fecha')).toBeInTheDocument();
  });

  it('defaults placeholder to DD/MM/AAAA', () => {
    render(<DatePicker />);
    expect(screen.getByText('DD/MM/AAAA')).toBeInTheDocument();
  });

  it('displays the day number when value is provided', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    expect(screen.getByRole('button').textContent).toContain('15');
  });

  // ── Calendar open / close ──────────────────────────────────────────────────

  it('calendar is not visible initially', () => {
    render(<DatePicker />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens calendar on trigger click', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('trigger has aria-expanded=false when closed', () => {
    render(<DatePicker />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-expanded=true when open', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    const trigger = document.querySelector('[aria-haspopup="dialog"]') as HTMLElement;
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes calendar on Escape key', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calendar has role="dialog" with aria-label="Calendario"', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog', { name: 'Calendario' })).toBeInTheDocument();
  });

  // ── Month navigation ───────────────────────────────────────────────────────

  it('shows month navigation buttons when open', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeInTheDocument();
  });

  it('navigates to next month when "Mes siguiente" is clicked', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(screen.getByRole('button')); // open trigger
    fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Abril 2026')).toBeInTheDocument();
  });

  it('navigates to prev month when "Mes anterior" is clicked', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(screen.getByRole('button')); // open trigger
    fireEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Febrero 2026')).toBeInTheDocument();
  });

  // ── Day selection ──────────────────────────────────────────────────────────

  it('calls onChange when a day is selected', () => {
    const onChange = vi.fn();
    render(<DatePicker value={MARCH_15_2026} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button')); // open trigger
    const buttons = screen.getAllByRole('button');
    const day20 = buttons.find((b) => b.textContent?.trim() === '20');
    fireEvent.click(day20!);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(20);
    expect((onChange.mock.calls[0][0] as Date).getMonth()).toBe(2); // March
  });

  it('closes calendar after selecting a day', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(screen.getByRole('button')); // open
    const buttons = screen.getAllByRole('button');
    const day10 = buttons.find((b) => b.textContent?.trim() === '10');
    fireEvent.click(day10!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calendar shows a grid with role="grid"', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  // ── Min/Max constraints ────────────────────────────────────────────────────

  it('"Mes anterior" is disabled when viewing the min month', () => {
    const min = new Date(2026, 2, 1); // March 2026 minimum
    render(<DatePicker value={MARCH_15_2026} min={min} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeDisabled();
  });

  it('"Mes siguiente" is disabled when viewing the max month', () => {
    const max = new Date(2026, 2, 31); // March 2026 maximum
    render(<DatePicker value={MARCH_15_2026} max={max} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeDisabled();
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it('trigger is disabled when disabled=true', () => {
    render(<DatePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('renders errorMessage with role="alert"', () => {
    render(<DatePicker error errorMessage="Fecha requerida" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fecha requerida');
  });

  it('links trigger to errorMessage via aria-describedby', () => {
    render(<DatePicker error errorMessage="Error" />);
    const btn = screen.getByRole('button');
    const alert = screen.getByRole('alert');
    expect(btn).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ────────────────────────────────────────────────────────────

  it('renders helper text', () => {
    render(<DatePicker helperText="Formato: día/mes/año" />);
    expect(screen.getByText('Formato: día/mes/año')).toBeInTheDocument();
  });

  it('links trigger to helperText via aria-describedby', () => {
    render(<DatePicker helperText="Ayuda" />);
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
    render(<DatePicker size={size} />);
    expect(screen.getByRole('button')).toHaveClass(textClass);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies w-full to container and trigger', () => {
    const { container } = render(<DatePicker fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  // ── Botón "Hoy" ───────────────────────────────────────────────────────────

  it('renders "Hoy" button when calendar is open', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeInTheDocument();
  });

  it('clicking "Hoy" calls onChange with today and closes calendar', () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Hoy' }));
    expect(onChange).toHaveBeenCalledOnce();
    const called = onChange.mock.calls[0][0] as Date;
    const today = new Date();
    expect(called).toBeInstanceOf(Date);
    expect(called.getFullYear()).toBe(today.getFullYear());
    expect(called.getMonth()).toBe(today.getMonth());
    expect(called.getDate()).toBe(today.getDate());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('"Hoy" is disabled when today is outside min/max', () => {
    const min = new Date(2030, 0, 1);
    render(<DatePicker min={min} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeDisabled();
  });
});
