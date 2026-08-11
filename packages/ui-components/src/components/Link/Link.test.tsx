import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with href', () => {
    render(<Link href="/foo">Go</Link>);
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/foo');
  });

  it('sets displayName', () => {
    expect(Link.displayName).toBe('Link');
  });

  it('forwards ref to the anchor element', () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(
      <Link href="/foo" ref={ref}>
        Go
      </Link>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  describe('disabled', () => {
    it('sets aria-disabled and tabIndex=-1', () => {
      render(
        <Link href="/foo" disabled>
          Go
        </Link>
      );
      const link = screen.getByRole('link', { name: 'Go' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1');
    });

    it('does not set aria-disabled when not disabled', () => {
      render(<Link href="/foo">Go</Link>);
      expect(screen.getByRole('link', { name: 'Go' })).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('external', () => {
    it('sets target=_blank and rel=noopener noreferrer', () => {
      render(
        <Link href="https://example.com" external>
          Go
        </Link>
      );
      const link = screen.getByRole('link', { name: /Go/ });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('appends an accessible "opens in new tab" hint', () => {
      render(
        <Link href="https://example.com" external>
          Go
        </Link>
      );
      expect(screen.getByText(/abre en una pestaña nueva/)).toBeInTheDocument();
    });

    it('does not set target/rel when not external', () => {
      render(<Link href="/foo">Go</Link>);
      const link = screen.getByRole('link', { name: 'Go' });
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  it('forwards className and arbitrary anchor attributes', () => {
    render(
      <Link href="/foo" className="extra" data-testid="lnk">
        Go
      </Link>
    );
    const link = screen.getByTestId('lnk');
    expect(link.className).toContain('extra');
  });
});
