import { act, render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders tooltip content with role="tooltip"', () => {
    render(
      <Tooltip content="Texto del tooltip">
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Texto del tooltip');
  });

  it('adds aria-describedby on the trigger pointing to the tooltip', () => {
    render(
      <Tooltip content="Descripción">
        <button>Trigger</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('tooltip id is non-empty and unique', () => {
    render(
      <>
        <Tooltip content="Tip 1">
          <button>A</button>
        </Tooltip>
        <Tooltip content="Tip 2">
          <button>B</button>
        </Tooltip>
      </>
    );
    const tooltips = screen.getAllByRole('tooltip');
    expect(tooltips[0].id).not.toBe('');
    expect(tooltips[1].id).not.toBe('');
    expect(tooltips[0].id).not.toBe(tooltips[1].id);
  });

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'renders with position %s',
    (position) => {
      render(
        <Tooltip content="Tooltip" position={position}>
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    }
  );

  it('renders non-element children wrapping them in a span', () => {
    render(<Tooltip content="Tip">Texto plano</Tooltip>);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Texto plano')).toBeInTheDocument();
  });

  // ── Position classes ───────────────────────────────────────────────────────

  it('position top applies top class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="top">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveClass('top');
  });

  it('position bottom applies bottom class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="bottom">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveClass('bottom');
  });

  it('position left applies left class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="left">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveClass('left');
  });

  it('position right applies right class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="right">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveClass('right');
  });

  it('forwards className to the wrapper span', () => {
    const { container } = render(
      <Tooltip content="Tip" className="my-wrapper">
        <button>T</button>
      </Tooltip>
    );
    expect(container.firstChild).toHaveClass('my-wrapper');
  });

  // ── Open / close behavior ──────────────────────────────────────────────────

  it('tooltip starts closed (data-open="false")', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('opens on mouseEnter over the trigger', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  it('closes on mouseLeave', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('opens on focus', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    fireEvent.focus(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  it('closes on blur', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    fireEvent.focus(screen.getByRole('button'));
    fireEvent.blur(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('preserves existing onMouseEnter handler on the child element', () => {
    const onMouseEnter = vi.fn();
    render(
      <Tooltip content="Tip">
        <button onMouseEnter={onMouseEnter}>T</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  // ── Delay ─────────────────────────────────────────────────────────────────

  it('does not open immediately when delay > 0', () => {
    vi.useFakeTimers();
    render(<Tooltip content="Tip" delay={300}><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
    act(() => { vi.runAllTimers(); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
    vi.useRealTimers();
  });

  it('cancels open timer on mouseLeave before delay expires', () => {
    vi.useFakeTimers();
    render(<Tooltip content="Tip" delay={300}><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
    vi.useRealTimers();
  });

  it('opens immediately when delay=0 (default)', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  it('applies closeDelay before hiding on mouseLeave', () => {
    vi.useFakeTimers();
    render(<Tooltip content="Tip" closeDelay={200}><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
    fireEvent.mouseLeave(screen.getByRole('button'));
    // still visible before closeDelay expires
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
    vi.useRealTimers();
  });

  // ── Escape key ────────────────────────────────────────────────────────────

  it('closes on Escape key press when open', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    act(() => { fireEvent.mouseEnter(screen.getByRole('button')); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('returns focus to trigger on Escape', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    const button = screen.getByRole('button');
    act(() => { fireEvent.focus(button); });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(button);
  });

  it('Escape is a no-op when tooltip is already closed', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    expect(() => fireEvent.keyDown(document, { key: 'Escape' })).not.toThrow();
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('Escape closes immediately ignoring closeDelay', () => {
    vi.useFakeTimers();
    render(<Tooltip content="Tip" closeDelay={500}><button>T</button></Tooltip>);
    act(() => { fireEvent.mouseEnter(screen.getByRole('button')); });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    // Should be closed immediately without waiting for closeDelay
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
    vi.useRealTimers();
  });

  // ── Controlled mode ───────────────────────────────────────────────────────

  it('renders with data-open="true" when open=true', () => {
    render(<Tooltip content="Tip" open={true}><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  it('renders with data-open="false" when open=false', () => {
    render(<Tooltip content="Tip" open={false}><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('mouseEnter calls onOpenChange(true) without self-opening in controlled mode', () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" open={false} onOpenChange={onOpenChange}>
        <button>T</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // tooltip does NOT open by itself — parent controls it
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'false');
  });

  it('mouseLeave calls onOpenChange(false) in controlled mode', () => {
    const onOpenChange = vi.fn();
    render(
      <Tooltip content="Tip" open={true} onOpenChange={onOpenChange}>
        <button>T</button>
      </Tooltip>
    );
    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-open', 'true');
  });

  it('Escape calls onOpenChange(false) in controlled mode', () => {
    const onOpenChange = vi.fn();
    // open=true from the start → effect runs on mount
    const { rerender } = render(
      <Tooltip content="Tip" open={true} onOpenChange={onOpenChange}>
        <button>T</button>
      </Tooltip>
    );
    // rerender inside act to flush the mount effects (Escape listener)
    act(() => { rerender(
      <Tooltip content="Tip" open={true} onOpenChange={onOpenChange}>
        <button>T</button>
      </Tooltip>
    ); });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('onOpenChange fires in uncontrolled mode when tooltip opens', () => {
    const onOpenChange = vi.fn();
    render(<Tooltip content="Tip" onOpenChange={onOpenChange}><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('onOpenChange fires in uncontrolled mode when tooltip closes', () => {
    const onOpenChange = vi.fn();
    render(<Tooltip content="Tip" onOpenChange={onOpenChange}><button>T</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Variant ───────────────────────────────────────────────────────────────

  it.each(['default', 'light', 'info', 'success', 'warning', 'error'] as const)(
    'renders with variant %s',
    (variant) => {
      render(<Tooltip content="Tip" variant={variant}><button>T</button></Tooltip>);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    }
  );

  it('variant light applies variantLight class', () => {
    render(<Tooltip content="Tip" variant="light"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('variantLight');
  });

  it('variant info applies variantInfo class', () => {
    render(<Tooltip content="Tip" variant="info"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('variantInfo');
  });

  it('variant success applies variantSuccess class', () => {
    render(<Tooltip content="Tip" variant="success"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('variantSuccess');
  });

  it('variant warning applies variantWarning class', () => {
    render(<Tooltip content="Tip" variant="warning"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('variantWarning');
  });

  it('variant error applies variantError class', () => {
    render(<Tooltip content="Tip" variant="error"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('variantError');
  });

  it('default variant does not apply any variant class', () => {
    render(<Tooltip content="Tip" variant="default"><button>T</button></Tooltip>);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).not.toHaveClass('variantLight');
    expect(tooltip).not.toHaveClass('variantInfo');
  });

  // ── Align ──────────────────────────────────────────────────────────────────

  it.each(['start', 'center', 'end'] as const)(
    'renders with align %s',
    (align) => {
      render(<Tooltip content="Tip" align={align}><button>T</button></Tooltip>);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    }
  );

  it('align=start applies alignStart class', () => {
    render(<Tooltip content="Tip" align="start"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('alignStart');
  });

  it('align=end applies alignEnd class', () => {
    render(<Tooltip content="Tip" align="end"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('alignEnd');
  });

  it('align=center (default) applies alignCenter class', () => {
    render(<Tooltip content="Tip"><button>T</button></Tooltip>);
    expect(screen.getByRole('tooltip')).toHaveClass('alignCenter');
  });

  it('align=center with position=left applies both left and alignCenter', () => {
    render(<Tooltip content="Tip" position="left" align="center"><button>T</button></Tooltip>);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('left');
    expect(tooltip).toHaveClass('alignCenter');
  });
});
