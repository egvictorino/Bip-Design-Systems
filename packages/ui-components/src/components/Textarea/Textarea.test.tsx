import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox').id).toBeTruthy();
  });

  it('uses provided id instead of the generated one', () => {
    render(<Textarea id="my-textarea" label="Campo" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
  });

  it('accepts a placeholder', () => {
    render(<Textarea placeholder="Escribe tu mensaje" />);
    expect(screen.getByPlaceholderText('Escribe tu mensaje')).toBeInTheDocument();
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders with label and links it via htmlFor/id', () => {
    render(<Textarea label="Descripción" />);
    const textarea = screen.getByRole('textbox', { name: 'Descripción' });
    const label = screen.getByText('Descripción');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', textarea.id);
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Textarea disabled label="Descripción" />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toBeDisabled();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<Textarea label="Descripción" error />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Textarea label="Descripción" />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Textarea error errorMessage="El campo es requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('El campo es requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Textarea errorMessage="El campo es requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('textarea is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Textarea label="Campo" error errorMessage="Error" />);
    const textarea = screen.getByRole('textbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(textarea).toHaveAttribute('aria-describedby', alert.id);
  });

  it('textarea is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Textarea error errorMessage="Error" />);
    const textarea = screen.getByRole('textbox');
    const alert = screen.getByRole('alert');
    // must link even when no label is provided
    expect(textarea).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Textarea helperText="Máximo 200 caracteres" />);
    expect(screen.getByText('Máximo 200 caracteres')).toBeInTheDocument();
  });

  it('textarea is linked to helperText via aria-describedby', () => {
    render(<Textarea label="Campo" helperText="Ayuda" />);
    const textarea = screen.getByRole('textbox', { name: 'Campo' });
    const helper = screen.getByText('Ayuda');
    expect(textarea).toHaveAttribute('aria-describedby', helper.id);
  });

  it('errorMessage takes priority over helperText when both are provided', () => {
    render(<Textarea error errorMessage="Error" helperText="Ayuda" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-lg'],
  ] as const)('size %s applies the correct text class', (size, textClass) => {
    render(<Textarea size={size} />);
    expect(screen.getByRole('textbox')).toHaveClass(textClass);
  });

  // ── fullWidth ───────────────────────────────────────────────────────────────

  it('fullWidth applies w-full to container and textarea', () => {
    const { container } = render(<Textarea fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
    expect(screen.getByRole('textbox')).toHaveClass('w-full');
  });

  // ── Focus / Blur callbacks ──────────────────────────────────────────────────

  it('calls consumer onFocus when textarea is focused', () => {
    const onFocus = vi.fn();
    render(<Textarea label="Campo" onFocus={onFocus} />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls consumer onBlur when textarea is blurred', () => {
    const onBlur = vi.fn();
    render(<Textarea label="Campo" onBlur={onBlur} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
