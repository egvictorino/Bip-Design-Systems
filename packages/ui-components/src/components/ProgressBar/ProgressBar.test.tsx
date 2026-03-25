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

  it.each(['default', 'success', 'warning', 'error'] as const)(
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
});
