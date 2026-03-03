import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge dot>Activo</Badge>);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it('does not render dot indicator when dot=false (default)', () => {
    const { container } = render(<Badge>Activo</Badge>);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).not.toBeInTheDocument();
  });

  it.each(['primary', 'success', 'warning', 'error', 'neutral'] as const)(
    'renders variant %s',
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  );

  it.each(['sm', 'md', 'lg'] as const)('renders size %s', (size) => {
    render(<Badge size={size}>Texto</Badge>);
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });

  it('accepts a custom className', () => {
    render(<Badge className="custom-class">Texto</Badge>);
    expect(screen.getByText('Texto').closest('span')).toHaveClass('custom-class');
  });
});
