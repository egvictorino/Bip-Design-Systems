import { render, screen } from '@testing-library/react';
import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Citas hoy" value={12} />);
    expect(screen.getByText('Citas hoy')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatsCard title="Ingresos" value="$48,200" />);
    expect(screen.getByText('$48,200')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<StatsCard title="Citas" value={5} description="vs. ayer" />);
    expect(screen.getByText('vs. ayer')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<StatsCard title="Citas" value={5} />);
    expect(screen.queryByText('vs. ayer')).not.toBeInTheDocument();
  });

  it('renders positive trend with + sign', () => {
    render(<StatsCard title="Citas" value={10} trend={8} />);
    const trendEl = screen.getByLabelText('Tendencia: +8%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('text-success');
  });

  it('renders negative trend', () => {
    render(<StatsCard title="Citas" value={10} trend={-5} />);
    const trendEl = screen.getByLabelText('Tendencia: -5%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('text-danger');
  });

  it('renders zero trend with neutral color', () => {
    render(<StatsCard title="Citas" value={10} trend={0} />);
    const trendEl = screen.getByLabelText('Tendencia: 0%');
    expect(trendEl).toHaveClass('text-txt-secondary');
  });

  it('does not render trend when not provided', () => {
    render(<StatsCard title="Citas" value={10} />);
    expect(screen.queryByLabelText(/Tendencia/)).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <StatsCard title="Citas" value={10} icon={<span data-testid="icon">📅</span>} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<StatsCard title="X" value={0} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
