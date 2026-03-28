import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a checkbox input', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders a label and links it to the input via htmlFor/id', () => {
    render(<Checkbox label="Acepto los términos" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos' });
    const label = screen.getByText('Acepto los términos');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('uses the provided id instead of generating one', () => {
    render(<Checkbox id="custom-id" label="Opción" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
  });

  it('always has an id even without a label (needed for aria-describedby)', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox').id).toBeTruthy();
  });

  // ── Checked state ──────────────────────────────────────────────────────────

  it('is unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles when clicked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Acepto" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled label="Acepto" />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<Checkbox error />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Checkbox error errorMessage="Este campo es requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Este campo es requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Checkbox errorMessage="Este campo es requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('checkbox is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Checkbox label="Campo" error errorMessage="Error" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(checkbox).toHaveAttribute('aria-describedby', alert.id);
  });

  it('checkbox is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Checkbox error errorMessage="Error" />);
    const checkbox = screen.getByRole('checkbox');
    const alert = screen.getByRole('alert');
    // aria-describedby must be set even when no label is provided
    expect(checkbox).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Checkbox helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('checkbox is linked to helperText via aria-describedby', () => {
    render(<Checkbox label="Acepto" helperText="Texto de ayuda" />);
    const checkbox = screen.getByRole('checkbox');
    const helper = screen.getByText('Texto de ayuda');
    expect(checkbox).toHaveAttribute('aria-describedby', helper.id);
  });

  it('errorMessage takes priority over helperText when both are provided', () => {
    render(<Checkbox error errorMessage="Error" helperText="Ayuda" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'labelSm', 'boxSm'],
    ['md', 'labelMd', 'boxMd'],
    ['lg', 'labelLg', 'boxLg'],
  ] as const)('size %s applies correct label and box classes', (size, labelClass, boxClass) => {
    const { container } = render(<Checkbox size={size} label="Opción" />);
    expect(screen.getByText('Opción')).toHaveClass(labelClass);
    const box = container.querySelector('.box') as HTMLElement;
    expect(box).toHaveClass(boxClass);
  });

  // ── Indeterminate state ────────────────────────────────────────────────────

  it('sets input.indeterminate to true when indeterminate={true}', async () => {
    render(<Checkbox indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    // Wait for useEffect to run
    await new Promise((r) => setTimeout(r, 0));
    expect(checkbox.indeterminate).toBe(true);
  });

  it('sets input.indeterminate to false when indeterminate={false}', async () => {
    render(<Checkbox indeterminate={false} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    await new Promise((r) => setTimeout(r, 0));
    expect(checkbox.indeterminate).toBe(false);
  });

  it('updates indeterminate when prop changes', async () => {
    const { rerender } = render(<Checkbox indeterminate={false} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    await new Promise((r) => setTimeout(r, 0));
    expect(checkbox.indeterminate).toBe(false);
    rerender(<Checkbox indeterminate={true} />);
    await new Promise((r) => setTimeout(r, 0));
    expect(checkbox.indeterminate).toBe(true);
  });

  // ── Required state ─────────────────────────────────────────────────────────

  it('renders an asterisk when required=true and label is provided', () => {
    render(<Checkbox required label="Campo obligatorio" />);
    // The asterisk span is aria-hidden but still in the DOM
    const label = screen.getByText('Campo obligatorio').closest('label') as HTMLElement;
    expect(label.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('passes required attribute to the underlying input', () => {
    render(<Checkbox required label="Campo" />);
    expect(screen.getByRole('checkbox')).toBeRequired();
  });

  it('does not crash when required=true and no label is provided', () => {
    expect(() => render(<Checkbox required />)).not.toThrow();
  });

  // ── Hover class on error state ─────────────────────────────────────────────

  it('error state box has boxError class', () => {
    const { container } = render(<Checkbox error />);
    const box = container.querySelector('.box') as HTMLElement;
    expect(box).toHaveClass('boxError');
  });
});
