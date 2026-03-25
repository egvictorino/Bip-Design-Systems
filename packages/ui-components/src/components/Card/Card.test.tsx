import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter, CardMedia } from './Card';

describe('Card', () => {
  // ── Root rendering ─────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Card>Contenido de la tarjeta</Card>);
    expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument();
  });

  it('spreads additional props to the root div', () => {
    render(<Card data-testid="my-card">Contenido</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });

  it('accepts role and aria-label for semantic regions', () => {
    render(
      <Card role="region" aria-label="Resumen de pedido">
        Contenido
      </Card>
    );
    expect(screen.getByRole('region', { name: 'Resumen de pedido' })).toBeInTheDocument();
  });

  it('always has card base class', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('card');
  });

  it('accepts a custom className without losing base classes', () => {
    const { container } = render(<Card className="mt-6">Contenido</Card>);
    expect(container.firstChild).toHaveClass('mt-6', 'card');
  });

  // ── Variants ───────────────────────────────────────────────────────────────

  it('defaults to elevated variant', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('elevated');
  });

  it.each(['elevated', 'outlined', 'flat'] as const)('variant %s applies correct class', (variant) => {
    const { container } = render(<Card variant={variant}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(variant);
  });

  // ── Padding ────────────────────────────────────────────────────────────────

  it('defaults to padding none (no padding class)', () => {
    const { container } = render(<Card>Contenido</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass('paddingSm');
    expect(el).not.toHaveClass('paddingMd');
    expect(el).not.toHaveClass('paddingLg');
  });

  it.each([
    ['sm', 'paddingSm'],
    ['md', 'paddingMd'],
    ['lg', 'paddingLg'],
  ] as const)('padding %s applies correct class', (padding, cls) => {
    const { container } = render(<Card padding={padding}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(cls);
  });

  // ── Radius ─────────────────────────────────────────────────────────────────

  it('defaults to radiusLg', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('radiusLg');
  });

  it.each([
    ['none', 'radiusNone'],
    ['sm', 'radiusSm'],
    ['md', 'radiusMd'],
    ['lg', 'radiusLg'],
    ['xl', 'radiusXl'],
  ] as const)('radius %s applies correct class', (radius, cls) => {
    const { container } = render(<Card radius={radius}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(cls);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('does not apply fullWidth by default', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).not.toHaveClass('fullWidth');
  });

  it('fullWidth=true applies fullWidth class', () => {
    const { container } = render(<Card fullWidth>Contenido</Card>);
    expect(container.firstChild).toHaveClass('fullWidth');
  });

  // ── Loading ────────────────────────────────────────────────────────────────

  it('renders children when loading is false (default)', () => {
    render(<Card>Contenido visible</Card>);
    expect(screen.getByText('Contenido visible')).toBeInTheDocument();
  });

  it('loading=true does not render children', () => {
    render(<Card loading>Contenido oculto</Card>);
    expect(screen.queryByText('Contenido oculto')).not.toBeInTheDocument();
  });

  it('loading=true renders element with aria-busy="true"', () => {
    const { container } = render(<Card loading>Contenido</Card>);
    const busyEl = container.querySelector('[aria-busy="true"]');
    expect(busyEl).toBeInTheDocument();
  });

  it('loading=true renders skeleton aria-label', () => {
    render(<Card loading>Contenido</Card>);
    expect(screen.getByLabelText('Cargando...')).toBeInTheDocument();
  });

  // ── Clickable ──────────────────────────────────────────────────────────────

  it('clickable=true adds tabIndex=0', () => {
    const { container } = render(<Card clickable>Contenido</Card>);
    expect(container.firstChild).toHaveAttribute('tabindex', '0');
  });

  it('clickable=true adds clickable class', () => {
    const { container } = render(<Card clickable>Contenido</Card>);
    expect(container.firstChild).toHaveClass('clickable');
  });

  it('clickable=true adds role="button" when no role provided', () => {
    const { container } = render(<Card clickable>Contenido</Card>);
    expect(container.firstChild).toHaveAttribute('role', 'button');
  });

  it('clickable=true does NOT override explicit role prop', () => {
    const { container } = render(
      <Card clickable role="region">
        Contenido
      </Card>
    );
    expect(container.firstChild).toHaveAttribute('role', 'region');
  });

  it('clickable=true fires onClick on Enter keydown', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Card clickable onClick={onClick}>
        Contenido
      </Card>
    );
    fireEvent.keyDown(container.firstChild as HTMLElement, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('clickable=true fires onClick on Space keydown', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Card clickable onClick={onClick}>
        Contenido
      </Card>
    );
    fireEvent.keyDown(container.firstChild as HTMLElement, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('non-clickable card does not add tabIndex or role="button"', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).not.toHaveAttribute('tabindex');
    expect(container.firstChild).not.toHaveAttribute('role');
  });

  // ── Sub-components: structure ──────────────────────────────────────────────

  it('renders all sub-components together', () => {
    render(
      <Card>
        <CardHeader>Encabezado</CardHeader>
        <CardBody>Cuerpo</CardBody>
        <CardFooter>Pie</CardFooter>
      </Card>
    );
    expect(screen.getByText('Encabezado')).toBeInTheDocument();
    expect(screen.getByText('Cuerpo')).toBeInTheDocument();
    expect(screen.getByText('Pie')).toBeInTheDocument();
  });

  // ── CardHeader ─────────────────────────────────────────────────────────────

  it('CardHeader has cardHeader class', () => {
    render(
      <Card>
        <CardHeader data-testid="header">Título</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('cardHeader');
  });

  it('CardHeader applies padding via cardHeader class', () => {
    render(
      <Card>
        <CardHeader data-testid="header">Título</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('cardHeader');
  });

  it('CardHeader accepts custom className', () => {
    render(
      <Card>
        <CardHeader className="bg-red-50" data-testid="header">
          Título
        </CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('bg-red-50', 'cardHeader');
  });

  // ── CardBody ───────────────────────────────────────────────────────────────

  it('CardBody applies cardBody class', () => {
    render(
      <Card>
        <CardBody data-testid="body">Contenido</CardBody>
      </Card>
    );
    expect(screen.getByTestId('body')).toHaveClass('cardBody');
  });

  it('CardBody accepts custom className', () => {
    render(
      <Card>
        <CardBody className="text-sm" data-testid="body">
          Contenido
        </CardBody>
      </Card>
    );
    expect(screen.getByTestId('body')).toHaveClass('text-sm', 'cardBody');
  });

  // ── CardFooter ─────────────────────────────────────────────────────────────

  it('CardFooter has cardFooter class', () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('cardFooter');
  });

  it('CardFooter applies padding via cardFooter class', () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('cardFooter');
  });

  it('CardFooter accepts custom className', () => {
    render(
      <Card>
        <CardFooter className="justify-end flex" data-testid="footer">
          Acciones
        </CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('justify-end', 'cardFooter');
  });

  // ── CardMedia ──────────────────────────────────────────────────────────────

  it('CardMedia renders img with correct alt', () => {
    render(<CardMedia src="https://example.com/img.jpg" alt="Foto de producto" />);
    expect(screen.getByAltText('Foto de producto')).toBeInTheDocument();
  });

  it('CardMedia applies aspectVideo class by default', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" />
    );
    expect(container.firstChild).toHaveClass('aspectVideo');
  });

  it.each([
    ['video', 'aspectVideo'],
    ['square', 'aspectSquare'],
  ] as const)('CardMedia aspectRatio %s applies correct class', (ratio, cls) => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" aspectRatio={ratio} />
    );
    expect(container.firstChild).toHaveClass(cls);
  });

  it('CardMedia wide applies aspectWide class', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" aspectRatio="wide" />
    );
    expect(container.firstChild).toHaveClass('aspectWide');
  });

  it('CardMedia accepts custom className', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" className="my-custom" />
    );
    expect(container.firstChild).toHaveClass('my-custom');
  });
});
