import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

const DefaultModal = ({
  isOpen = true,
  onClose = vi.fn(),
  closeOnBackdrop = true,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={closeOnBackdrop}>
    <ModalHeader>Título del modal</ModalHeader>
    <ModalBody>Contenido del modal</ModalBody>
    <ModalFooter>
      <button onClick={onClose}>Cerrar</button>
    </ModalFooter>
  </Modal>
);

describe('Modal', () => {
  it('renders nothing when isOpen=false', () => {
    render(<DefaultModal isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen=true', () => {
    render(<DefaultModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

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
});
