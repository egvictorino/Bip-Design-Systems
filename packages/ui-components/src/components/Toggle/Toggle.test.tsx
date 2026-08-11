import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders with role="switch"', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Toggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch').id).toBeTruthy();
  });

  it('uses provided id instead of the generated one', () => {
    render(<Toggle id="my-toggle" label="Toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'my-toggle');
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders with label and links it via htmlFor/id', () => {
    render(<Toggle label="Notificaciones" />);
    const toggle = screen.getByRole('switch', { name: 'Notificaciones' });
    const label = screen.getByText('Notificaciones');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', toggle.id);
  });

  // ── Checked state ──────────────────────────────────────────────────────────

  it('is unchecked by default', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('toggles when clicked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<Toggle label="Toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Toggle disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle disabled label="Toggle" />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<Toggle error />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Toggle label="Toggle" error errorMessage="Campo requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Toggle errorMessage="Campo requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('toggle is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Toggle label="Toggle" error errorMessage="Error" />);
    const toggle = screen.getByRole('switch', { name: 'Toggle' });
    const alert = screen.getByRole('alert');
    expect(toggle).toHaveAttribute('aria-describedby', alert.id);
  });

  it('toggle is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Toggle error errorMessage="Error" />);
    const toggle = screen.getByRole('switch');
    const alert = screen.getByRole('alert');
    // must link even when no label is provided
    expect(toggle).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Toggle label="Toggle" helperText="Activa para recibir avisos" />);
    expect(screen.getByText('Activa para recibir avisos')).toBeInTheDocument();
  });

  it('toggle is linked to helperText via aria-describedby', () => {
    render(<Toggle label="Toggle" helperText="Ayuda" />);
    const toggle = screen.getByRole('switch');
    const helper = screen.getByText('Ayuda');
    expect(toggle).toHaveAttribute('aria-describedby', helper.id);
  });

  it('errorMessage takes priority over helperText when both are provided', () => {
    render(<Toggle error errorMessage="Error" helperText="Ayuda" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'labelSm', 'trackSm'],
    ['md', 'labelMd', 'trackMd'],
    ['lg', 'labelLg', 'trackLg'],
  ] as const)('size %s applies correct label and track classes', (size, labelClass, trackClass) => {
    const { container } = render(<Toggle size={size} label="Toggle" />);
    expect(screen.getByText('Toggle')).toHaveClass(labelClass);
    const track = container.querySelector('.track') as HTMLElement;
    expect(track).toHaveClass(trackClass);
  });

  // ── Required ───────────────────────────────────────────────────────────────

  it('shows a required asterisk next to the label when required is true', () => {
    render(<Toggle label="Notificaciones" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show a required asterisk when required is not set', () => {
    render(<Toggle label="Notificaciones" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('sets required on the underlying input when required is true', () => {
    render(<Toggle label="Notificaciones" required />);
    expect(screen.getByRole('switch')).toBeRequired();
  });
});
