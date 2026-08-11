import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // ── Content ────────────────────────────────────────────────────────────────

  it('renders children text', () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('spreads additional props to the root span', () => {
    render(<Badge data-testid="badge-root">Texto</Badge>);
    expect(screen.getByTestId('badge-root')).toBeInTheDocument();
  });

  // ── Dot indicator ──────────────────────────────────────────────────────────

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge dot>Activo</Badge>);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('does not render dot indicator when dot=false (default)', () => {
    const { container } = render(<Badge>Activo</Badge>);
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('dot indicator is aria-hidden so screen readers skip it', () => {
    const { container } = render(<Badge dot>Activo</Badge>);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Variants ───────────────────────────────────────────────────────────────

  it.each(['primary', 'success', 'warning', 'danger', 'neutral'] as const)(
    'renders variant %s with the correct text color class',
    (variant) => {
      const { container } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(container.firstChild).toHaveClass(variant);
    }
  );

  it('defaults to neutral variant', () => {
    const { container } = render(<Badge>Texto</Badge>);
    expect(container.firstChild).toHaveClass('neutral');
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'size %s applies correct size class',
    (size) => {
      const { container } = render(<Badge size={size}>Texto</Badge>);
      expect(container.firstChild).toHaveClass(size);
    }
  );

  it('defaults to md size', () => {
    const { container } = render(<Badge>Texto</Badge>);
    expect(container.firstChild).toHaveClass('md');
  });

  // ── Dot scales with size ───────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'dot size scales correctly for badge size %s',
    (size) => {
      const { container } = render(
        <Badge size={size} dot>
          Texto
        </Badge>
      );
      const dotClass = `dot${size.charAt(0).toUpperCase() + size.slice(1)}`;
      const dot = container.querySelector('span[aria-hidden="true"]');
      expect(dot).toHaveClass(dotClass);
    }
  );

  // ── Misc ───────────────────────────────────────────────────────────────────

  it('accepts a custom className without losing base classes', () => {
    const { container } = render(<Badge className="custom-class">Texto</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('badge');
  });
});
