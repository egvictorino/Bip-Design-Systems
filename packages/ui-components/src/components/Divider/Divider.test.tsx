import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    render(<Divider />);
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label when provided', () => {
    render(<Divider label="O continúa con" />);
    expect(screen.getByText('O continúa con')).toBeInTheDocument();
  });

  it('applies dashed class for dashed variant', () => {
    render(<Divider variant="dashed" />);
    expect(screen.getByRole('separator')).toHaveClass('border-dashed');
  });

  it('applies custom className', () => {
    render(<Divider className="my-4" />);
    expect(screen.getByRole('separator')).toHaveClass('my-4');
  });

  it('renders as hr for horizontal without label', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders as div for horizontal with label', () => {
    const { container } = render(<Divider label="texto" />);
    expect(container.querySelector('hr')).not.toBeInTheDocument();
    expect(container.querySelector('div[role="separator"]')).toBeInTheDocument();
  });
});
