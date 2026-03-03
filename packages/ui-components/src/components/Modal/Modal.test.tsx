import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const DefaultModal = ({
  isOpen = true,
  onClose = vi.fn(),
  closeOnBackdrop = true,
  size,
  className,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    closeOnBackdrop={closeOnBackdrop}
    size={size}
    className={className}
  >
    <ModalHeader>Título del modal</ModalHeader>
    <ModalBody>Contenido del modal</ModalBody>
    <ModalFooter>
      <button onClick={onClose}>Cerrar</button>
    </ModalFooter>
  </Modal>
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Modal', () => {
  // ── Visibility ──────────────────────────────────────────────────────────────

  it('renders nothing when isOpen=false', () => {
    render(<DefaultModal isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen=true', () => {
    render(<DefaultModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // ── ARIA attributes ─────────────────────────────────────────────────────────

  it('dialog has aria-modal="true"', () => {
    render(<DefaultModal />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('dialog is labelled by ModalHeader via aria-labelledby', () => {
    render(<DefaultModal />);
    const dialog = screen.getByRole('dialog');
    const heading = screen.getByRole('heading', { name: 'Título del modal' });
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
  });

  // ── Sub-component content ───────────────────────────────────────────────────

  it('renders ModalBody content', () => {
    render(<DefaultModal />);
    expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
  });

  it('renders ModalFooter content', () => {
    render(<DefaultModal />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it('ModalHeader renders a close button with aria-label="Cerrar modal"', () => {
    render(<DefaultModal />);
    expect(screen.getByRole('button', { name: 'Cerrar modal' })).toBeInTheDocument();
  });

  // ── onClose callbacks ───────────────────────────────────────────────────────

  it('clicking ModalHeader close button calls onClose', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape calls onClose', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the backdrop calls onClose when closeOnBackdrop=true', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} closeOnBackdrop />);
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the backdrop does NOT call onClose when closeOnBackdrop=false', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} closeOnBackdrop={false} />);
    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('pressing Escape does NOT call onClose when isOpen=false', () => {
    const onClose = vi.fn();
    render(<DefaultModal isOpen={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Sizes ───────────────────────────────────────────────────────────────────

  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-xl'],
  ] as const)('size %s applies correct max-width class', (size, cls) => {
    render(<DefaultModal size={size} />);
    expect(screen.getByRole('dialog')).toHaveClass(cls);
  });

  // ── className ───────────────────────────────────────────────────────────────

  it('forwards className to the dialog element', () => {
    render(<DefaultModal className="custom-class" />);
    expect(screen.getByRole('dialog')).toHaveClass('custom-class');
  });

  // ── Focus management ────────────────────────────────────────────────────────

  it('moves focus to the first focusable element on open', () => {
    render(<DefaultModal />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cerrar modal' }));
  });

  it('Tab from the last focusable element wraps focus to the first', () => {
    render(<DefaultModal />);
    const [closeBtn, cerrarBtn] = screen.getAllByRole('button'); // Cerrar modal, Cerrar
    cerrarBtn.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);
  });

  it('Shift+Tab from the first focusable element wraps focus to the last', () => {
    render(<DefaultModal />);
    const [closeBtn, cerrarBtn] = screen.getAllByRole('button');
    closeBtn.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(cerrarBtn);
  });

  it('restores focus to the element that had focus before opening', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen onClose={onClose}>
        <ModalHeader>T</ModalHeader>
        <ModalBody>content</ModalBody>
      </Modal>
    );
    // modal is now open — focus moved inside modal

    rerender(
      <Modal isOpen={false} onClose={onClose}>
        <ModalHeader>T</ModalHeader>
        <ModalBody>content</ModalBody>
      </Modal>
    );
    expect(document.activeElement).toBe(trigger);

    document.body.removeChild(trigger);
  });

  // ── Scroll lock ─────────────────────────────────────────────────────────────

  it('locks body scroll when open', () => {
    render(<DefaultModal />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks body scroll when closed', () => {
    const onClose = vi.fn();
    const { rerender } = render(<DefaultModal isOpen onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<DefaultModal isOpen={false} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('');
  });

  // ── Context guard ────────────────────────────────────────────────────────────

  it('ModalHeader throws when used outside <Modal>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ModalHeader>Test</ModalHeader>)).toThrow();
    consoleError.mockRestore();
  });
});
