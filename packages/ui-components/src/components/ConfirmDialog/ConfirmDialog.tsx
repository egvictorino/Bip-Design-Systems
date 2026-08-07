import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal/index.js';
import { Button } from '../Button/index.js';
import { cn } from '../../lib/cn.js';
import styles from './ConfirmDialog.module.css';

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
  danger: styles.confirmDanger,
  warning: styles.confirmWarning,
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
      {description && <p className={styles.description}>{description}</p>}
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
