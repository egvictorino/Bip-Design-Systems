import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker';

const MARCH_15_2026 = new Date(2026, 2, 15);

/** Returns the trigger button via aria-haspopup (works regardless of other buttons present) */
const getTrigger = () => document.querySelector('[aria-haspopup="dialog"]') as HTMLElement;

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
    const btn = getTrigger();
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
    expect(getTrigger().textContent).toContain('15');
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
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
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
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Abril 2026')).toBeInTheDocument();
  });

  it('navigates to prev month when "Mes anterior" is clicked', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Febrero 2026')).toBeInTheDocument();
  });

  // ── Day selection ──────────────────────────────────────────────────────────

  it('calls onChange when a day is selected', () => {
    const onChange = vi.fn();
    render(<DatePicker value={MARCH_15_2026} onChange={onChange} />);
    fireEvent.click(getTrigger());
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
    fireEvent.click(getTrigger());
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
    fireEvent.click(getTrigger());
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeDisabled();
  });

  it('"Mes siguiente" is disabled when viewing the max month', () => {
    const max = new Date(2026, 2, 31); // March 2026 maximum
    render(<DatePicker value={MARCH_15_2026} max={max} />);
    fireEvent.click(getTrigger());
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
    const btn = getTrigger();
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
    const btn = getTrigger();
    const helper = screen.getByText('Ayuda');
    expect(btn).toHaveAttribute('aria-describedby', helper.id);
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('size %s applies correct size class to trigger', (size) => {
    render(<DatePicker size={size} />);
    const sizeClass = `trigger${size.charAt(0).toUpperCase() + size.slice(1)}`;
    expect(getTrigger()).toHaveClass(sizeClass);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies containerFullWidth to container and triggerWrapperFullWidth to wrapper', () => {
    const { container } = render(<DatePicker fullWidth />);
    expect(container.firstChild).toHaveClass('containerFullWidth');
    expect(getTrigger().parentElement).toHaveClass('triggerWrapperFullWidth');
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

  // ── Botón limpiar (clear button) ───────────────────────────────────────────

  it('renders clear button when value is provided', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    expect(screen.getByRole('button', { name: 'Limpiar fecha' })).toBeInTheDocument();
  });

  it('does not render clear button when value is null', () => {
    render(<DatePicker />);
    expect(screen.queryByRole('button', { name: 'Limpiar fecha' })).not.toBeInTheDocument();
  });

  it('does not render clear button when disabled prop is true', () => {
    render(<DatePicker value={MARCH_15_2026} disabled />);
    expect(screen.queryByRole('button', { name: 'Limpiar fecha' })).not.toBeInTheDocument();
  });

  it('clicking clear button calls onChange with null', () => {
    const onChange = vi.fn();
    render(<DatePicker value={MARCH_15_2026} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar fecha' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toBeNull();
  });

  it('clicking clear button does not open the calendar', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar fecha' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // ── disabledDates ──────────────────────────────────────────────────────────

  it('disabledDates disables specific individual dates', () => {
    const disabledDates = [new Date(2026, 2, 10), new Date(2026, 2, 20)];
    render(<DatePicker value={MARCH_15_2026} disabledDates={disabledDates} />);
    fireEvent.click(getTrigger());
    const btn10 = document.querySelector('[data-date="2026-2-10"]') as HTMLButtonElement;
    const btn20 = document.querySelector('[data-date="2026-2-20"]') as HTMLButtonElement;
    expect(btn10).toBeDisabled();
    expect(btn20).toBeDisabled();
  });

  it('disabledDates does not disable dates not in the list', () => {
    const disabledDates = [new Date(2026, 2, 10)];
    render(<DatePicker value={MARCH_15_2026} disabledDates={disabledDates} />);
    fireEvent.click(getTrigger());
    const btn15 = document.querySelector('[data-date="2026-2-15"]') as HTMLButtonElement;
    expect(btn15).not.toBeDisabled();
  });

  it('disabledDates disables "Hoy" button when today is in the list', () => {
    const today = new Date();
    render(<DatePicker disabledDates={[today]} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeDisabled();
  });

  // ── Selector rápido de mes/año ─────────────────────────────────────────────

  it('shows a clickable month/year heading when calendar is open', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    expect(
      screen.getByRole('button', { name: /Seleccionar mes y año/ })
    ).toBeInTheDocument();
  });

  it('clicking month/year heading opens month picker grid', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: /Seleccionar mes y año/ }));
    expect(screen.getByRole('grid', { name: 'Seleccionar mes' })).toBeInTheDocument();
  });

  it('month picker shows 12 month buttons', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: /Seleccionar mes y año/ }));
    const monthGrid = screen.getByRole('grid', { name: 'Seleccionar mes' });
    const monthBtns = monthGrid.querySelectorAll('button');
    expect(monthBtns).toHaveLength(12);
  });

  it('clicking a month in month picker updates view and returns to day grid', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: /Seleccionar mes y año/ }));
    // Click Mayo
    fireEvent.click(screen.getByRole('button', { name: /Mayo 2026/ }));
    // Returns to days view with May 2026
    expect(screen.getByRole('button', { name: /Mayo 2026.*Seleccionar mes y año/ })).toBeInTheDocument();
  });

  it('month picker shows year navigation buttons', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByRole('button', { name: /Seleccionar mes y año/ }));
    expect(screen.getByRole('button', { name: 'Año anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Año siguiente' })).toBeInTheDocument();
  });

  // ── Navegación con teclado ─────────────────────────────────────────────────

  it('day buttons use roving tabindex — focused day has tabIndex=0', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const btn15 = document.querySelector('[data-date="2026-2-15"]') as HTMLButtonElement;
    expect(btn15).toHaveAttribute('tabindex', '0');
    const btn16 = document.querySelector('[data-date="2026-2-16"]') as HTMLButtonElement;
    expect(btn16).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves focus to next day', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    const btn16 = document.querySelector('[data-date="2026-2-16"]') as HTMLButtonElement;
    expect(btn16).toHaveAttribute('tabindex', '0');
  });

  it('ArrowLeft moves focus to previous day', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    const btn14 = document.querySelector('[data-date="2026-2-14"]') as HTMLButtonElement;
    expect(btn14).toHaveAttribute('tabindex', '0');
  });

  it('ArrowDown moves focus one week forward', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    const btn22 = document.querySelector('[data-date="2026-2-22"]') as HTMLButtonElement;
    expect(btn22).toHaveAttribute('tabindex', '0');
  });

  it('Home key moves focus to first day of month', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'Home' });
    const btn1 = document.querySelector('[data-date="2026-2-1"]') as HTMLButtonElement;
    expect(btn1).toHaveAttribute('tabindex', '0');
  });

  it('End key moves focus to last day of month', () => {
    render(<DatePicker value={MARCH_15_2026} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'End' });
    const btn31 = document.querySelector('[data-date="2026-2-31"]') as HTMLButtonElement;
    expect(btn31).toHaveAttribute('tabindex', '0');
  });

  it('Enter key selects the focused date', () => {
    const onChange = vi.fn();
    render(<DatePicker value={MARCH_15_2026} onChange={onChange} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledOnce();
    expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(15);
    expect((onChange.mock.calls[0][0] as Date).getMonth()).toBe(2);
  });

  it('Enter key does not select a disabled focused date', () => {
    const onChange = vi.fn();
    const disabledDates = [MARCH_15_2026];
    render(<DatePicker value={MARCH_15_2026} disabledDates={disabledDates} onChange={onChange} />);
    fireEvent.click(getTrigger());
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
