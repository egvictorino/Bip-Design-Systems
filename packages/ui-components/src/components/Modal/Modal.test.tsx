import { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const DefaultModal = ({
  open = true,
  onClose = vi.fn(),
  closeOnBackdrop = true,
  closeOnEscape,
  size,
  className,
}: {
  open?: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) => (
  <Modal
    open={open}
    onClose={onClose}
    closeOnBackdrop={closeOnBackdrop}
    closeOnEscape={closeOnEscape}
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

  it('renders nothing when open=false', () => {
    render(<DefaultModal open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open=true', () => {
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

  it('pressing Escape does NOT call onClose when open=false', () => {
    const onClose = vi.fn();
    render(<DefaultModal open={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Sizes ───────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg', 'xl'] as const)('size %s applies correct size class', (size) => {
    render(<DefaultModal size={size} />);
    expect(screen.getByRole('dialog')).toHaveClass(size);
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

  it('does not steal focus away from a controlled input on every keystroke', () => {
    // Regression test: a real consumer (TenantLookupModal) holds its input's
    // value in the SAME component that renders <Modal>, so every keystroke
    // re-renders <Modal> itself (new `children`) — even though the `onClose`
    // PROP it receives from its own parent stays referentially stable across
    // those re-renders (it's only reconstructed when the grandparent
    // re-renders, which typing in the input does not trigger). handleClose
    // used to be recreated on every Modal render regardless, which changed
    // useFocusTrap's `onEscape` dependency and re-ran its effect — re-
    // focusing the modal's first focusable element (the header's close
    // button) after every single character typed. Forms built on react-hook-
    // form's uncontrolled register() rarely re-render their Modal ancestor
    // per keystroke, which is why this stayed hidden until a controlled-
    // input consumer hit it. `stableOnClose` here stands in for that stable
    // parent-supplied prop — an inline `() => {}` literal would itself be a
    // new reference every render and mask the bug this test targets.
    const stableOnClose = () => {};

    const ControlledModal = () => {
      const [value, setValue] = useState('');
      return (
        <Modal open onClose={stableOnClose}>
          <ModalHeader>Entra a tu consultorio</ModalHeader>
          <ModalBody>
            <input
              aria-label="Subdominio"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </ModalBody>
        </Modal>
      );
    };

    render(<ControlledModal />);
    const input = screen.getByLabelText('Subdominio');
    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'v' } });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'vi' } });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'vir' } });
    expect(document.activeElement).toBe(input);
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
      <Modal open onClose={onClose}>
        <ModalHeader>T</ModalHeader>
        <ModalBody>content</ModalBody>
      </Modal>
    );
    // modal is now open — focus moved inside modal

    rerender(
      <Modal open={false} onClose={onClose}>
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
    const { rerender } = render(<DefaultModal open onClose={onClose} />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<DefaultModal open={false} onClose={onClose} />);
    expect(document.body.style.overflow).toBe('');
  });

  // ── Context guard ────────────────────────────────────────────────────────────

  it('ModalHeader throws when used outside <Modal>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ModalHeader>Test</ModalHeader>)).toThrow();
    consoleError.mockRestore();
  });

  // ── closeOnEscape ────────────────────────────────────────────────────────────

  it('pressing Escape does NOT call onClose when closeOnEscape=false', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} closeOnEscape={false} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('pressing Escape calls onClose when closeOnEscape=true (default)', () => {
    const onClose = vi.fn();
    render(<DefaultModal onClose={onClose} closeOnEscape={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── ModalFooter align ────────────────────────────────────────────────────────

  it('ModalFooter default align is right', () => {
    render(<DefaultModal />);
    const footer = screen.getByRole('button', { name: 'Cerrar' }).parentElement!;
    expect(footer.className).toMatch(/footerRight/);
  });

  it.each(['left', 'center', 'right'] as const)(
    'ModalFooter align="%s" applies correct class',
    (align) => {
      render(
        <Modal open onClose={vi.fn()}>
          <ModalHeader>T</ModalHeader>
          <ModalBody>body</ModalBody>
          <ModalFooter align={align}>
            <button>Acción</button>
          </ModalFooter>
        </Modal>
      );
      const footer = screen.getByRole('button', { name: 'Acción' }).parentElement!;
      expect(footer.className).toMatch(new RegExp(`footer${align.charAt(0).toUpperCase() + align.slice(1)}`));
    }
  );

  // ── Animation ────────────────────────────────────────────────────────────────

  it('modal stays in DOM during exit animation after open changes to false', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const { rerender } = render(<DefaultModal open onClose={onClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(<DefaultModal open={false} onClose={onClose} />);
    // Still in DOM — animation timeout has not fired yet
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => { vi.runAllTimers(); });
    // After timeout, modal is removed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
