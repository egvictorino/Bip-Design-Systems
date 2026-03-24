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

  it('always has overflow-hidden base class', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('overflow-hidden');
  });

  it('accepts a custom className without losing base classes', () => {
    const { container } = render(<Card className="mt-6">Contenido</Card>);
    expect(container.firstChild).toHaveClass('mt-6', 'overflow-hidden');
  });

  // ── Variants ───────────────────────────────────────────────────────────────

  it('defaults to elevated variant', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('shadow-md', 'bg-white');
  });

  it.each([
    ['elevated', 'shadow-md'],
    ['outlined', 'border'],
    ['flat', 'bg-surface-3'],
  ] as const)('variant %s applies correct class', (variant, cls) => {
    const { container } = render(<Card variant={variant}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(cls);
  });

  // ── Padding ────────────────────────────────────────────────────────────────

  it('defaults to padding none (no padding class)', () => {
    const { container } = render(<Card>Contenido</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass('p-3');
    expect(el).not.toHaveClass('p-5');
    expect(el).not.toHaveClass('p-7');
  });

  it.each([
    ['sm', 'p-3'],
    ['md', 'p-5'],
    ['lg', 'p-7'],
  ] as const)('padding %s applies correct class', (padding, cls) => {
    const { container } = render(<Card padding={padding}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(cls);
  });

  // ── Radius ─────────────────────────────────────────────────────────────────

  it('defaults to rounded-lg', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('rounded-lg');
  });

  it.each([
    ['none', 'rounded-none'],
    ['sm', 'rounded-sm'],
    ['md', 'rounded-md'],
    ['lg', 'rounded-lg'],
    ['xl', 'rounded-xl'],
  ] as const)('radius %s applies correct class', (radius, cls) => {
    const { container } = render(<Card radius={radius}>Contenido</Card>);
    expect(container.firstChild).toHaveClass(cls);
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('does not apply w-full by default', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).not.toHaveClass('w-full');
  });

  it('fullWidth=true applies w-full', () => {
    const { container } = render(<Card fullWidth>Contenido</Card>);
    expect(container.firstChild).toHaveClass('w-full');
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

  it('clickable=true adds cursor-pointer class', () => {
    const { container } = render(<Card clickable>Contenido</Card>);
    expect(container.firstChild).toHaveClass('cursor-pointer');
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

  it('CardHeader has bottom border', () => {
    render(
      <Card>
        <CardHeader data-testid="header">Título</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('border-b');
  });

  it('CardHeader applies horizontal and vertical padding', () => {
    render(
      <Card>
        <CardHeader data-testid="header">Título</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('px-5', 'py-4');
  });

  it('CardHeader accepts custom className', () => {
    render(
      <Card>
        <CardHeader className="bg-red-50" data-testid="header">
          Título
        </CardHeader>
      </Card>
    );
    expect(screen.getByTestId('header')).toHaveClass('bg-red-50', 'border-b');
  });

  // ── CardBody ───────────────────────────────────────────────────────────────

  it('CardBody applies p-5 padding', () => {
    render(
      <Card>
        <CardBody data-testid="body">Contenido</CardBody>
      </Card>
    );
    expect(screen.getByTestId('body')).toHaveClass('p-5');
  });

  it('CardBody accepts custom className', () => {
    render(
      <Card>
        <CardBody className="text-sm" data-testid="body">
          Contenido
        </CardBody>
      </Card>
    );
    expect(screen.getByTestId('body')).toHaveClass('text-sm', 'p-5');
  });

  // ── CardFooter ─────────────────────────────────────────────────────────────

  it('CardFooter has top border', () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('border-t');
  });

  it('CardFooter applies horizontal and vertical padding', () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('px-5', 'py-4');
  });

  it('CardFooter accepts custom className', () => {
    render(
      <Card>
        <CardFooter className="justify-end flex" data-testid="footer">
          Acciones
        </CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('justify-end', 'border-t');
  });

  // ── CardMedia ──────────────────────────────────────────────────────────────

  it('CardMedia renders img with correct alt', () => {
    render(<CardMedia src="https://example.com/img.jpg" alt="Foto de producto" />);
    expect(screen.getByAltText('Foto de producto')).toBeInTheDocument();
  });

  it('CardMedia applies aspect-video by default', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" />
    );
    expect(container.firstChild).toHaveClass('aspect-video');
  });

  it.each([
    ['video', 'aspect-video'],
    ['square', 'aspect-square'],
  ] as const)('CardMedia aspectRatio %s applies correct class', (ratio, cls) => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" aspectRatio={ratio} />
    );
    expect(container.firstChild).toHaveClass(cls);
  });

  it('CardMedia wide applies aspect-[21/9] via inline class', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" aspectRatio="wide" />
    );
    // aspect-[21/9] is an arbitrary Tailwind class — check the class is present in the string
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('aspect-[21/9]');
  });

  it('CardMedia accepts custom className', () => {
    const { container } = render(
      <CardMedia src="https://example.com/img.jpg" alt="Imagen" className="my-custom" />
    );
    expect(container.firstChild).toHaveClass('my-custom');
  });
});
