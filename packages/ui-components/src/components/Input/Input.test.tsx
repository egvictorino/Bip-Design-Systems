import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label and links it via htmlFor/id', () => {
    render(<Input label="Nombre" />);
    const input = screen.getByRole('textbox', { name: 'Nombre' });
    const label = screen.getByText('Nombre');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders helperText', () => {
    render(<Input helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Input error errorMessage="Campo requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Input errorMessage="Campo requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('has aria-invalid when error=true', () => {
    render(<Input label="Campo" error />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Input label="Campo" />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).not.toHaveAttribute('aria-invalid');
  });

  it('input is linked to errorMessage via aria-describedby', () => {
    render(<Input label="Campo" error errorMessage="Error" />);
    const input = screen.getByRole('textbox', { name: 'Campo' });
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('input is linked to helperText via aria-describedby', () => {
    render(<Input label="Campo" helperText="Ayuda" />);
    const input = screen.getByRole('textbox', { name: 'Campo' });
    const helper = screen.getByText('Ayuda');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  it('is disabled when disabled=true', () => {
    render(<Input disabled label="Campo" />);
    expect(screen.getByRole('textbox', { name: 'Campo' })).toBeDisabled();
  });

  it('renders as password input when type="password"', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('renders as email input when type="email"', () => {
    render(<Input type="email" label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  });

  it('accepts a placeholder', () => {
    render(<Input placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });
});
