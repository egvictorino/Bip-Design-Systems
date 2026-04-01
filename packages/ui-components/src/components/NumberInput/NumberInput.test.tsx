import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a spinbutton', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton').id).toBeTruthy();
  });

  it('accepts a placeholder', () => {
    render(<NumberInput placeholder="0" />);
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
  });

  it('renders as type="text" with inputMode="numeric"', () => {
    const { container } = render(<NumberInput />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders a label linked to the input via htmlFor/id', () => {
    render(<NumberInput label="Cantidad" />);
    const input = screen.getByRole('spinbutton', { name: 'Cantidad' });
    const label = screen.getByText('Cantidad');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('uses the provided id instead of the generated one', () => {
    render(<NumberInput id="my-number" label="Campo" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('id', 'my-number');
  });

  // ── Stepper buttons ────────────────────────────────────────────────────────

  it('renders increment and decrement buttons', () => {
    render(<NumberInput />);
    expect(screen.getByLabelText('Incrementar')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrementar')).toBeInTheDocument();
  });

  it('increment button increases value by step', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} step={1} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Incrementar'));
    expect(onChange).toHaveBeenCalledWith(6, undefined);
  });

  it('decrement button decreases value by step', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} step={1} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Decrementar'));
    expect(onChange).toHaveBeenCalledWith(4, undefined);
  });

  it('increment button is disabled when value equals max', () => {
    render(<NumberInput value={10} max={10} />);
    expect(screen.getByLabelText('Incrementar')).toBeDisabled();
  });

  it('decrement button is disabled when value equals min', () => {
    render(<NumberInput value={0} min={0} />);
    expect(screen.getByLabelText('Decrementar')).toBeDisabled();
  });

  it('increment clamps to max', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={9} max={10} step={5} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Incrementar'));
    expect(onChange).toHaveBeenCalledWith(10, undefined);
  });

  it('decrement clamps to min', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={1} min={0} step={5} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Decrementar'));
    expect(onChange).toHaveBeenCalledWith(0, undefined);
  });

  it('increment starts from min when field is empty', async () => {
    const onChange = vi.fn();
    render(<NumberInput min={5} step={1} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Incrementar'));
    expect(onChange).toHaveBeenCalledWith(6, undefined);
  });

  it('decrement starts from 0 when field is empty and no max', async () => {
    const onChange = vi.fn();
    render(<NumberInput step={1} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Decrementar'));
    expect(onChange).toHaveBeenCalledWith(-1, undefined);
  });

  // ── Keyboard navigation ────────────────────────────────────────────────────

  it('ArrowUp increments value', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={3} step={1} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(4, undefined);
  });

  it('ArrowDown decrements value', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={3} step={1} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(2, undefined);
  });

  // ── onChange callback ──────────────────────────────────────────────────────

  it('calls onChange with parsed number on valid input', async () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} />);
    await userEvent.type(screen.getByRole('spinbutton'), '42');
    // Last call should have 42
    const calls = onChange.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toBe(42);
  });

  it('calls onChange with null when field is cleared', async () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(onChange).toHaveBeenCalledWith(null, expect.anything());
  });

  // ── ARIA attributes ────────────────────────────────────────────────────────

  it('sets aria-valuemin and aria-valuemax when min/max are provided', () => {
    render(<NumberInput min={0} max={100} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets aria-valuenow when value is provided', () => {
    render(<NumberInput value={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '42');
  });

  it('does not set aria-valuenow when field is empty', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuenow');
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('input is disabled when disabled=true', () => {
    render(<NumberInput disabled label="Campo" />);
    expect(screen.getByRole('spinbutton', { name: 'Campo' })).toBeDisabled();
  });

  it('stepper buttons are disabled when disabled=true', () => {
    render(<NumberInput disabled />);
    expect(screen.getByLabelText('Incrementar')).toBeDisabled();
    expect(screen.getByLabelText('Decrementar')).toBeDisabled();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<NumberInput label="Campo" error />);
    expect(screen.getByRole('spinbutton', { name: 'Campo' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<NumberInput label="Campo" />);
    expect(screen.getByRole('spinbutton', { name: 'Campo' })).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<NumberInput error errorMessage="Valor inválido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Valor inválido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<NumberInput errorMessage="Valor inválido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('input is linked to errorMessage via aria-describedby', () => {
    render(<NumberInput label="Campo" error errorMessage="Error" />);
    const input = screen.getByRole('spinbutton', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('input is linked to errorMessage via aria-describedby without label', () => {
    render(<NumberInput error errorMessage="Error" />);
    const input = screen.getByRole('spinbutton');
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<NumberInput helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('input is linked to helperText via aria-describedby', () => {
    render(<NumberInput label="Campo" helperText="Ayuda" />);
    const input = screen.getByRole('spinbutton', { name: 'Campo' });
    const helper = screen.getByText('Ayuda');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('size %s applies correct size class to input', (size) => {
    render(<NumberInput size={size} />);
    expect(screen.getByRole('spinbutton')).toHaveClass(`input${size.charAt(0).toUpperCase() + size.slice(1)}`);
  });

  // ── Variants ───────────────────────────────────────────────────────────────

  it('defaults to outlined variant', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).toHaveClass('outlined');
  });

  it('filled variant applies filled class', () => {
    render(<NumberInput variant="filled" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('filled');
  });

  it('bare variant applies bare class', () => {
    render(<NumberInput variant="bare" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('bare');
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies wrapperFull class to container and inputWrapperFull to inner wrapper', () => {
    const { container } = render(<NumberInput fullWidth />);
    expect(container.firstChild).toHaveClass('wrapperFull');
    expect(container.querySelector('.inputWrapper')).toHaveClass('inputWrapperFull');
  });

  // ── Focus / Blur callbacks ─────────────────────────────────────────────────

  it('calls consumer onFocus when input is focused', () => {
    const onFocus = vi.fn();
    render(<NumberInput label="Campo" onFocus={onFocus} />);
    fireEvent.focus(screen.getByRole('spinbutton'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls consumer onBlur when input is blurred', () => {
    const onBlur = vi.fn();
    render(<NumberInput label="Campo" onBlur={onBlur} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  // ── required ────────────────────────────────────────────────────────────────

  it('renders required asterisk in label when required=true', () => {
    render(<NumberInput label="Cantidad" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not render required asterisk when required is not set', () => {
    render(<NumberInput label="Cantidad" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('sets required attribute on the input when required=true', () => {
    render(<NumberInput label="Cantidad" required />);
    expect(screen.getByRole('spinbutton')).toBeRequired();
  });

  it('does not set required attribute when required is not set', () => {
    render(<NumberInput label="Cantidad" />);
    expect(screen.getByRole('spinbutton')).not.toBeRequired();
  });

  // ── readOnly ────────────────────────────────────────────────────────────────

  it('sets readOnly attribute on the input when readOnly=true', () => {
    render(<NumberInput readOnly value={5} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('readonly');
  });

  it('disables increment button when readOnly=true', () => {
    render(<NumberInput readOnly value={5} />);
    expect(screen.getByLabelText('Incrementar')).toBeDisabled();
  });

  it('disables decrement button when readOnly=true', () => {
    render(<NumberInput readOnly value={5} />);
    expect(screen.getByLabelText('Decrementar')).toBeDisabled();
  });

  it('does not call onChange when increment is clicked and readOnly=true', async () => {
    const onChange = vi.fn();
    render(<NumberInput readOnly value={5} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Incrementar'));
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── prefix / suffix ─────────────────────────────────────────────────────────

  it('renders prefix text', () => {
    render(<NumberInput prefix="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders suffix text', () => {
    render(<NumberInput suffix="kg" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('prefix span is aria-hidden', () => {
    render(<NumberInput prefix="$" />);
    const prefixEl = screen.getByText('$');
    expect(prefixEl).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies prefix size class to input when prefix is present', () => {
    render(<NumberInput prefix="$" size="md" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('inputMdPrefix');
  });

  it('applies suffix size class to input when suffix is present', () => {
    render(<NumberInput suffix="%" size="md" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('inputMdSuffix');
  });

  it('applies both prefix and suffix classes when both are present', () => {
    render(<NumberInput prefix="$" suffix="MXN" size="sm" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('inputSmPrefix');
    expect(input).toHaveClass('inputSmSuffix');
  });

  // ── decimals ────────────────────────────────────────────────────────────────

  it('formats value to N decimals on blur', () => {
    render(<NumberInput value={5} decimals={2} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveValue('5.00');
  });

  it('rounds to 0 decimals on blur when decimals=0', () => {
    render(<NumberInput value={5.7} decimals={0} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveValue('6');
  });

  it('calls onChange with formatted value on blur when decimals is set', () => {
    const onChange = vi.fn();
    render(<NumberInput value={3} decimals={2} onChange={onChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(3, expect.anything());
  });

  it('prevents typing more decimals than allowed', async () => {
    render(<NumberInput decimals={2} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '1.123');
    // Only "1.12" should be accepted (the "3" is rejected)
    expect(input).toHaveValue('1.12');
  });

  it('prevents typing a decimal point when decimals=0', async () => {
    render(<NumberInput decimals={0} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '5.');
    expect(input).toHaveValue('5');
  });
});
