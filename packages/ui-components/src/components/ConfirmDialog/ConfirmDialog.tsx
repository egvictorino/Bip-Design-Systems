import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { Button } from '../Button';
import { cn } from '../../lib/cn';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const confirmBtnStyles: Record<NonNullable<ConfirmDialogProps['variant']>, string> = {
  info: '',
  danger: 'bg-danger hover:bg-danger-hover active:bg-danger-press focus-visible:ring-danger',
  warning: 'bg-warning hover:opacity-90 active:opacity-80 focus-visible:ring-warning',
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'info',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnBackdrop={false}>
    <ModalHeader>{title}</ModalHeader>
    <ModalBody>
      {description && <p className="text-sm text-txt-secondary">{description}</p>}
    </ModalBody>
    <ModalFooter>
      <Button variant="bare" size="sm" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={onConfirm}
        className={cn(confirmBtnStyles[variant])}
      >
        {confirmLabel}
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmDialog.displayName = 'ConfirmDialog';
