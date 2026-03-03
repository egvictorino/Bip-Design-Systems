import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Mensaje</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<Alert>Contenido de alerta</Alert>);
    expect(screen.getByText('Contenido de alerta')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Título de alerta">Mensaje</Alert>);
    expect(screen.getByText('Título de alerta')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(<Alert>Mensaje</Alert>);
    // Only the children text should exist, no extra heading
    expect(screen.getByRole('alert')).not.toHaveTextContent('Título');
  });

  it('renders close button when onClose is provided', () => {
    render(<Alert onClose={() => {}}>Mensaje</Alert>);
    expect(screen.getByRole('button', { name: 'Cerrar alerta' })).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert>Mensaje</Alert>);
    expect(screen.queryByRole('button', { name: 'Cerrar alerta' })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Mensaje</Alert>);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar alerta' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each(['info', 'success', 'warning', 'error'] as const)('renders variant %s', (variant) => {
    render(<Alert variant={variant}>Mensaje {variant}</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(`Mensaje ${variant}`)).toBeInTheDocument();
  });
});
