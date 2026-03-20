import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

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

  it('always has rounded-lg and overflow-hidden base classes', () => {
    const { container } = render(<Card>Contenido</Card>);
    expect(container.firstChild).toHaveClass('rounded-lg', 'overflow-hidden');
  });

  it('accepts a custom className without losing base classes', () => {
    const { container } = render(<Card className="mt-6">Contenido</Card>);
    expect(container.firstChild).toHaveClass('mt-6', 'rounded-lg');
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
    // p-3, p-5, p-7 should NOT be present
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
        <CardHeader className="bg-red-50" data-testid="header">Título</CardHeader>
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
        <CardBody className="text-sm" data-testid="body">Contenido</CardBody>
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
        <CardFooter className="justify-end flex" data-testid="footer">Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByTestId('footer')).toHaveClass('justify-end', 'border-t');
  });
});
