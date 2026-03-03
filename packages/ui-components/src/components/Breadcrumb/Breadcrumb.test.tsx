import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Detalle del producto' },
];

describe('Breadcrumb', () => {
  // ── Structure & ARIA ────────────────────────────────────────────────────────

  it('renders nav with aria-label="Breadcrumb"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('allows overriding aria-label via props', () => {
    render(<Breadcrumb items={items} aria-label="Migas de pan" />);
    expect(screen.getByRole('navigation', { name: 'Migas de pan' })).toBeInTheDocument();
  });

  it('spreads additional props to the nav element', () => {
    render(<Breadcrumb items={items} data-testid="bc-nav" />);
    expect(screen.getByTestId('bc-nav')).toBeInTheDocument();
  });

  it('renders an ordered list of items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length);
  });

  it('renders an empty list without errors when items is empty', () => {
    render(<Breadcrumb items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // ── Current page item ───────────────────────────────────────────────────────

  it('last item has aria-current="page"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Detalle del producto')).toHaveAttribute('aria-current', 'page');
  });

  it('last item is a span (not a link)', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.queryByRole('link', { name: 'Detalle del producto' })).not.toBeInTheDocument();
    expect(screen.getByText('Detalle del producto').tagName).toBe('SPAN');
  });

  it('last item has truncate class for long labels', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Detalle del producto')).toHaveClass('truncate');
  });

  // ── Ancestor items with href ────────────────────────────────────────────────

  it('non-last items with href are rendered as links', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', '/productos');
  });

  it('non-last items with href have truncate class for long labels', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveClass('truncate');
  });

  it('non-last items do not have aria-current', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current');
  });

  // ── Ancestor items without href ─────────────────────────────────────────────

  it('non-last item without href renders as a non-interactive span (not a link)', () => {
    render(
      <Breadcrumb items={[{ label: 'Sin enlace' }, { label: 'Actual' }]} />
    );
    expect(screen.queryByRole('link', { name: 'Sin enlace' })).not.toBeInTheDocument();
    expect(screen.getByText('Sin enlace').tagName).toBe('SPAN');
  });

  it('non-last item without href does not have aria-current', () => {
    render(
      <Breadcrumb items={[{ label: 'Sin enlace' }, { label: 'Actual' }]} />
    );
    expect(screen.getByText('Sin enlace')).not.toHaveAttribute('aria-current');
  });

  // ── Single item ─────────────────────────────────────────────────────────────

  it('renders a single item without separator or link', () => {
    render(<Breadcrumb items={[{ label: 'Inicio' }]} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  // ── Separator ───────────────────────────────────────────────────────────────

  it('renders a custom separator between items', () => {
    render(
      <Breadcrumb items={items} separator={<span data-testid="sep">/</span>} />
    );
    // 3 items → 2 separators
    expect(screen.getAllByTestId('sep')).toHaveLength(2);
  });

  it('renders the default chevron separator when none is provided', () => {
    const { container } = render(<Breadcrumb items={items} />);
    // Default chevron renders as SVG with aria-hidden
    const separators = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(separators).toHaveLength(2); // 3 items → 2 separators
  });
});
