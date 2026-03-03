import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá', disabled: true },
];

describe('Select', () => {
  it('renders a combobox', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

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

  it('renders with label and links it via htmlFor/id', () => {
    render(<Select options={options} label="País" />);
    const select = screen.getByRole('combobox', { name: 'País' });
    const label = screen.getByText('País');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', select.id);
  });

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

  it('renders helperText', () => {
    render(<Select options={options} helperText="Elige tu país de residencia" />);
    expect(screen.getByText('Elige tu país de residencia')).toBeInTheDocument();
  });

  it('is disabled when disabled=true', () => {
    render(<Select options={options} label="País" disabled />);
    expect(screen.getByRole('combobox', { name: 'País' })).toBeDisabled();
  });

  it('renders a disabled option correctly', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Canadá' })).toBeDisabled();
  });
});
