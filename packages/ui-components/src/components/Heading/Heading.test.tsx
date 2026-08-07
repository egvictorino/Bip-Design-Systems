import { render, screen } from '@testing-library/react';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the semantic element matching level', () => {
    const { container } = render(<Heading level={3}>Title</Heading>);
    expect(container.querySelector('h3')).toBeInTheDocument();
  });

  it('renders h1 through h6 for each level', () => {
    ([1, 2, 3, 4, 5, 6] as const).forEach((level) => {
      const { container, unmount } = render(<Heading level={level}>Title</Heading>);
      expect(container.querySelector(`h${level}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('applies a default size derived from level', () => {
    const { container } = render(<Heading level={1}>Title</Heading>);
    expect(container.firstChild).toHaveClass('size2xl');
  });

  it('allows overriding size independently of level', () => {
    const { container } = render(
      <Heading level={1} size="xs">
        Title
      </Heading>
    );
    expect(container.querySelector('h1')).toHaveClass('sizeXs');
  });

  it('defaults to semibold weight', () => {
    const { container } = render(<Heading level={2}>Title</Heading>);
    expect(container.firstChild).toHaveClass('weightSemibold');
  });

  it('applies bold weight when specified', () => {
    const { container } = render(
      <Heading level={2} weight="bold">
        Title
      </Heading>
    );
    expect(container.firstChild).toHaveClass('weightBold');
  });

  it('renders as a non-heading element with `as` while preserving the accessible level', () => {
    render(
      <Heading level={2} as="div">
        Title
      </Heading>
    );
    const el = screen.getByRole('heading', { level: 2 });
    expect(el.tagName).toBe('DIV');
  });

  it('forwards className and other HTML attributes', () => {
    render(
      <Heading level={2} className="custom" data-testid="heading">
        Title
      </Heading>
    );
    expect(screen.getByTestId('heading')).toHaveClass('custom');
  });
});
