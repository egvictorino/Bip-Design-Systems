import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, useState } from 'react';
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

  it('renders as url input when type="url"', () => {
    render(<Input type="url" label="Sitio web" />);
    expect(screen.getByRole('textbox', { name: 'Sitio web' })).toHaveAttribute('type', 'url');
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

  it.each(['sm', 'md', 'lg'] as const)('size %s applies the correct size class', (size) => {
    render(<Input size={size} />);
    expect(screen.getByRole('textbox')).toHaveClass(size);
  });

  it('sm size text is smaller than md size text (correct progression)', () => {
    const { rerender } = render(<Input size="sm" />);
    const smEl = screen.getByRole('textbox');
    expect(smEl).toHaveClass('sm');
    expect(smEl).not.toHaveClass('md');

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('md');
  });

  // ── Variants ────────────────────────────────────────────────────────────────

  it('defaults to outlined variant', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass('outlined');
  });

  it('filled variant applies filled class', () => {
    render(<Input variant="filled" />);
    expect(screen.getByRole('textbox')).toHaveClass('filled');
  });

  it('bare variant applies bare class', () => {
    render(<Input variant="bare" />);
    expect(screen.getByRole('textbox')).toHaveClass('bare');
  });

  // ── fullWidth ───────────────────────────────────────────────────────────────

  it('fullWidth applies fullWidth class to container and input container', () => {
    const { container } = render(<Input fullWidth />);
    expect(container.firstChild).toHaveClass('fullWidth');
    expect(container.querySelector('.inputContainerFullWidth')).toBeInTheDocument();
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

  // ── onChange callback ───────────────────────────────────────────────────────

  it('calls consumer onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nuevo valor' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // ── ReadOnly ────────────────────────────────────────────────────────────────

  it('applies readOnly attribute when readOnly=true', () => {
    render(<Input readOnly value="RFC123" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  // ── Required indicator ──────────────────────────────────────────────────────

  it('shows asterisk in label when required=true', () => {
    render(<Input label="Campo" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show asterisk when required=false', () => {
    render(<Input label="Campo" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('applies aria-required to the input when required=true', () => {
    render(<Input label="Campo" required />);
    expect(screen.getByRole('textbox', { name: /Campo/ })).toHaveAttribute('required');
  });

  // ── startIcon ───────────────────────────────────────────────────────────────

  it('renders startIcon when provided', () => {
    render(<Input startIcon={<span data-testid="start-icon">🔍</span>} />);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('applies hasStartIcon class to input when startIcon is provided', () => {
    render(<Input startIcon={<span>icon</span>} />);
    expect(screen.getByRole('textbox')).toHaveClass('hasStartIcon');
  });

  // ── endIcon ─────────────────────────────────────────────────────────────────

  it('renders endIcon when provided', () => {
    render(<Input endIcon={<span data-testid="end-icon">@</span>} />);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('applies hasEndAdornment class to input when endIcon is provided', () => {
    render(<Input endIcon={<span>icon</span>} />);
    expect(screen.getByRole('textbox')).toHaveClass('hasEndAdornment');
  });

  // ── clearable ───────────────────────────────────────────────────────────────

  it('shows clear button when clearable=true and value is non-empty', () => {
    render(<Input clearable value="algo" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Limpiar campo' })).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<Input clearable value="" onChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Limpiar campo' })).not.toBeInTheDocument();
  });

  it('does not show clear button when clearable=true but no onChange', () => {
    render(<Input clearable value="algo" />);
    expect(screen.queryByRole('button', { name: 'Limpiar campo' })).not.toBeInTheDocument();
  });

  it('clear button has correct aria-label', () => {
    render(<Input clearable value="algo" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Limpiar campo' })).toBeInTheDocument();
  });

  it('calls onChange with empty value when clear button is clicked', () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();

    const Wrapper = () => {
      const [val, setVal] = useState('texto');
      return (
        <Input
          ref={ref}
          clearable
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            onChange(e);
          }}
        />
      );
    };

    render(<Wrapper />);
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar campo' }));
    expect(onChange).toHaveBeenCalled();
  });

  // ── Password toggle ─────────────────────────────────────────────────────────

  it('renders password toggle button when type="password"', () => {
    render(<Input type="password" />);
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
  });

  it('does not render password toggle for non-password types', () => {
    render(<Input type="text" />);
    expect(screen.queryByRole('button', { name: 'Mostrar contraseña' })).not.toBeInTheDocument();
  });

  it('toggles password visibility on button click', () => {
    const { container } = render(<Input type="password" />);
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
    const input = container.querySelector('input')!;

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('password toggle has hasEndAdornment class on input', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input')).toHaveClass('hasEndAdornment');
  });
});
