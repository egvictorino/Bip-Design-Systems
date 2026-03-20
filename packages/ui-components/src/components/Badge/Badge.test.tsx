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

  it.each(['primary', 'success', 'warning', 'error', 'neutral'] as const)(
    'renders variant %s with the correct text color class',
    (variant) => {
      const classMap = {
        primary: 'text-primary',
        success: 'text-success-text',
        warning: 'text-warning-text',
        error: 'text-danger-text',
        neutral: 'text-txt-secondary',
      };
      const { container } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(container.firstChild).toHaveClass(classMap[variant]);
    }
  );

  it('defaults to neutral variant', () => {
    const { container } = render(<Badge>Texto</Badge>);
    expect(container.firstChild).toHaveClass('text-txt-secondary');
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'text-xs', 'px-1.5', 'py-0.5'],
    ['md', 'text-xs', 'px-2.5', 'py-1'],
    ['lg', 'text-sm', 'px-3', 'py-1.5'],
  ] as const)('size %s applies correct text and padding classes', (size, textClass, px, py) => {
    const { container } = render(<Badge size={size}>Texto</Badge>);
    expect(container.firstChild).toHaveClass(textClass, px, py);
  });

  it('defaults to md size', () => {
    const { container } = render(<Badge>Texto</Badge>);
    expect(container.firstChild).toHaveClass('px-2.5', 'py-1', 'text-xs');
  });

  // ── Dot scales with size ───────────────────────────────────────────────────

  it.each([
    ['sm', 'w-1.5', 'h-1.5'],
    ['md', 'w-2', 'h-2'],
    ['lg', 'w-2.5', 'h-2.5'],
  ] as const)('dot size scales correctly for badge size %s', (size, w, h) => {
    const { container } = render(
      <Badge size={size} dot>
        Texto
      </Badge>
    );
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toHaveClass(w, h);
  });

  // ── Misc ───────────────────────────────────────────────────────────────────

  it('accepts a custom className without losing base classes', () => {
    const { container } = render(<Badge className="custom-class">Texto</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('rounded-full', 'font-medium');
  });
});
