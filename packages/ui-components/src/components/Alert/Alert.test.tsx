import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  // ── Roles (live region semantics) ────────────────────────────────────────

  it('info variant renders with role="status" (polite live region)', () => {
    render(<Alert variant="info">Mensaje</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('success variant renders with role="status" (polite live region)', () => {
    render(<Alert variant="success">Mensaje</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('warning variant renders with role="alert" (assertive live region)', () => {
    render(<Alert variant="warning">Mensaje</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('error variant renders with role="alert" (assertive live region)', () => {
    render(<Alert variant="error">Mensaje</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('default variant (info) renders with role="status"', () => {
    render(<Alert>Mensaje</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // ── Content ───────────────────────────────────────────────────────────────

  it('renders children content', () => {
    render(<Alert>Contenido de alerta</Alert>);
    expect(screen.getByText('Contenido de alerta')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Título de alerta">Mensaje</Alert>);
    expect(screen.getByText('Título de alerta')).toBeInTheDocument();
  });

  it('does not render title element when not provided', () => {
    const { container } = render(<Alert>Mensaje</Alert>);
    // No <p> with font-semibold for title
    expect(container.querySelector('p.font-semibold')).not.toBeInTheDocument();
  });

  it('renders rich children without invalid HTML (div wrapper, not p)', () => {
    render(
      <Alert>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Alert>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  // ── Close button ──────────────────────────────────────────────────────────

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

  // ── All variants render ───────────────────────────────────────────────────

  it.each(['info', 'success', 'warning', 'error'] as const)('renders variant %s', (variant) => {
    render(<Alert variant={variant}>Mensaje {variant}</Alert>);
    expect(screen.getByText(`Mensaje ${variant}`)).toBeInTheDocument();
  });
});
