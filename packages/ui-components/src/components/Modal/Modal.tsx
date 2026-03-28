import React, { useEffect, useRef, useContext, useId, useCallback, createContext } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './Modal.module.css';

interface ModalContextValue {
  titleId: string;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('<ModalHeader> must be used inside <Modal>');
  return ctx;
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  className,
  children,
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Restore focus to the trigger element when modal closes
  const restoreFocus = useCallback(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current = null;
  }, []);

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return;

    // Save the element that had focus before the modal opened
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Move focus into modal on open
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    (firstFocusable ?? dialogRef.current)?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocus();
    };
  }, [isOpen, onClose, restoreFocus]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <ModalContext.Provider value={{ titleId, onClose }}>
      {/* Backdrop + centering container — presentational, Escape handled at document level */}
      <div
        role="presentation"
        className={styles.backdrop}
        onClick={handleBackdropClick}
      >
        {/* Dialog */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(styles.dialog, sizeClass[size], className)}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ className, children, ...props }) => {
  const { titleId, onClose } = useModalContext();

  return (
    <div className={cn(styles.header, className)} {...props}>
      <h2 id={titleId} className={styles.title}>
        {children}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar modal"
        className={styles.closeBtn}
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={styles.closeBtnIcon}
          aria-hidden="true"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
};

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.body, className)} {...props}>
    {children}
  </div>
);

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.footer, className)} {...props}>
    {children}
  </div>
);

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
