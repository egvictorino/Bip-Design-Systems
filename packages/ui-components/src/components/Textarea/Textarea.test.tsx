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

  it.each(['sm', 'md', 'lg'] as const)('size %s applies the correct size class', (size) => {
    render(<Textarea size={size} />);
    expect(screen.getByRole('textbox')).toHaveClass(size);
  });

  // ── fullWidth ───────────────────────────────────────────────────────────────

  it('fullWidth applies fullWidth class to container and textarea', () => {
    const { container } = render(<Textarea fullWidth />);
    expect(container.firstChild).toHaveClass('fullWidth');
    expect(screen.getByRole('textbox')).toHaveClass('fullWidth');
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

  // ── required ────────────────────────────────────────────────────────────────

  it('renders asterisk mark when required=true', () => {
    render(<Textarea label="Motivo" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('asterisk mark has aria-hidden="true"', () => {
    render(<Textarea label="Motivo" required />);
    const mark = screen.getByText('*');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes required attribute to the underlying textarea', () => {
    render(<Textarea label="Motivo" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('does not render asterisk when required is not set', () => {
    render(<Textarea label="Motivo" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  // ── character counter ───────────────────────────────────────────────────────

  it('does not render counter when maxLength is not set', () => {
    render(<Textarea label="Campo" />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it('renders "0 / N" counter when maxLength is set and no initial value', () => {
    render(<Textarea label="Campo" maxLength={200} />);
    expect(screen.getByText('0 / 200')).toBeInTheDocument();
  });

  it('initializes counter with controlled value length', () => {
    render(<Textarea label="Campo" maxLength={100} value="Hola" onChange={() => {}} />);
    expect(screen.getByText('4 / 100')).toBeInTheDocument();
  });

  it('initializes counter with defaultValue length', () => {
    render(<Textarea label="Campo" maxLength={50} defaultValue="Texto inicial" />);
    expect(screen.getByText('13 / 50')).toBeInTheDocument();
  });

  it('updates counter on change', () => {
    render(<Textarea label="Campo" maxLength={100} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nuevo texto' } });
    expect(screen.getByText('11 / 100')).toBeInTheDocument();
  });

  it('calls consumer onChange when typing', () => {
    const onChange = vi.fn();
    render(<Textarea label="Campo" maxLength={100} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('counter renders alongside helperText in the same footer row', () => {
    render(<Textarea label="Campo" maxLength={100} helperText="Ayuda" />);
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
  });

  it('counter renders alongside errorMessage when error=true', () => {
    render(<Textarea label="Campo" maxLength={100} error errorMessage="Error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.getByText('0 / 100')).toBeInTheDocument();
  });

  // ── autoGrow ────────────────────────────────────────────────────────────────

  it('renders without errors when autoGrow=true', () => {
    render(<Textarea label="Campo" autoGrow />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies autoGrow class when autoGrow=true', () => {
    render(<Textarea label="Campo" autoGrow />);
    expect(screen.getByRole('textbox')).toHaveClass('autoGrow');
  });

  it('does not apply autoGrow class when autoGrow=false', () => {
    render(<Textarea label="Campo" />);
    expect(screen.getByRole('textbox')).not.toHaveClass('autoGrow');
  });
});
