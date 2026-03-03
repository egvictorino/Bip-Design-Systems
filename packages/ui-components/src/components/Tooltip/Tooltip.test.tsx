import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
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

  it('renders non-element children without cloning', () => {
    render(<Tooltip content="Tip">Texto plano</Tooltip>);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Texto plano')).toBeInTheDocument();
  });

  it('position top applies bottom-full class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="top">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').className).toMatch(/bottom-full/);
  });

  it('position bottom applies top-full class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="bottom">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').className).toMatch(/top-full/);
  });

  it('position left applies right-full class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="left">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').className).toMatch(/right-full/);
  });

  it('position right applies left-full class on tooltip', () => {
    render(
      <Tooltip content="Tip" position="right">
        <button>T</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').className).toMatch(/left-full/);
  });

  it('forwards className to the wrapper span', () => {
    const { container } = render(
      <Tooltip content="Tip" className="my-wrapper">
        <button>T</button>
      </Tooltip>
    );
    expect(container.firstChild).toHaveClass('my-wrapper');
  });
});
