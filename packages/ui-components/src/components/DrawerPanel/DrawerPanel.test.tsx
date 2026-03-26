import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawerPanel } from './DrawerPanel';

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Detalle del paciente',
  children: <p>Contenido del panel</p>,
};

describe('DrawerPanel', () => {
  it('renders content when open', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByText('Detalle del paciente')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DrawerPanel {...defaultProps} open={false} />);
    expect(screen.queryByText('Contenido del panel')).not.toBeInTheDocument();
  });

  it('has dialog role with aria-modal', () => {
    render(<DrawerPanel {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-label from title prop', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Detalle del paciente');
  });

  it('renders close button', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByLabelText('Cerrar panel')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Cerrar panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    const backdrop = document.querySelector('button[aria-hidden="true"]') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render header when no title', () => {
    render(<DrawerPanel open={true} onClose={vi.fn()}>Content</DrawerPanel>);
    expect(screen.queryByLabelText('Cerrar panel')).not.toBeInTheDocument();
  });

  it('applies right placement by default', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveClass('placementRight');
  });

  it('applies left placement', () => {
    render(<DrawerPanel {...defaultProps} placement="left" />);
    expect(screen.getByRole('dialog')).toHaveClass('placementLeft');
  });

  it('applies sm size class', () => {
    render(<DrawerPanel {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass('sizeSm');
  });

  it('applies lg size class', () => {
    render(<DrawerPanel {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toHaveClass('sizeLg');
  });
});

// ─── Animación ─────────────────────────────────────────────────────────────────

describe('DrawerPanel — animación', () => {
  it('panel enters the DOM when open changes from false to true', async () => {
    const { rerender } = render(<DrawerPanel {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<DrawerPanel {...defaultProps} open={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('panel gains panelVisible class after mount', async () => {
    const { rerender } = render(<DrawerPanel {...defaultProps} open={false} />);
    rerender(<DrawerPanel {...defaultProps} open={true} />);

    await act(async () => {});
    expect(screen.getByRole('dialog')).toHaveClass('panelVisible');
  });

  it('panel loses panelVisible class immediately when open becomes false', async () => {
    const { rerender } = render(<DrawerPanel {...defaultProps} open={true} />);
    await act(async () => {});
    expect(screen.getByRole('dialog')).toHaveClass('panelVisible');

    rerender(<DrawerPanel {...defaultProps} open={false} />);
    expect(screen.getByRole('dialog')).not.toHaveClass('panelVisible');
  });

  it('panel stays in DOM during exit animation (before timer expires)', async () => {
    vi.useFakeTimers();
    const { rerender } = render(<DrawerPanel {...defaultProps} open={true} />);
    await act(async () => {});

    rerender(<DrawerPanel {...defaultProps} open={false} />);
    // Still mounted during the 300ms transition
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('panel is removed from DOM after exit animation (300ms)', async () => {
    vi.useFakeTimers();
    const { rerender } = render(<DrawerPanel {...defaultProps} open={true} />);
    await act(async () => {});

    rerender(<DrawerPanel {...defaultProps} open={false} />);
    act(() => vi.advanceTimersByTime(350));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});

// ─── footer prop ───────────────────────────────────────────────────────────────

describe('DrawerPanel — footer', () => {
  it('does not render footer element when footer prop is not provided', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(document.querySelector('[class*="footer"]')).not.toBeInTheDocument();
  });

  it('renders footer content when footer prop is provided', () => {
    render(
      <DrawerPanel {...defaultProps} footer={<button>Guardar</button>} />
    );
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('footer renders after the content area in DOM order', () => {
    render(
      <DrawerPanel {...defaultProps} footer={<button>Guardar</button>} />
    );
    const dialog = screen.getByRole('dialog');
    const children = Array.from(dialog.children);
    const contentIdx = children.findIndex((el) => el.textContent?.includes('Contenido del panel'));
    const footerIdx = children.findIndex((el) => el.textContent?.includes('Guardar'));
    expect(contentIdx).toBeLessThan(footerIdx);
  });

  it('footer has the footer CSS class applied', () => {
    render(
      <DrawerPanel {...defaultProps} footer={<span>footer content</span>} />
    );
    expect(document.querySelector('[class*="footer"]')).toBeInTheDocument();
  });
});

// ─── closeOnBackdrop prop ──────────────────────────────────────────────────────

describe('DrawerPanel — closeOnBackdrop', () => {
  it('does NOT call onClose when backdrop is clicked and closeOnBackdrop=false', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} closeOnBackdrop={false} />);
    const backdrop = document.querySelector('button[aria-hidden="true"]') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('backdrop still renders when closeOnBackdrop=false', () => {
    render(<DrawerPanel {...defaultProps} closeOnBackdrop={false} />);
    expect(document.querySelector('button[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('Escape key still closes panel when closeOnBackdrop=false', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} closeOnBackdrop={false} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close button still closes panel when closeOnBackdrop=false', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} closeOnBackdrop={false} />);
    await userEvent.click(screen.getByLabelText('Cerrar panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─── headerActions prop ────────────────────────────────────────────────────────

describe('DrawerPanel — headerActions', () => {
  it('renders headerActions content in the header', () => {
    render(
      <DrawerPanel {...defaultProps} headerActions={<button>Editar</button>} />
    );
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('does not render headerActions container when prop is not provided', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(document.querySelector('[class*="headerActions"]')).not.toBeInTheDocument();
  });

  it('does not render headerActions when no title (header does not exist)', () => {
    render(
      <DrawerPanel open={true} onClose={vi.fn()} headerActions={<button>Editar</button>}>
        Content
      </DrawerPanel>
    );
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
  });

  it('headerActions renders before the close button in DOM order', () => {
    render(
      <DrawerPanel {...defaultProps} headerActions={<button>Editar</button>} />
    );
    const header = screen.getByRole('heading', { level: 2 }).parentElement!;
    const children = Array.from(header.children);
    const actionsIdx = children.findIndex((el) => el.textContent?.includes('Editar'));
    const closeIdx = children.findIndex(
      (el) => (el as HTMLElement).getAttribute('aria-label') === 'Cerrar panel'
    );
    expect(actionsIdx).toBeLessThan(closeIdx);
  });

  it('close button still functions when headerActions is present', async () => {
    const onClose = vi.fn();
    render(
      <DrawerPanel {...defaultProps} onClose={onClose} headerActions={<button>Editar</button>} />
    );
    await userEvent.click(screen.getByLabelText('Cerrar panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
