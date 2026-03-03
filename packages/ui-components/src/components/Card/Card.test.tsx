import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Contenido de la tarjeta</Card>);
    expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument();
  });

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

  it('CardHeader renders children', () => {
    render(
      <Card>
        <CardHeader>Título de la tarjeta</CardHeader>
      </Card>
    );
    expect(screen.getByText('Título de la tarjeta')).toBeInTheDocument();
  });

  it('CardBody renders children', () => {
    render(
      <Card>
        <CardBody>Texto del cuerpo</CardBody>
      </Card>
    );
    expect(screen.getByText('Texto del cuerpo')).toBeInTheDocument();
  });

  it('CardFooter renders children', () => {
    render(
      <Card>
        <CardFooter>Acciones</CardFooter>
      </Card>
    );
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it.each(['elevated', 'outlined', 'flat'] as const)('renders variant %s', (variant) => {
    render(<Card variant={variant}>Contenido</Card>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it.each(['none', 'sm', 'md', 'lg'] as const)('renders padding %s', (padding) => {
    render(<Card padding={padding}>Contenido</Card>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('accepts a custom className', () => {
    const { container } = render(<Card className="custom-card">Contenido</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});
