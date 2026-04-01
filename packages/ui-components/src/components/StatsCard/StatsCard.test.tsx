import { render, screen } from '@testing-library/react';
import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  // ─── Content ──────────────────────────────────────────────────────────────

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

  // ─── Trend ────────────────────────────────────────────────────────────────

  it('renders positive trend with + sign', () => {
    render(<StatsCard title="Citas" value={10} trend={8} />);
    const trendEl = screen.getByLabelText('Tendencia: +8%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('trendPositive');
  });

  it('renders negative trend', () => {
    render(<StatsCard title="Citas" value={10} trend={-5} />);
    const trendEl = screen.getByLabelText('Tendencia: -5%');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('trendNegative');
  });

  it('renders zero trend with neutral color', () => {
    render(<StatsCard title="Citas" value={10} trend={0} />);
    const trendEl = screen.getByLabelText('Tendencia: 0%');
    expect(trendEl).toHaveClass('trendNeutral');
  });

  it('does not render trend when not provided', () => {
    render(<StatsCard title="Citas" value={10} />);
    expect(screen.queryByLabelText(/Tendencia/)).not.toBeInTheDocument();
  });

  // ─── Variant ──────────────────────────────────────────────────────────────

  it('applies outlined variant class by default', () => {
    const { container } = render(<StatsCard title="X" value={0} />);
    expect(container.firstChild).toHaveClass('outlined');
  });

  it('applies filled variant class', () => {
    const { container } = render(<StatsCard title="X" value={0} variant="filled" />);
    expect(container.firstChild).toHaveClass('filled');
  });

  it('applies elevated variant class', () => {
    const { container } = render(<StatsCard title="X" value={0} variant="elevated" />);
    expect(container.firstChild).toHaveClass('elevated');
  });

  // ─── Size ─────────────────────────────────────────────────────────────────

  it('applies md size class by default', () => {
    const { container } = render(<StatsCard title="X" value={0} />);
    expect(container.firstChild).toHaveClass('md');
  });

  it('applies sm size class', () => {
    const { container } = render(<StatsCard title="X" value={0} size="sm" />);
    expect(container.firstChild).toHaveClass('sm');
  });

  it('applies lg size class', () => {
    const { container } = render(<StatsCard title="X" value={0} size="lg" />);
    expect(container.firstChild).toHaveClass('lg');
  });

  // ─── Loading ──────────────────────────────────────────────────────────────

  it('renders loading state when loading=true', () => {
    render(<StatsCard title="Citas" value={0} loading />);
    expect(screen.getByRole('region', { name: 'Cargando estadística' })).toBeInTheDocument();
  });

  it('hides content when loading', () => {
    render(<StatsCard title="Citas hoy" value={12} loading />);
    expect(screen.queryByText('Citas hoy')).not.toBeInTheDocument();
    expect(screen.queryByText('12')).not.toBeInTheDocument();
  });

  it('marks container as aria-busy when loading', () => {
    render(<StatsCard title="Citas" value={0} loading />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not render description when loading', () => {
    render(<StatsCard title="Citas" value={0} description="vs. ayer" loading />);
    expect(screen.queryByText('vs. ayer')).not.toBeInTheDocument();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  it('has role=region with aria-label from title', () => {
    render(<StatsCard title="Citas hoy" value={12} />);
    expect(screen.getByRole('region', { name: 'Citas hoy' })).toBeInTheDocument();
  });

  it('does not set aria-busy when not loading', () => {
    render(<StatsCard title="Citas" value={0} />);
    expect(screen.getByRole('region')).not.toHaveAttribute('aria-busy');
  });
});
