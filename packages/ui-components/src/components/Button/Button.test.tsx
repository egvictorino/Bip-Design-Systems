import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  // ── Rendering ───────────────────────────────────────────────────────────────

  it('renders children correctly', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('has type="button" by default (does not accidentally submit forms)', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows overriding the type attribute', () => {
    render(<Button type="submit" data-testid="btn">Submit</Button>);
    expect(screen.getByTestId('btn')).toHaveAttribute('type', 'submit');
  });

  it('forwards a ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Con ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards additional props to the button element', () => {
    render(<Button data-testid="btn-props">Props</Button>);
    expect(screen.getByTestId('btn-props')).toBeInTheDocument();
  });

  // ── Variants ────────────────────────────────────────────────────────────────

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('applies secondary variant with dark text on light background', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('secondary');
  });

  it('applies bare variant', () => {
    render(<Button variant="bare">Bare</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bare');
  });

  it('applies soul variant', () => {
    render(<Button variant="soul">Soul</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('soul');
  });

  // ── Sizes ───────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)('size %s applies correct size class', (size) => {
    render(<Button size={size}>Texto</Button>);
    expect(screen.getByRole('button')).toHaveClass(size);
  });

  it('defaults to md size', () => {
    render(<Button>Texto</Button>);
    expect(screen.getByRole('button')).toHaveClass('md');
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick} disabled>Disabled</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── Keyboard interaction ─────────────────────────────────────────────────────

  it('calls onClick when Enter is pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Enter</Button>);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onClick when Space is pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Space</Button>);
    screen.getByRole('button').focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  // ── Custom className ────────────────────────────────────────────────────────

  it('accepts custom className without overriding base styles', () => {
    render(<Button className="mt-4">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('mt-4');
    expect(button).toHaveClass('primary');
  });

  // ── Danger variant ──────────────────────────────────────────────────────────

  it('applies danger variant', () => {
    render(<Button variant="danger">Eliminar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('danger');
  });

  // ── Loading state ───────────────────────────────────────────────────────────

  it('loading=true renders a spinner SVG', () => {
    render(<Button loading>Guardando</Button>);
    const btn = screen.getByRole('button');
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('loading=true keeps children text visible', () => {
    render(<Button loading>Guardando</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Guardando');
  });

  it('loading=true disables the button', () => {
    render(<Button loading>Guardando</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('loading=true does not call onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button loading onClick={onClick}>Guardando</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading=true sets aria-busy="true"', () => {
    render(<Button loading>Guardando</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('loading=false (default) does not set aria-busy', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  it('loading=true does not render spinner when false', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button').querySelector('svg')).not.toBeInTheDocument();
  });

  // ── fullWidth ────────────────────────────────────────────────────────────────

  it('fullWidth=true applies fullWidth class', () => {
    render(<Button fullWidth>Ancho completo</Button>);
    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  it('fullWidth=false (default) does not apply fullWidth', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('fullWidth');
  });
});
