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

  it.each([
    ['sm', 'w-4', 'h-4'],
    ['md', 'w-6', 'h-6'],
    ['lg', 'w-8', 'h-8'],
  ] as const)('size %s applies correct svg dimensions', (size, w, h) => {
    const { container } = render(<Spinner size={size} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass(w, h);
  });

  it('forwards className to the wrapper span', () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
