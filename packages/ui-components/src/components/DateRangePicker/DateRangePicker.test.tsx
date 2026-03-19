import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from './DateRangePicker';

const noop = () => {};

describe('DateRangePicker', () => {
  it('renders with placeholder', () => {
    render(<DateRangePicker />);
    expect(screen.getByText('DD/MM/AAAA – DD/MM/AAAA')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<DateRangePicker label="Periodo" />);
    expect(screen.getByText('Periodo')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<DateRangePicker helperText="Selecciona un rango" />);
    expect(screen.getByText('Selecciona un rango')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<DateRangePicker error errorMessage="Rango inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Rango inválido');
  });

  it('opens calendar on trigger click', async () => {
    render(<DateRangePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes calendar on Escape', async () => {
    render(<DateRangePicker />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows from date in trigger when from is set', () => {
    render(
      <DateRangePicker value={{ from: new Date(2024, 0, 15), to: null }} onChange={noop} />
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
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

  it('is disabled when disabled prop is true', () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open calendar when disabled', async () => {
    render(<DateRangePicker disabled />);
    await userEvent.click(screen.getByRole('button'));
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
