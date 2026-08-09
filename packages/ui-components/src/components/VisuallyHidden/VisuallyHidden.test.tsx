import { render, screen } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children in the DOM', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText('Hidden text')).toBeInTheDocument();
  });

  it('renders as a span by default', () => {
    render(<VisuallyHidden data-testid="vh">Text</VisuallyHidden>);
    expect(screen.getByTestId('vh').tagName).toBe('SPAN');
  });

  it('forwards className alongside the hidden style', () => {
    render(
      <VisuallyHidden data-testid="vh" className="extra">
        Text
      </VisuallyHidden>
    );
    expect(screen.getByTestId('vh').className).toContain('extra');
  });

  it('forwards arbitrary HTML attributes', () => {
    render(
      <VisuallyHidden data-testid="vh" aria-hidden="false">
        Text
      </VisuallyHidden>
    );
    expect(screen.getByTestId('vh')).toHaveAttribute('aria-hidden', 'false');
  });

  it('sets displayName', () => {
    expect(VisuallyHidden.displayName).toBe('VisuallyHidden');
  });
});
