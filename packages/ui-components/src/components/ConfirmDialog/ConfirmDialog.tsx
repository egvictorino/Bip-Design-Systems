import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { Button } from '../Button';
import { cn } from '../../lib/cn';
import { useBipLocale } from '../../i18n';
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
  confirmLabel,
  cancelLabel,
  variant = 'info',
}) => {
  const t = useBipLocale();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnBackdrop={false}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {description && <p className={styles.description}>{description}</p>}
      </ModalBody>
      <ModalFooter>
        <Button variant="bare" size="sm" onClick={onClose}>
          {cancelLabel ?? t.confirmDialog.cancel}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          className={cn(confirmBtnStyles[variant])}
        >
          {confirmLabel ?? t.confirmDialog.confirm}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
