import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  // ── Image mode ──────────────────────────────────────────────────────────────

  it('renderiza <img> cuando src está provisto', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="Foto de perfil" />);
    const img = screen.getByRole('img', { name: 'Foto de perfil' });
    expect(img.tagName).toBe('IMG');
  });

  it('usa name como alt text cuando alt no se provee y hay src', () => {
    render(<Avatar src="https://example.com/photo.jpg" name="Juan García" />);
    expect(screen.getByRole('img', { name: 'Juan García' })).toBeInTheDocument();
  });

  it('usa "Avatar" como alt text cuando no hay alt ni name', () => {
    render(<Avatar src="https://example.com/photo.jpg" />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toBeInTheDocument();
  });

  // ── Fallback on image error ─────────────────────────────────────────────────

  it('hace fallback a iniciales cuando la imagen falla y hay name', () => {
    const { container } = render(
      <Avatar src="https://example.com/broken.jpg" name="Juan García" />
    );
    const img = container.querySelector('img')!;
    fireEvent.error(img);
    expect(screen.getByText('JG')).toBeInTheDocument();
  });

  it('hace fallback a icon cuando la imagen falla y no hay name', () => {
    const { container } = render(<Avatar src="https://example.com/broken.jpg" />);
    const img = container.querySelector('img')!;
    fireEvent.error(img);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  // ── Initials mode ───────────────────────────────────────────────────────────

  it('muestra iniciales cuando no hay src y el name tiene una sola palabra', () => {
    render(<Avatar name="Juan" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('muestra iniciales de primera y última palabra para nombre compuesto', () => {
    render(<Avatar name="Juan García" />);
    expect(screen.getByText('JG')).toBeInTheDocument();
  });

  it('toma primera y última palabra para nombres con más de 2 partes', () => {
    render(<Avatar name="Juan Carlos García López" />);
    expect(screen.getByText('JL')).toBeInTheDocument();
  });

  it('convierte las iniciales a mayúsculas', () => {
    render(<Avatar name="juan garcía" />);
    expect(screen.getByText('JG')).toBeInTheDocument();
  });

  it('modo initials tiene role="img" y aria-label con el name', () => {
    render(<Avatar name="Juan García" />);
    expect(screen.getByRole('img', { name: 'Juan García' })).toBeInTheDocument();
  });

  it('modo initials usa alt como aria-label cuando se provee', () => {
    render(<Avatar name="Juan García" alt="Doctor García" />);
    expect(screen.getByRole('img', { name: 'Doctor García' })).toBeInTheDocument();
  });

  // ── Icon mode ───────────────────────────────────────────────────────────────

  it('muestra ícono SVG cuando no hay src ni name', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('modo icon tiene role="img" y aria-label="Avatar"', () => {
    render(<Avatar />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toBeInTheDocument();
  });

  it('modo icon usa alt personalizado como aria-label', () => {
    render(<Avatar alt="Usuario anónimo" />);
    expect(screen.getByRole('img', { name: 'Usuario anónimo' })).toBeInTheDocument();
  });

  // ── Deterministic color hash ────────────────────────────────────────────────

  it('el mismo name genera el mismo color de fondo (determinístico)', () => {
    const { container: c1 } = render(<Avatar name="Ana López" />);
    const { container: c2 } = render(<Avatar name="Ana López" />);
    const bg1 = (c1.querySelector('[role="img"]') as HTMLElement).className;
    const bg2 = (c2.querySelector('[role="img"]') as HTMLElement).className;
    expect(bg1).toBe(bg2);
  });

  it('nombres distintos generan clases de fondo distintas', () => {
    const { container: c1 } = render(<Avatar name="Ana" />);
    const { container: c2 } = render(<Avatar name="Zebedeo" />);
    const bg1 = (c1.querySelector('[role="img"]') as HTMLElement).className;
    const bg2 = (c2.querySelector('[role="img"]') as HTMLElement).className;
    expect(bg1).not.toBe(bg2);
  });

  // ── Sizes ───────────────────────────────────────────────────────────────────

  it.each([
    ['xs', 'w-6', 'h-6'],
    ['sm', 'w-8', 'h-8'],
    ['md', 'w-10', 'h-10'],
    ['lg', 'w-12', 'h-12'],
    ['xl', 'w-16', 'h-16'],
  ] as const)('size "%s" aplica dimensiones correctas al wrapper', (size, w, h) => {
    const { container } = render(<Avatar size={size} />);
    expect(container.firstChild).toHaveClass(w);
    expect(container.firstChild).toHaveClass(h);
  });

  // ── Shapes ──────────────────────────────────────────────────────────────────

  it('shape="circle" aplica rounded-full al inner div', () => {
    render(<Avatar shape="circle" />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toHaveClass('rounded-full');
  });

  it('shape="square" aplica rounded-lg al inner div', () => {
    render(<Avatar shape="square" />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toHaveClass('rounded-lg');
  });

  // ── Status indicator ────────────────────────────────────────────────────────

  it.each(['online', 'offline', 'away', 'busy'] as const)(
    'status="%s" renderiza un badge de estado con aria-hidden',
    (status) => {
      const { container } = render(<Avatar status={status} />);
      expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
    }
  );

  it('no renderiza badge cuando status no se provee', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('status="online" tiene clase bg-success', () => {
    const { container } = render(<Avatar status="online" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass('bg-success');
  });

  it('status="busy" tiene clase bg-danger', () => {
    const { container } = render(<Avatar status="busy" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveClass('bg-danger');
  });

  // ── forwardRef ──────────────────────────────────────────────────────────────

  it('forwarda ref al div wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Avatar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className ───────────────────────────────────────────────────────────────

  it('acepta className personalizado sin perder clases base', () => {
    const { container } = render(<Avatar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('inline-flex');
  });
});

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

describe('AvatarGroup', () => {
  it('renderiza todos los avatares cuando la cantidad no supera max', () => {
    render(
      <AvatarGroup max={4}>
        <Avatar name="Ana" />
        <Avatar name="Bob" />
        <Avatar name="Carlos" />
      </AvatarGroup>
    );
    // 3 avatares = 3 role="img"
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('limita los avatares visibles a max y muestra badge "+N"', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ana" />
        <Avatar name="Bob" />
        <Avatar name="Carlos" />
        <Avatar name="Diana" />
      </AvatarGroup>
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('badge "+N" tiene aria-label correcto', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ana" />
        <Avatar name="Bob" />
        <Avatar name="Carlos" />
        <Avatar name="Diana" />
      </AvatarGroup>
    );
    expect(screen.getByRole('img', { name: '2 más' })).toBeInTheDocument();
  });

  it('no muestra badge cuando la cantidad es igual al max', () => {
    render(
      <AvatarGroup max={3}>
        <Avatar name="Ana" />
        <Avatar name="Bob" />
        <Avatar name="Carlos" />
      </AvatarGroup>
    );
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('aplica el size a los avatares clonados', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar name="Ana" />
      </AvatarGroup>
    );
    // w-12 es la clase de size lg
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });

  it('renderiza con role="group"', () => {
    render(
      <AvatarGroup>
        <Avatar name="Ana" />
      </AvatarGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
