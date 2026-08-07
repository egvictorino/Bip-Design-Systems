import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders children inside a p by default', () => {
    const { container } = render(<Text>content</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders as a different element via the `as` prop', () => {
    const { container } = render(<Text as="span">content</Text>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('defaults to base size, normal weight, default color', () => {
    const { container } = render(<Text>content</Text>);
    expect(container.firstChild).toHaveClass('sizeBase');
    expect(container.firstChild).toHaveClass('weightNormal');
    expect(container.firstChild).toHaveClass('colorDefault');
  });

  it('applies size, weight and color classes matching props', () => {
    const { container } = render(
      <Text size="lg" weight="bold" color="danger">
        content
      </Text>
    );
    expect(container.firstChild).toHaveClass('sizeLg');
    expect(container.firstChild).toHaveClass('weightBold');
    expect(container.firstChild).toHaveClass('colorDanger');
  });

  it('applies the align class when provided', () => {
    const { container } = render(<Text align="center">content</Text>);
    expect(container.firstChild).toHaveClass('alignCenter');
  });

  it('applies the truncate class when truncate is true', () => {
    const { container } = render(<Text truncate>content</Text>);
    expect(container.firstChild).toHaveClass('truncate');
  });

  it('forwards className and other HTML attributes', () => {
    render(
      <Text className="custom" data-testid="text" aria-label="label">
        content
      </Text>
    );
    const el = screen.getByTestId('text');
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('aria-label', 'label');
  });
});
