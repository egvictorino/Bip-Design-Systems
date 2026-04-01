import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // ─── Tests existentes ──────────────────────────────────────────────────────

  it('has aria-hidden="true" (decorative element)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a single element by default (variant="text", lines=1)', () => {
    const { container } = render(<Skeleton variant="text" lines={1} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('renders multiple line divs when variant="text" and lines > 1', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.children).toHaveLength(3);
  });

  it('last line is narrower in multi-line text mode', () => {
    const { container } = render(<Skeleton variant="text" lines={2} />);
    const lines = (container.firstChild as HTMLElement).children;
    expect(lines[1]).toHaveClass('lineShort');
    expect(lines[0]).toHaveClass('lineFull');
  });

  it.each(['text', 'circle', 'rect'] as const)('renders variant %s', (variant) => {
    const { container } = render(<Skeleton variant={variant} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts a custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('circle variant has circle class', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass('circle');
  });

  it('rect variant has rect class', () => {
    const { container } = render(<Skeleton variant="rect" />);
    expect(container.firstChild).toHaveClass('rect');
  });

  it('has base class (loading animation)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('base');
  });

  // ─── Prop: size ────────────────────────────────────────────────────────────

  it('defaults to size="md"', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('md');
  });

  it('size="sm" applies sm class', () => {
    const { container } = render(<Skeleton size="sm" />);
    expect(container.firstChild).toHaveClass('sm');
  });

  it('size="lg" applies lg class', () => {
    const { container } = render(<Skeleton size="lg" />);
    expect(container.firstChild).toHaveClass('lg');
  });

  it('in multiline mode, child lines receive the size class', () => {
    const { container } = render(<Skeleton variant="text" lines={2} size="lg" />);
    const lines = (container.firstChild as HTMLElement).children;
    expect(lines[0]).toHaveClass('lg');
    expect(lines[1]).toHaveClass('lg');
  });

  // ─── Prop: animation ───────────────────────────────────────────────────────

  it('defaults to animation="pulse"', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('pulse');
  });

  it('animation="wave" applies wave class', () => {
    const { container } = render(<Skeleton animation="wave" />);
    expect(container.firstChild).toHaveClass('wave');
  });

  it('animation="none" applies none class', () => {
    const { container } = render(<Skeleton animation="none" />);
    expect(container.firstChild).toHaveClass('none');
  });

  it('in multiline mode, child lines receive the animation class', () => {
    const { container } = render(<Skeleton variant="text" lines={2} animation="wave" />);
    const lines = (container.firstChild as HTMLElement).children;
    expect(lines[0]).toHaveClass('wave');
    expect(lines[1]).toHaveClass('wave');
  });

  // ─── Props: width y height ─────────────────────────────────────────────────

  it('width prop sets inline style on root element', () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(container.firstChild).toHaveStyle({ width: '200px' });
  });

  it('height prop sets inline style on root element', () => {
    const { container } = render(<Skeleton height="50px" />);
    expect(container.firstChild).toHaveStyle({ height: '50px' });
  });

  it('width and height together set both inline styles', () => {
    const { container } = render(<Skeleton width="100px" height="100px" />);
    expect(container.firstChild).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('user-provided style prop is not lost when width is set', () => {
    const { container } = render(<Skeleton width="200px" style={{ opacity: 0.5 }} />);
    expect(container.firstChild).toHaveStyle({ width: '200px', opacity: '0.5' });
  });

  it('renders without a style attribute when no width, height, or style is provided', () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).getAttribute('style')).toBeNull();
  });

  it('in multiline mode, width prop applies to the wrapper div', () => {
    const { container } = render(<Skeleton variant="text" lines={2} width="300px" />);
    expect(container.firstChild).toHaveStyle({ width: '300px' });
    const lines = (container.firstChild as HTMLElement).children;
    expect(lines[0]).not.toHaveStyle({ width: '300px' });
  });

  // ─── HTML nativas / spread ─────────────────────────────────────────────────

  it('passes data-testid to the root element', () => {
    const { getByTestId } = render(<Skeleton data-testid="skeleton-root" />);
    expect(getByTestId('skeleton-root')).toBeInTheDocument();
  });

  it('passes data-testid to the wrapper in multiline mode', () => {
    const { getByTestId } = render(
      <Skeleton variant="text" lines={2} data-testid="skeleton-multi" />
    );
    expect(getByTestId('skeleton-multi')).toBeInTheDocument();
  });

  it('passes id prop to the root element', () => {
    const { container } = render(<Skeleton id="my-skeleton" />);
    expect(container.firstChild).toHaveAttribute('id', 'my-skeleton');
  });

  // ─── Bug fix: className en multiline ──────────────────────────────────────

  it('in multiline mode, className applies to the wrapper, not to child lines', () => {
    const { container } = render(<Skeleton variant="text" lines={2} className="custom-wrapper" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-wrapper');
    const lines = wrapper.children;
    expect(lines[0]).not.toHaveClass('custom-wrapper');
    expect(lines[1]).not.toHaveClass('custom-wrapper');
  });
});
