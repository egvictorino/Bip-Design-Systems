import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children inside a div by default', () => {
    render(
      <Stack>
        <span>one</span>
        <span>two</span>
      </Stack>
    );
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });

  it('renders as a different element via the `as` prop', () => {
    const { container } = render(<Stack as="section">content</Stack>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('defaults to column direction', () => {
    const { container } = render(<Stack>content</Stack>);
    expect(container.firstChild).toHaveClass('column');
  });

  it('applies row direction', () => {
    const { container } = render(<Stack direction="row">content</Stack>);
    expect(container.firstChild).toHaveClass('row');
  });

  it('applies the gap class matching the gap prop', () => {
    const { container } = render(<Stack gap="6">content</Stack>);
    expect(container.firstChild).toHaveClass('gap6');
  });

  it('applies align and justify classes when provided', () => {
    const { container } = render(
      <Stack align="center" justify="between">
        content
      </Stack>
    );
    expect(container.firstChild).toHaveClass('alignCenter');
    expect(container.firstChild).toHaveClass('justifyBetween');
  });

  it('applies the wrap class when wrap is true', () => {
    const { container } = render(<Stack wrap>content</Stack>);
    expect(container.firstChild).toHaveClass('wrap');
  });

  it('forwards className and other HTML attributes', () => {
    render(
      <Stack className="custom" data-testid="stack" aria-label="layout">
        content
      </Stack>
    );
    const el = screen.getByTestId('stack');
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('aria-label', 'layout');
  });
});
