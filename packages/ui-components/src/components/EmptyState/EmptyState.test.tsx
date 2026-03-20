import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the title', () => {
    render(<EmptyState title="Sin resultados" />);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Sin datos" description="Agrega elementos para comenzar." />);
    expect(screen.getByText('Agrega elementos para comenzar.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="Sin datos" />);
    expect(screen.queryByText(/Agrega/)).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState title="Sin datos" action={<button>Agregar</button>} />);
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('does not render action when omitted', () => {
    render(<EmptyState title="Sin datos" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(
      <EmptyState
        title="Sin datos"
        icon={<svg data-testid="custom-icon" />}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when no icon is provided', () => {
    const { container } = render(<EmptyState title="Sin datos" />);
    // The default icon is an SVG inside the icon wrapper
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('applies sm size classes', () => {
    const { container } = render(<EmptyState title="Sin datos" size="sm" />);
    expect(container.firstChild).toHaveClass('py-8');
  });

  it('applies md size classes (default)', () => {
    const { container } = render(<EmptyState title="Sin datos" />);
    expect(container.firstChild).toHaveClass('py-12');
  });

  it('applies lg size classes', () => {
    const { container } = render(<EmptyState title="Sin datos" size="lg" />);
    expect(container.firstChild).toHaveClass('py-16');
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  it('renders as a centered flex column', () => {
    const { container } = render(<EmptyState title="Sin datos" />);
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'items-center', 'text-center');
  });

  // ── Customization ─────────────────────────────────────────────────────────

  it('merges custom className', () => {
    const { container } = render(<EmptyState title="Sin datos" className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('forwards HTML attributes to root div', () => {
    render(<EmptyState title="Sin datos" data-testid="empty-state" />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('forwards id attribute', () => {
    const { container } = render(<EmptyState title="Sin datos" id="my-empty" />);
    expect(container.firstChild).toHaveAttribute('id', 'my-empty');
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('icon wrapper is aria-hidden', () => {
    const { container } = render(<EmptyState title="Sin datos" />);
    const iconWrapper = container.querySelector('[aria-hidden="true"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('title and description are both visible text', () => {
    render(
      <EmptyState
        title="Sin clientes"
        description="Agrega tu primer cliente para empezar."
      />
    );
    expect(screen.getByText('Sin clientes')).toBeVisible();
    expect(screen.getByText('Agrega tu primer cliente para empezar.')).toBeVisible();
  });

  // ── displayName ───────────────────────────────────────────────────────────

  it('has correct displayName', () => {
    expect(EmptyState.displayName).toBe('EmptyState');
  });
});
