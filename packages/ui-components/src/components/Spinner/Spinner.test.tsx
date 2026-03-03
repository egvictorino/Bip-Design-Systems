import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('has role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Cargando..."', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Cargando...');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Procesando solicitud..." />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Procesando solicitud...');
  });

  it.each(['sm', 'md', 'lg'] as const)('renders with size %s', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.each(['primary', 'secondary', 'white'] as const)('renders with variant %s', (variant) => {
    render(<Spinner variant={variant} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('inner SVG is aria-hidden', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
