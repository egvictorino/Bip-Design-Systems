import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Detalle del producto' },
];

describe('Breadcrumb', () => {
  it('renders nav with aria-label="Breadcrumb"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('last item has aria-current="page"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Detalle del producto')).toHaveAttribute('aria-current', 'page');
  });

  it('last item is a span (not a link)', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.queryByRole('link', { name: 'Detalle del producto' })).not.toBeInTheDocument();
    expect(screen.getByText('Detalle del producto').tagName).toBe('SPAN');
  });

  it('non-last items are rendered as links with their hrefs', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', '/productos');
  });

  it('renders all item labels', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Detalle del producto')).toBeInTheDocument();
  });

  it('renders a custom separator between items', () => {
    render(
      <Breadcrumb items={items} separator={<span data-testid="sep">/</span>} />
    );
    // 3 items → 2 separators
    expect(screen.getAllByTestId('sep')).toHaveLength(2);
  });

  it('renders a single item without separator', () => {
    render(<Breadcrumb items={[{ label: 'Inicio' }]} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('non-last item without href defaults to href="#"', () => {
    render(<Breadcrumb items={[{ label: 'Sin href' }, { label: 'Actual' }]} />);
    expect(screen.getByRole('link', { name: 'Sin href' })).toHaveAttribute('href', '#');
  });
});
