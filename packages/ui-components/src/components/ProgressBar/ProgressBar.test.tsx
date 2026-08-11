import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  // ── Render ─────────────────────────────────────────────────────────────────

  it('renders without props', () => {
    const { container } = render(<ProgressBar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has role="progressbar"', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // ── ARIA attributes ────────────────────────────────────────────────────────

  it('sets aria-valuenow from value prop', () => {
    render(<ProgressBar value={42} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });

  it('sets aria-valuemin to 0', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0');
  });

  it('sets aria-valuemax to 100', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets aria-label to label prop when provided', () => {
    render(<ProgressBar value={50} label="Cargando" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Cargando');
  });

  it('sets aria-label to "Progreso" by default', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Progreso');
  });

  // ── Value clamping ─────────────────────────────────────────────────────────

  it('clamps value > 100 to 100', () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps value < 0 to 0', () => {
    render(<ProgressBar value={-10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('defaults aria-valuenow to 0 when value is not provided', () => {
    render(<ProgressBar />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  // ── Fill width ─────────────────────────────────────────────────────────────

  it('fill div width equals the clamped value%', () => {
    const { container } = render(<ProgressBar value={75} />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).toHaveStyle({ width: '75%' });
  });

  it('fill width clamps to 100% when value > 100', () => {
    const { container } = render(<ProgressBar value={200} />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  // ── Variants ───────────────────────────────────────────────────────────────

  it.each(['default', 'success', 'warning', 'danger'] as const)(
    'variant %s applies correct fill color class',
    (variant) => {
      const { container } = render(<ProgressBar value={50} variant={variant} />);
      const fill = container.querySelector('[aria-hidden="true"]');
      expect(fill).toHaveClass(variant);
    }
  );

  it('defaults to "default" variant', () => {
    const { container } = render(<ProgressBar value={50} />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).toHaveClass('default');
  });

  // ── Sizes ──────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'size %s applies correct track height class',
    (size) => {
      render(<ProgressBar value={50} size={size} />);
      expect(screen.getByRole('progressbar')).toHaveClass(size);
    }
  );

  it('defaults to "md" size', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toHaveClass('md');
  });

  // ── Label & showValue ──────────────────────────────────────────────────────

  it('renders label text when label prop is provided', () => {
    render(<ProgressBar value={50} label="Cargando" />);
    expect(screen.getByText('Cargando')).toBeInTheDocument();
  });

  it('does not render label area when neither label nor showValue is set', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.querySelector('.mb-1\\.5')).not.toBeInTheDocument();
  });

  it('shows percentage when showValue=true', () => {
    render(<ProgressBar value={65} showValue />);
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('does not show percentage when showValue is false (default)', () => {
    render(<ProgressBar value={65} />);
    expect(screen.queryByText('65%')).not.toBeInTheDocument();
  });

  it('shows clamped percentage when value > 100 and showValue=true', () => {
    render(<ProgressBar value={150} showValue />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  // ── Indeterminate ──────────────────────────────────────────────────────────

  it('indeterminate removes aria-valuenow', () => {
    render(<ProgressBar indeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('indeterminate sets aria-busy="true"', () => {
    render(<ProgressBar indeterminate />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy', 'true');
  });

  it('non-indeterminate does not have aria-busy attribute', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-busy');
  });

  it('indeterminate does not show percentage even when showValue=true', () => {
    render(<ProgressBar indeterminate showValue />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  // ── Props passthrough ──────────────────────────────────────────────────────

  it('applies id to the progressbar element', () => {
    render(<ProgressBar value={50} id="my-progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('id', 'my-progress');
  });

  it('applies className to the outer wrapper', () => {
    const { container } = render(<ProgressBar value={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('outer wrapper always has wrapper class', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toHaveClass('wrapper');
  });

  // ── Props spread ───────────────────────────────────────────────────────────

  it('spreads additional HTML attributes to the outer wrapper', () => {
    render(<ProgressBar value={50} data-testid="pb-wrapper" />);
    expect(screen.getByTestId('pb-wrapper')).toBeInTheDocument();
  });

  it('spread attributes do not end up on the progressbar element', () => {
    render(<ProgressBar value={50} data-testid="pb-wrapper" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-testid');
  });

  // ── aria-valuetext ─────────────────────────────────────────────────────────

  it('sets aria-valuetext when valueText is provided and not indeterminate', () => {
    render(<ProgressBar value={75} valueText="75 de 100 archivos" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '75 de 100 archivos'
    );
  });

  it('does not set aria-valuetext when not provided', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuetext');
  });

  it('does not set aria-valuetext when indeterminate even if valueText is provided', () => {
    render(<ProgressBar indeterminate valueText="Cargando datos..." />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuetext');
  });

  // ── helperText ─────────────────────────────────────────────────────────────

  it('renders helperText when provided', () => {
    render(<ProgressBar value={40} helperText="2 de 5 archivos procesados" />);
    expect(screen.getByText('2 de 5 archivos procesados')).toBeInTheDocument();
  });

  it('does not render helperText span when not provided', () => {
    const { container } = render(<ProgressBar value={40} />);
    expect(container.querySelector('.helperText')).not.toBeInTheDocument();
  });

  it('helperText span has id and progressbar has aria-describedby when id is provided', () => {
    render(<ProgressBar value={40} id="pb-test" helperText="Descripción" />);
    const pb = screen.getByRole('progressbar');
    const helper = screen.getByText('Descripción');
    expect(helper).toHaveAttribute('id', 'pb-test-description');
    expect(pb).toHaveAttribute('aria-describedby', 'pb-test-description');
  });

  it('helperText span has no id and progressbar has no aria-describedby when id is absent', () => {
    render(<ProgressBar value={40} helperText="Descripción sin id" />);
    const pb = screen.getByRole('progressbar');
    expect(pb).not.toHaveAttribute('aria-describedby');
    const helper = screen.getByText('Descripción sin id');
    expect(helper).not.toHaveAttribute('id');
  });

  // ── Striped / Animated ─────────────────────────────────────────────────────

  it('fill has striped class when striped=true', () => {
    const { container } = render(<ProgressBar value={50} striped />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).toHaveClass('striped');
  });

  it('fill does not have striped class when striped is not set', () => {
    const { container } = render(<ProgressBar value={50} />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).not.toHaveClass('striped');
  });

  it('fill has animated class when striped=true and animated=true', () => {
    const { container } = render(<ProgressBar value={50} striped animated />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).toHaveClass('animated');
  });

  it('fill does not have animated class when striped=false even if animated=true', () => {
    const { container } = render(<ProgressBar value={50} animated />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).not.toHaveClass('animated');
  });

  it('indeterminate bar does not receive striped class', () => {
    const { container } = render(<ProgressBar indeterminate striped />);
    const fill = container.querySelector('[aria-hidden="true"]');
    expect(fill).not.toHaveClass('striped');
  });

  // ── Record maps — regresión de variantes ───────────────────────────────────

  it.each(['default', 'success', 'warning', 'danger'] as const)(
    'variant %s fill class resolves via Record map',
    (variant) => {
      const { container } = render(<ProgressBar value={50} variant={variant} />);
      const fill = container.querySelector('[aria-hidden="true"]');
      expect(fill).toHaveClass(variant);
    }
  );
});
