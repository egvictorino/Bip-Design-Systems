import { render, screen } from '@testing-library/react';
import { Timeline, TimelineItem } from './Timeline';

describe('Timeline', () => {
  it('renders children', () => {
    render(
      <Timeline>
        <TimelineItem title="Primera consulta" />
        <TimelineItem title="Seguimiento" />
      </Timeline>
    );
    expect(screen.getByText('Primera consulta')).toBeInTheDocument();
    expect(screen.getByText('Seguimiento')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Timeline className="custom-class">
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('TimelineItem', () => {
  it('renders title', () => {
    render(<TimelineItem title="Consulta inicial" />);
    expect(screen.getByText('Consulta inicial')).toBeInTheDocument();
  });

  it('renders date when provided', () => {
    render(<TimelineItem title="Consulta" date="10/03/2024" />);
    expect(screen.getByText('10/03/2024')).toBeInTheDocument();
  });

  it('does not render date element when not provided', () => {
    render(<TimelineItem title="Consulta" />);
    expect(screen.queryByRole('time')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<TimelineItem title="Consulta" description="Evaluación inicial" />);
    expect(screen.getByText('Evaluación inicial')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<TimelineItem title="Pago" icon={<span data-testid="icon">💳</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <TimelineItem title="Consulta">
        <p>Contenido adicional</p>
      </TimelineItem>
    );
    expect(screen.getByText('Contenido adicional')).toBeInTheDocument();
  });

  it('applies default variant dot', () => {
    const { container } = render(<TimelineItem title="Item" variant="default" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('bg-primary');
  });

  it('applies success variant dot', () => {
    const { container } = render(<TimelineItem title="Item" variant="success" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('bg-success');
  });

  it('applies error variant dot', () => {
    const { container } = render(<TimelineItem title="Item" variant="error" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('bg-danger');
  });

  it('applies warning variant dot', () => {
    const { container } = render(<TimelineItem title="Item" variant="warning" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('bg-warning');
  });

  it('hides last timeline line', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Primero" />
        <TimelineItem title="Último" />
      </Timeline>
    );
    const lines = container.querySelectorAll('.timeline-line');
    expect(lines).toHaveLength(2);
  });
});
