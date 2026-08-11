import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal/index.js';
import { Button } from '../Button/index.js';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  /** Optional mirror of onClose, invoked with `false` at the same call site — for consumers that prefer the open/onOpenChange convention. */
  onOpenChange?: (open: boolean) => void;
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
  open,
  onClose,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'info',
  className,
  ...rest
}) => {
  const t = useBipLocale();

  return (
    <Modal
      open={open}
      onClose={onClose}
      onOpenChange={onOpenChange}
      size="sm"
      closeOnBackdrop={false}
      className={className}
      {...rest}
    >
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
