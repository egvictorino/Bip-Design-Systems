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

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('renders with size %s', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.each(['primary', 'secondary', 'inverse', 'danger', 'success', 'info'] as const)(
    'renders with variant %s',
    (variant) => {
      render(<Spinner variant={variant} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    }
  );

  it.each(['slow', 'normal', 'fast'] as const)('renders with speed %s', (speed) => {
    render(<Spinner speed={speed} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('inner SVG is aria-hidden', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('size %s applies correct size class to svg', (size) => {
    const { container } = render(<Spinner size={size} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass(size);
  });

  it('forwards className to the wrapper span', () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('speed slow applies class slow to svg', () => {
    const { container } = render(<Spinner speed="slow" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('slow');
  });

  it('speed fast applies class fast to svg', () => {
    const { container } = render(<Spinner speed="fast" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('fast');
  });

  it('does not apply speed class when speed prop is omitted', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg')!;
    expect(svg).not.toHaveClass('slow');
    expect(svg).not.toHaveClass('normal');
    expect(svg).not.toHaveClass('fast');
  });
});
