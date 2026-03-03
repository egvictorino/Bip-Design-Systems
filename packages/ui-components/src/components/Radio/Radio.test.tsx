import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with label and links it via htmlFor/id', () => {
    render(<Radio label="Opción A" />);
    const radio = screen.getByRole('radio', { name: 'Opción A' });
    const label = screen.getByText('Opción A');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', radio.id);
  });

  it('is unchecked by default', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Radio defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('is disabled when disabled=true', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

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

  it('renders helperText', () => {
    render(<Radio label="Opción" helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('radio is linked to errorMessage via aria-describedby', () => {
    render(<Radio label="Opción" error errorMessage="Error" />);
    const radio = screen.getByRole('radio', { name: 'Opción' });
    const alert = screen.getByRole('alert');
    expect(radio).toHaveAttribute('aria-describedby', alert.id);
  });
});
