import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children inside a div by default', () => {
    render(<Container>content</Container>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders as a different element via the `as` prop', () => {
    const { container } = render(<Container as="main">content</Container>);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('defaults to lg max-width', () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstChild).toHaveClass('maxWidthLg');
  });

  it('applies the max-width class matching the prop', () => {
    const { container } = render(<Container maxWidth="sm">content</Container>);
    expect(container.firstChild).toHaveClass('maxWidthSm');
  });

  it('forwards className and other HTML attributes', () => {
    render(
      <Container className="custom" data-testid="container" aria-label="page">
        content
      </Container>
    );
    const el = screen.getByTestId('container');
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('aria-label', 'page');
  });
});
