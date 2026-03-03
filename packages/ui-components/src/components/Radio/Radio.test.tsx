import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a radio input', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('radio');
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<Radio />);
    expect(screen.getByRole('radio').id).toBeTruthy();
  });

  it('uses provided id instead of the generated one', () => {
    render(<Radio id="custom-radio" label="Opción" />);
    expect(screen.getByRole('radio')).toHaveAttribute('id', 'custom-radio');
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders with label and links it via htmlFor/id', () => {
    render(<Radio label="Opción A" />);
    const radio = screen.getByRole('radio', { name: 'Opción A' });
    const label = screen.getByText('Opción A');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', radio.id);
  });

  // ── Checked state ──────────────────────────────────────────────────────────

  it('is unchecked by default', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Radio defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('toggles when clicked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<Radio label="Opción" />);
    const radio = screen.getByRole('radio');
    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Radio disabled label="Opción" />);
    await user.click(screen.getByRole('radio'));
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('does NOT have aria-invalid even when error=true (radio role does not support it)', () => {
    render(<Radio error />);
    // Per WAI-ARIA spec, aria-invalid is not valid on the radio role
    expect(screen.getByRole('radio')).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Radio label="Opción" error errorMessage="Selección requerida" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Selección requerida');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Radio errorMessage="Selección requerida" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('radio is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Radio label="Opción" error errorMessage="Error" />);
    const radio = screen.getByRole('radio', { name: 'Opción' });
    const alert = screen.getByRole('alert');
    expect(radio).toHaveAttribute('aria-describedby', alert.id);
  });

  it('radio is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Radio error errorMessage="Error" />);
    const radio = screen.getByRole('radio');
    const alert = screen.getByRole('alert');
    // must link even when no label is provided
    expect(radio).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Radio label="Opción" helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('radio is linked to helperText via aria-describedby', () => {
    render(<Radio label="Opción" helperText="Ayuda" />);
    const radio = screen.getByRole('radio');
    const helper = screen.getByText('Ayuda');
    expect(radio).toHaveAttribute('aria-describedby', helper.id);
  });

  it('errorMessage takes priority over helperText when both are provided', () => {
    render(<Radio error errorMessage="Error" helperText="Ayuda" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'text-xs', 'w-3.5', 'h-3.5'],
    ['md', 'text-sm', 'w-4', 'h-4'],
    ['lg', 'text-base', 'w-5', 'h-5'],
  ] as const)('size %s applies correct label and box classes', (size, labelClass, w, h) => {
    const { container } = render(<Radio size={size} label="Opción" />);
    expect(screen.getByText('Opción')).toHaveClass(labelClass);
    const box = container.querySelector('div.relative') as HTMLElement;
    expect(box).toHaveClass(w, h);
  });
});
