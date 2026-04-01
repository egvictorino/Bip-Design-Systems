import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá', disabled: true },
];

describe('Select', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders a combobox', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards ref to the underlying select element', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select options={options} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('always has an id even without a label (for aria-describedby)', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox').id).toBeTruthy();
  });

  it('uses provided id instead of the generated one', () => {
    render(<Select options={options} id="my-select" label="País" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-select');
  });

  // ── Options ────────────────────────────────────────────────────────────────

  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'México' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Estados Unidos' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canadá' })).toBeInTheDocument();
  });

  it('renders placeholder as a disabled option', () => {
    render(<Select options={options} placeholder="Selecciona una opción" />);
    expect(screen.getByRole('option', { name: 'Selecciona una opción' })).toBeDisabled();
  });

  it('renders a disabled option correctly', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Canadá' })).toBeDisabled();
  });

  // ── Label & id linkage ──────────────────────────────────────────────────────

  it('renders with label and links it via htmlFor/id', () => {
    render(<Select options={options} label="País" />);
    const select = screen.getByRole('combobox', { name: 'País' });
    const label = screen.getByText('País');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', select.id);
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('is disabled when disabled=true', () => {
    render(<Select options={options} label="País" disabled />);
    expect(screen.getByRole('combobox', { name: 'País' })).toBeDisabled();
  });

  // ── Error state ─────────────────────────────────────────────────────────────

  it('has aria-invalid when error=true', () => {
    render(<Select options={options} label="País" error />);
    expect(screen.getByRole('combobox', { name: 'País' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Select options={options} label="País" />);
    expect(screen.getByRole('combobox', { name: 'País' })).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Select options={options} error errorMessage="Selecciona un país" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un país');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Select options={options} errorMessage="Selecciona un país" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('select is linked to errorMessage via aria-describedby (with label)', () => {
    render(<Select options={options} label="País" error errorMessage="Error" />);
    const select = screen.getByRole('combobox', { name: 'País' });
    const alert = screen.getByRole('alert');
    expect(select).toHaveAttribute('aria-describedby', alert.id);
  });

  it('select is linked to errorMessage via aria-describedby (without label)', () => {
    render(<Select options={options} error errorMessage="Error" />);
    const select = screen.getByRole('combobox');
    const alert = screen.getByRole('alert');
    // must link even when no label is provided
    expect(select).toHaveAttribute('aria-describedby', alert.id);
  });

  // ── Helper text ─────────────────────────────────────────────────────────────

  it('renders helperText', () => {
    render(<Select options={options} helperText="Elige tu país de residencia" />);
    expect(screen.getByText('Elige tu país de residencia')).toBeInTheDocument();
  });

  it('select is linked to helperText via aria-describedby', () => {
    render(<Select options={options} label="País" helperText="Ayuda" />);
    const select = screen.getByRole('combobox', { name: 'País' });
    const helper = screen.getByText('Ayuda');
    expect(select).toHaveAttribute('aria-describedby', helper.id);
  });

  it('errorMessage takes priority over helperText when both are provided', () => {
    render(<Select options={options} error errorMessage="Error" helperText="Ayuda" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('size %s applies the correct size class', (size) => {
    render(<Select options={options} size={size} />);
    expect(screen.getByRole('combobox')).toHaveClass(size);
  });

  // ── fullWidth ───────────────────────────────────────────────────────────────

  it('fullWidth applies fullWidth class to the container', () => {
    const { container } = render(<Select options={options} fullWidth />);
    expect(container.firstChild).toHaveClass('fullWidth');
  });

  // ── Focus / Blur callbacks ──────────────────────────────────────────────────

  it('calls consumer onFocus when select is focused', () => {
    const onFocus = vi.fn();
    render(<Select options={options} label="País" onFocus={onFocus} />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls consumer onBlur when select is blurred', () => {
    const onBlur = vi.fn();
    render(<Select options={options} label="País" onBlur={onBlur} />);
    const select = screen.getByRole('combobox');
    fireEvent.focus(select);
    fireEvent.blur(select);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('calls consumer onChange when value changes', () => {
    const onChange = vi.fn();
    render(<Select options={options} label="País" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mx' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // ── Variants ────────────────────────────────────────────────────────────────

  it.each(['outlined', 'filled', 'bare'] as const)('variant %s applies the correct class', (variant) => {
    render(<Select options={options} variant={variant} />);
    expect(screen.getByRole('combobox')).toHaveClass(variant);
  });

  // ── Required ────────────────────────────────────────────────────────────────

  it('select has required attribute when required=true', () => {
    render(<Select options={options} label="País" required />);
    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('shows * indicator in label when required=true', () => {
    render(<Select options={options} label="País" required />);
    expect(screen.getByText('País').closest('label')).toHaveTextContent('País *');
  });

  it('does not show * indicator when required=false', () => {
    render(<Select options={options} label="País" />);
    expect(screen.getByText('País').closest('label')).not.toHaveTextContent('*');
  });

  // ── Optgroup ────────────────────────────────────────────────────────────────

  it('renders optgroup with correct label', () => {
    const groups = [
      { label: 'Norte', options: [{ value: 'nl', label: 'Nuevo León' }] },
      { label: 'Centro', options: [{ value: 'cdmx', label: 'Ciudad de México' }] },
    ];
    const { container } = render(<Select groups={groups} />);
    const optgroups = container.querySelectorAll('optgroup');
    expect(optgroups).toHaveLength(2);
    expect(optgroups[0]).toHaveAttribute('label', 'Norte');
    expect(optgroups[1]).toHaveAttribute('label', 'Centro');
  });

  it('renders options inside optgroups', () => {
    const groups = [
      { label: 'Norte', options: [{ value: 'nl', label: 'Nuevo León' }, { value: 'coah', label: 'Coahuila' }] },
    ];
    render(<Select groups={groups} />);
    expect(screen.getByRole('option', { name: 'Nuevo León' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Coahuila' })).toBeInTheDocument();
  });

  // ── Chevron ─────────────────────────────────────────────────────────────────

  it('chevron span has aria-hidden="true"', () => {
    const { container } = render(<Select options={options} />);
    const chevron = container.querySelector('[aria-hidden="true"]');
    expect(chevron).toBeInTheDocument();
  });
});
