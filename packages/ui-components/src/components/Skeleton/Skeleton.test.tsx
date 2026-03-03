import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('has aria-hidden="true" (decorative element)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a single element by default (variant="text", lines=1)', () => {
    const { container } = render(<Skeleton variant="text" lines={1} />);
    // Single line: renders a plain div with no children
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('renders multiple line divs when variant="text" and lines > 1', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper.children).toHaveLength(3);
  });

  it('last line is narrower (w-3/4) in multi-line text mode', () => {
    const { container } = render(<Skeleton variant="text" lines={2} />);
    const lines = (container.firstChild as HTMLElement).children;
    expect(lines[1]).toHaveClass('w-3/4');
    expect(lines[0]).toHaveClass('w-full');
  });

  it.each(['text', 'circle', 'rect'] as const)('renders variant %s', (variant) => {
    const { container } = render(<Skeleton variant={variant} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts a custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
