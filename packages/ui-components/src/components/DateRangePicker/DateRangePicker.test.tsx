import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from './DateRangePicker';

const noop = () => {};

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('DateRangePicker — rendering', () => {
  it('renders with placeholder', () => {
    render(<DateRangePicker />);
    expect(screen.getByText('DD/MM/AAAA – DD/MM/AAAA')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<DateRangePicker placeholder="Seleccionar fechas" />);
    expect(screen.getByText('Seleccionar fechas')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<DateRangePicker label="Periodo" />);
    expect(screen.getByText('Periodo')).toBeInTheDocument();
  });

  it('label is linked to trigger via htmlFor/id', () => {
    render(<DateRangePicker label="Periodo" id="my-range" />);
    const label = screen.getByText('Periodo');
    expect(label).toHaveAttribute('for', 'my-range');
    expect(screen.getByRole('button')).toHaveAttribute('id', 'my-range');
  });

  it('renders helper text', () => {
    render(<DateRangePicker helperText="Selecciona un rango" />);
    expect(screen.getByText('Selecciona un rango')).toBeInTheDocument();
  });

  it('renders error message with role alert', () => {
    render(<DateRangePicker error errorMessage="Rango inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Rango inválido');
  });

  it('forwards ref to trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DateRangePicker ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});

// ─── Display value ────────────────────────────────────────────────────────────

describe('DateRangePicker — display value', () => {
  it('shows from date with ellipsis when only from is set', () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 15), to: null }} onChange={noop} />
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });

  it('shows full range when both dates are set', () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) }}
        onChange={noop}
      />
    );
    expect(screen.getByText(/01\/01\/2024.*31\/01\/2024/)).toBeInTheDocument();
  });
});

// ─── Open / close ─────────────────────────────────────────────────────────────

describe('DateRangePicker — open/close', () => {
  it('opens calendar on trigger click', async () => {
    render(<DateRangePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes calendar on second trigger click', async () => {
    render(<DateRangePicker />);
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes calendar on Escape', async () => {
    render(<DateRangePicker />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has aria-haspopup dialog on trigger', () => {
    render(<DateRangePicker />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('sets aria-expanded when open', async () => {
    render(<DateRangePicker />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});

// ─── Disabled ─────────────────────────────────────────────────────────────────

describe('DateRangePicker — disabled', () => {
  it('trigger is disabled when disabled prop is true', () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open calendar when disabled', async () => {
    render(<DateRangePicker disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

// ─── ARIA ─────────────────────────────────────────────────────────────────────

describe('DateRangePicker — ARIA', () => {
  it('aria-describedby links trigger to helper text', () => {
    render(<DateRangePicker id="dp" helperText="Texto de ayuda" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'dp-message');
    expect(screen.getByText('Texto de ayuda')).toHaveAttribute('id', 'dp-message');
  });

  it('aria-describedby links trigger to error message', () => {
    render(<DateRangePicker id="dp" error errorMessage="Error aquí" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'dp-message');
  });

  it('no aria-describedby when no helper or error', () => {
    render(<DateRangePicker />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });
});

// ─── Sizes ────────────────────────────────────────────────────────────────────

describe('DateRangePicker — sizes', () => {
  it.each(['sm', 'md', 'lg'] as const)('applies size class for %s', (size) => {
    render(<DateRangePicker size={size} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(
      new RegExp(`trigger${size.charAt(0).toUpperCase() + size.slice(1)}`)
    );
  });
});

// ─── fullWidth ────────────────────────────────────────────────────────────────

describe('DateRangePicker — fullWidth', () => {
  it('applies fullWidth class when prop is true', () => {
    const { container } = render(<DateRangePicker fullWidth />);
    expect(container.firstChild).toHaveClass('fullWidth');
  });
});

// ─── Range selection ──────────────────────────────────────────────────────────

describe('DateRangePicker — range selection', () => {
  it('sets from on first click (no prior value)', async () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={{ from: null, to: null }} onChange={onChange} />);
    // open calendar (viewDate = today)
    await userEvent.click(screen.getByRole('button'));
    // compute exact aria-label for day 1 of current month
    const today = new Date();
    const day1 = new Date(today.getFullYear(), today.getMonth(), 1);
    const day1Label = new Intl.DateTimeFormat('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(day1);
    await userEvent.click(screen.getByRole('button', { name: day1Label }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(Date), to: null })
    );
  });

  it('completes range on second click (from < to)', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 5), to: null }}
        onChange={onChange}
      />
    );
    // calendar closed — open it by clicking the trigger
    await userEvent.click(screen.getByRole('button', { name: /05\/01\/2024/i }));
    const day20 = screen.getByRole('button', { name: /20 de enero de 2024/i });
    await userEvent.click(day20);
    expect(onChange).toHaveBeenCalledWith({
      from: new Date(2024, 0, 5),
      to: new Date(2024, 0, 20),
    });
  });

  it('swaps from/to when second click is before from', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 20), to: null }}
        onChange={onChange}
      />
    );
    // open calendar
    await userEvent.click(screen.getByRole('button', { name: /20\/01\/2024/i }));
    // click day 5 (earlier than from=Jan 20)
    await userEvent.click(screen.getByRole('button', { name: '5 de enero de 2024' }));
    expect(onChange).toHaveBeenCalledWith({
      from: new Date(2024, 0, 5),
      to: new Date(2024, 0, 20),
    });
  });

  it('clears range when clicking same day as from', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 10), to: null }}
        onChange={onChange}
      />
    );
    // open calendar
    await userEvent.click(screen.getByRole('button', { name: /10\/01\/2024/i }));
    // click the same day (Jan 10)
    const day10 = screen.getByRole('button', { name: /10 de enero de 2024/i });
    await userEvent.click(day10);
    expect(onChange).toHaveBeenCalledWith({ from: null, to: null });
  });

  it('closes calendar after completing range', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 5), to: null }}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /05\/01\/2024/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /20 de enero de 2024/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

// ─── Clear button ─────────────────────────────────────────────────────────────

describe('DateRangePicker — clear button', () => {
  it('shows clear button when from is set', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByText('Limpiar selección')).toBeInTheDocument();
  });

  it('shows clear button when both dates are set', async () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) }}
        onChange={noop}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByText('Limpiar selección')).toBeInTheDocument();
  });

  it('does not show clear button when no value', async () => {
    render(<DateRangePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Limpiar selección')).not.toBeInTheDocument();
  });

  it('calls onChange with null range on clear', async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) }}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    await userEvent.click(screen.getByText('Limpiar selección'));
    expect(onChange).toHaveBeenCalledWith({ from: null, to: null });
  });
});

// ─── Month navigation ─────────────────────────────────────────────────────────

describe('DateRangePicker — month navigation', () => {
  it('advances to next month on "Mes siguiente" click', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByText('Enero 2024')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Febrero 2024')).toBeInTheDocument();
  });

  it('goes to previous month on "Mes anterior" click', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 1, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/02\/2024/i }));
    expect(screen.getByText('Febrero 2024')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Enero 2024')).toBeInTheDocument();
  });

  it('disables "Mes anterior" at min boundary', async () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: null }}
        min={new Date(2024, 0, 1)}
        onChange={noop}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeDisabled();
  });

  it('disables "Mes siguiente" at max boundary', async () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: null }}
        max={new Date(2024, 0, 31)}
        onChange={noop}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeDisabled();
  });
});

// ─── Month picker view ────────────────────────────────────────────────────────

describe('DateRangePicker — month picker view', () => {
  it('opens month picker when heading is clicked', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /Enero 2024 — Seleccionar mes y año/i })
    );
    expect(screen.getByRole('grid', { name: 'Seleccionar mes' })).toBeInTheDocument();
  });

  it('shows 12 month buttons in picker (scoped to dialog)', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /Enero 2024 — Seleccionar mes y año/i })
    );
    const dialog = screen.getByRole('dialog');
    // 12 month buttons (e.g. aria-label="Enero 2024") within the dialog
    const monthBtns = within(dialog).getAllByRole('button', { name: /^[A-Za-záéíóúñ]+ \d{4}$/ });
    expect(monthBtns).toHaveLength(12);
  });

  it('clicking a month updates the view and returns to days', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /Enero 2024 — Seleccionar mes y año/i })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Junio 2024' }));
    // should return to days view showing June 2024
    expect(screen.getByText('Junio 2024')).toBeInTheDocument();
    expect(screen.queryByRole('grid', { name: 'Seleccionar mes' })).not.toBeInTheDocument();
  });

  it('year navigation works in month picker', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 1), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    await userEvent.click(
      screen.getByRole('button', { name: /Enero 2024 — Seleccionar mes y año/i })
    );
    const dialog = screen.getByRole('dialog');
    within(dialog).getByText('2024');
    await userEvent.click(screen.getByRole('button', { name: 'Año siguiente' }));
    within(dialog).getByText('2025');
  });
});

// ─── disabledDates ────────────────────────────────────────────────────────────

describe('DateRangePicker — disabledDates', () => {
  it('disables specific dates', async () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: null }}
        disabledDates={[new Date(2024, 0, 10)]}
        onChange={noop}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByRole('button', { name: /10 de enero de 2024/i })).toBeDisabled();
  });

  it('does not disable other dates', async () => {
    render(
      <DateRangePicker
        value={{ from: new Date(2024, 0, 1), to: null }}
        disabledDates={[new Date(2024, 0, 10)]}
        onChange={noop}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /01\/01\/2024/i }));
    expect(screen.getByRole('button', { name: /15 de enero de 2024/i })).not.toBeDisabled();
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

describe('DateRangePicker — keyboard navigation', () => {
  it('ArrowRight moves focus forward one day', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 10), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /10\/01\/2024/i }));
    // focusedDate = Jan 10; useEffect focuses that button
    const day10 = screen.getByRole('button', { name: /10 de enero de 2024/i });
    day10.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /11 de enero de 2024/i })).toHaveFocus();
  });

  it('ArrowLeft moves focus back one day', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 10), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /10\/01\/2024/i }));
    const day10 = screen.getByRole('button', { name: /10 de enero de 2024/i });
    day10.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: '9 de enero de 2024' })).toHaveFocus();
  });

  it('ArrowDown moves focus forward one week', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 10), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /10\/01\/2024/i }));
    const day10 = screen.getByRole('button', { name: /10 de enero de 2024/i });
    day10.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /17 de enero de 2024/i })).toHaveFocus();
  });

  it('ArrowUp moves focus back one week', async () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 10), to: null }} onChange={noop} />
    );
    await userEvent.click(screen.getByRole('button', { name: /10\/01\/2024/i }));
    const day10 = screen.getByRole('button', { name: /10 de enero de 2024/i });
    day10.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: '3 de enero de 2024' })).toHaveFocus();
  });

  it('Enter selects the focused date (today as start of range)', async () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={{ from: null, to: null }} onChange={onChange} />);
    // open calendar — focusedDate = today, useEffect auto-focuses today's button
    await userEvent.click(screen.getByRole('button'));
    // press Enter on the focused day button (today)
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(Date), to: null })
    );
  });
});
