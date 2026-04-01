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

  it('has role="list"', () => {
    render(
      <Timeline>
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('applies aria-label when provided', () => {
    render(
      <Timeline aria-label="Historial clínico">
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(screen.getByRole('list', { name: 'Historial clínico' })).toBeInTheDocument();
  });

  it('does not set aria-label when not provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Item" />
      </Timeline>
    );
    const list = screen.getByRole('list');
    expect(list).not.toHaveAttribute('aria-label');
  });

  it('applies timelineHorizontal class with orientation="horizontal"', () => {
    const { container } = render(
      <Timeline orientation="horizontal">
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(container.firstChild).toHaveClass('timelineHorizontal');
  });

  it('does not apply timelineHorizontal class by default', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(container.firstChild).not.toHaveClass('timelineHorizontal');
  });
});

describe('TimelineItem', () => {
  it('renders title', () => {
    render(
      <Timeline>
        <TimelineItem title="Consulta inicial" />
      </Timeline>
    );
    expect(screen.getByText('Consulta inicial')).toBeInTheDocument();
  });

  it('renders date when provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Consulta" date="10/03/2024" />
      </Timeline>
    );
    expect(screen.getByText('10/03/2024')).toBeInTheDocument();
  });

  it('does not render date element when not provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Consulta" />
      </Timeline>
    );
    expect(screen.queryByRole('time')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Consulta" description="Evaluación inicial" />
      </Timeline>
    );
    expect(screen.getByText('Evaluación inicial')).toBeInTheDocument();
  });

  it('does not render description element when not provided', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Consulta" />
      </Timeline>
    );
    expect(container.querySelector('.descriptionText')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <Timeline>
        <TimelineItem title="Pago" icon={<span data-testid="icon">💳</span>} />
      </Timeline>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Timeline>
        <TimelineItem title="Consulta">
          <p>Contenido adicional</p>
        </TimelineItem>
      </Timeline>
    );
    expect(screen.getByText('Contenido adicional')).toBeInTheDocument();
  });

  it('does not render childrenWrapper when no children', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Consulta" />
      </Timeline>
    );
    expect(container.querySelector('.childrenWrapper')).not.toBeInTheDocument();
  });

  it('has role="listitem"', () => {
    render(
      <Timeline>
        <TimelineItem title="Item" />
      </Timeline>
    );
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('applies default variant dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" variant="default" />
      </Timeline>
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('variantDefault');
  });

  it('applies success variant dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" variant="success" />
      </Timeline>
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('variantSuccess');
  });

  it('applies error variant dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" variant="error" />
      </Timeline>
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('variantError');
  });

  it('applies warning variant dot', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" variant="warning" />
      </Timeline>
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toHaveClass('variantWarning');
  });

  it('applies sizeSm class with size="sm"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" size="sm" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('sizeSm');
  });

  it('applies sizeMd class with size="md"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" size="md" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('sizeMd');
  });

  it('applies sizeLg class with size="lg"', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" size="lg" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('sizeLg');
  });

  it('applies sizeMd class by default', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('sizeMd');
  });

  it('applies itemHorizontal class when orientation is horizontal', () => {
    const { container } = render(
      <Timeline orientation="horizontal">
        <TimelineItem title="Item" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('itemHorizontal');
  });

  it('does not apply itemHorizontal class in vertical orientation', () => {
    const { container } = render(
      <Timeline orientation="vertical">
        <TimelineItem title="Item" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).not.toHaveClass('itemHorizontal');
  });

  it('merges custom className with base classes', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Item" className="my-custom-class" />
      </Timeline>
    );
    const item = container.querySelector('[role="listitem"]');
    expect(item).toHaveClass('item');
    expect(item).toHaveClass('my-custom-class');
  });

  it('throws when used outside Timeline', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TimelineItem title="Standalone" />)).toThrow(
      '<TimelineItem> must be used inside <Timeline>'
    );
    consoleError.mockRestore();
  });

  it('hides last timeline line', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem title="Primero" />
        <TimelineItem title="Último" />
      </Timeline>
    );
    const lines = container.querySelectorAll('.timelineLine');
    expect(lines).toHaveLength(2);
  });
});
