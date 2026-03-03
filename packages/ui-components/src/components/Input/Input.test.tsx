import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a text input', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<Input />);
    expect(screen.getByRole('textbox').id).toBeTruthy();
  });

  it('accepts a placeholder', () => {
    render(<Input placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders a label linked to the input via htmlFor/id', () => {
    render(<Input label="Nombre" />);
    const input = screen.getByRole('textbox', { name: 'Nombre' });
    const label = screen.getByText('Nombre');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('uses the provided id instead of the generated one', () => {
    render(<Input id="my-input" label="Campo" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
  });

  // ── Input types ─────────────────────────────────────────────────────────────

  it('renders as password input when type="password"', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('renders as email input when type="email"', () => {
    render(<Input type="email" label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  });

  it('renders as number input when type="number"', () => {
    const { container } = render(<Input type="number" />);
    expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Input disabled label="Campo" />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).toBeDisabled();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<Input label="Campo" error />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Input label="Campo" />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Input error errorMessage="Campo requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Input errorMessage="Campo requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('input is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Input label="Campo" error errorMessage="Error" />);
    const input = screen.getByRole('textbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('input is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Input error errorMessage="Error" />);
    const input = screen.getByRole('textbox');
    const alert = screen.getByRole('alert');
    // must link even when no label is provided
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Input helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('input is linked to helperText via aria-describedby', () => {
    render(<Input label="Campo" helperText="Ayuda" />);
    const input = screen.getByRole('textbox', { name: 'Campo' });
    const helper = screen.getByText('Ayuda');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-lg'],
  ] as const)('size %s applies the correct text class', (size, textClass) => {
    render(<Input size={size} />);
    expect(screen.getByRole('textbox')).toHaveClass(textClass);
  });

  it('sm size text is smaller than md size text (correct progression)', () => {
    const { rerender } = render(<Input size="sm" />);
    const smEl = screen.getByRole('textbox');
    expect(smEl).toHaveClass('text-xs');
    expect(smEl).not.toHaveClass('text-sm');

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('text-sm');
  });

  // ── Variants ────────────────────────────────────────────────────────────────

  it('defaults to outlined variant with border and bg-interaction-field', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass('border', 'bg-interaction-field');
  });

  it('filled variant has no border and uses bg-interaction-secondary-default', () => {
    render(<Input variant="filled" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-interaction-secondary-default');
    expect(input).toHaveClass('border-0');
  });

  it('bare variant has bottom border only', () => {
    render(<Input variant="bare" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-0', 'border-b-2');
  });

  // ── fullWidth ───────────────────────────────────────────────────────────────

  it('fullWidth applies w-full to container and input', () => {
    const { container } = render(<Input fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
  });

  // ── Focus / Blur callbacks ──────────────────────────────────────────────────

  it('calls consumer onFocus when input is focused', () => {
    const onFocus = vi.fn();
    render(<Input label="Campo" onFocus={onFocus} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls consumer onBlur when input is blurred', () => {
    const onBlur = vi.fn();
    render(<Input label="Campo" onBlur={onBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
