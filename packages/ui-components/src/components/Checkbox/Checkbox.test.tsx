import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label and links it via htmlFor/id', () => {
    render(<Checkbox label="Acepto los términos" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos' });
    const label = screen.getByText('Acepto los términos');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('is unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is disabled when disabled=true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('has aria-invalid when error=true', () => {
    render(<Checkbox error />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Checkbox label="Acepto" error errorMessage="Este campo es requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Este campo es requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Checkbox errorMessage="Este campo es requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders helperText', () => {
    render(<Checkbox label="Acepto" helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('checkbox is linked to errorMessage via aria-describedby', () => {
    render(<Checkbox label="Campo" error errorMessage="Error" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(checkbox).toHaveAttribute('aria-describedby', alert.id);
  });
});
