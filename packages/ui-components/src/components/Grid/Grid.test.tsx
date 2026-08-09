import { render, screen } from '@testing-library/react';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children inside a div by default', () => {
    render(
      <Grid>
        <span>one</span>
      </Grid>
    );
    expect(screen.getByText('one')).toBeInTheDocument();
  });

  it('renders as a different element via the `as` prop', () => {
    const { container } = render(<Grid as="section">content</Grid>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('defaults to responsive columns', () => {
    const { container } = render(<Grid>content</Grid>);
    expect(container.firstChild).toHaveClass('colsResponsive');
  });

  it('applies a fixed columns class', () => {
    const { container } = render(<Grid columns={3}>content</Grid>);
    expect(container.firstChild).toHaveClass('cols3');
  });

  it('applies the gap class matching the gap prop', () => {
    const { container } = render(<Grid gap="8">content</Grid>);
    expect(container.firstChild).toHaveClass('gap8');
  });

  it('forwards className and other HTML attributes', () => {
    render(
      <Grid className="custom" data-testid="grid" aria-label="layout">
        content
      </Grid>
    );
    const el = screen.getByTestId('grid');
    expect(el).toHaveClass('custom');
    expect(el).toHaveAttribute('aria-label', 'layout');
  });
});
