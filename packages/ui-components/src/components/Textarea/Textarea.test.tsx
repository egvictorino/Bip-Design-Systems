import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label and links it via htmlFor/id', () => {
    render(<Textarea label="Descripción" />);
    const textarea = screen.getByRole('textbox', { name: 'Descripción' });
    const label = screen.getByText('Descripción');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', textarea.id);
  });

  it('renders helperText', () => {
    render(<Textarea helperText="Máximo 200 caracteres" />);
    expect(screen.getByText('Máximo 200 caracteres')).toBeInTheDocument();
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Textarea error errorMessage="El campo es requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('El campo es requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Textarea errorMessage="El campo es requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has aria-invalid when error=true', () => {
    render(<Textarea label="Descripción" error />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Textarea label="Descripción" />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).not.toHaveAttribute(
      'aria-invalid'
    );
  });

  it('textarea is linked to errorMessage via aria-describedby', () => {
    render(<Textarea label="Campo" error errorMessage="Error" />);
    const textarea = screen.getByRole('textbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(textarea).toHaveAttribute('aria-describedby', alert.id);
  });

  it('is disabled when disabled=true', () => {
    render(<Textarea disabled label="Descripción" />);
    expect(screen.getByRole('textbox', { name: 'Descripción' })).toBeDisabled();
  });

  it('accepts a placeholder', () => {
    render(<Textarea placeholder="Escribe tu mensaje" />);
    expect(screen.getByPlaceholderText('Escribe tu mensaje')).toBeInTheDocument();
  });
});
