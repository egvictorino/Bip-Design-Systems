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
    expect(screen.getByRole('button')).toHaveClass('bg-interaction-primary-default', 'text-text-white');
  });

  it('applies secondary variant with white text (contrast)', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-interaction-secondary-default', 'text-text-white');
  });

  it('applies bare variant', () => {
    render(<Button variant="bare">Bare</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('border', 'border-interaction-primary-default', 'bg-transparent');
  });

  it('applies soul variant', () => {
    render(<Button variant="soul">Soul</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-transparent', 'text-interaction-primary-default');
  });

  // ── Sizes ───────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'text-xs', 'px-[12px]', 'py-[6px]'],
    ['md', 'text-sm', 'px-[20px]', 'py-[10px]'],
    ['lg', 'text-lg', 'px-[24px]', 'py-[12px]'],
  ] as const)('size %s applies correct text and padding classes', (size, text, px, py) => {
    render(<Button size={size}>Texto</Button>);
    expect(screen.getByRole('button')).toHaveClass(text, px, py);
  });

  it('defaults to md size', () => {
    render(<Button>Texto</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-sm', 'px-[20px]');
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick} disabled>Disabled</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled button has cursor-not-allowed class', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
  });

  it('disabled button has opacity-50 class for visual distinction', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
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
    expect(button).toHaveClass('bg-interaction-primary-default');
  });
});
