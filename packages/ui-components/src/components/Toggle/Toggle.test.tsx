import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders with role="switch"', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with label and links it via htmlFor/id', () => {
    render(<Toggle label="Notificaciones" />);
    const toggle = screen.getByRole('switch', { name: 'Notificaciones' });
    const label = screen.getByText('Notificaciones');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', toggle.id);
  });

  it('is unchecked by default', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('is checked when defaultChecked=true', () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('is disabled when disabled=true', () => {
    render(<Toggle disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('has aria-invalid when error=true', () => {
    render(<Toggle error />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not have aria-invalid when error=false', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
  });

  it('renders errorMessage with role="alert" when error=true', () => {
    render(<Toggle label="Toggle" error errorMessage="Campo requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
  });

  it('does not render errorMessage when error=false', () => {
    render(<Toggle errorMessage="Campo requerido" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders helperText', () => {
    render(<Toggle label="Toggle" helperText="Activa para recibir avisos" />);
    expect(screen.getByText('Activa para recibir avisos')).toBeInTheDocument();
  });

  it('toggle is linked to errorMessage via aria-describedby', () => {
    render(<Toggle label="Toggle" error errorMessage="Error" />);
    const toggle = screen.getByRole('switch', { name: 'Toggle' });
    const alert = screen.getByRole('alert');
    expect(toggle).toHaveAttribute('aria-describedby', alert.id);
  });
});
