"use client";

import React, {
  useEffect,
  useRef,
  useContext,
  useId,
  createContext,
  useState,
  forwardRef,
} from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn.js';
import { useFocusTrap, useScrollLock } from '../../hooks/index.js';
import { useThemeAttributes } from '../ThemeProvider/index.js';
import { useBipLocale } from '../../i18n/index.js';
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

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'className'> {
  open: boolean;
  onClose: () => void;
  /** Optional mirror of onClose, invoked with `false` at the same call sites — for consumers that prefer the open/onOpenChange convention. */
  onOpenChange?: (open: boolean) => void;
  /** Convenience header — renders a <ModalHeader> before `children`. Omit and compose your own <ModalHeader> for custom header content. */
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

const ANIMATION_DURATION = 150;

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  onOpenChange,
  title,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  children,
  ...rest
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();

  // Animation state: isVisible keeps the portal in the DOM during exit animation
  const [isVisible, setIsVisible] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    onOpenChange?.(false);
  };

  useScrollLock(open);
  useFocusTrap(dialogRef, { enabled: open, onEscape: closeOnEscape ? handleClose : undefined });

  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  return ReactDOM.createPortal(
    <ModalContext.Provider value={{ titleId, onClose: handleClose }}>
      {/* Backdrop + centering container — presentational, Escape handled at document level */}
      <div
        role="presentation"
        {...themeAttrs}
        style={themeStyle}
        className={cn(styles.backdrop, isAnimating && styles.backdropOpen)}
        onClick={handleBackdropClick}
      >
        {/* Dialog */}
        <div
          {...rest}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(styles.dialog, sizeClass[size], isAnimating && styles.dialogOpen, className)}
        >
          {title && <ModalHeader>{title}</ModalHeader>}
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

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { titleId, onClose } = useModalContext();
    const t = useBipLocale();

    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        <h2 id={titleId} className={styles.title}>
          {children}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
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
  }
);

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...props}>
      {children}
    </div>
  )
);

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

const footerAlignClass: Record<NonNullable<ModalFooterProps['align']>, string> = {
  left: styles.footerLeft,
  center: styles.footerCenter,
  right: styles.footerRight,
};

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, align = 'right', ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, footerAlignClass[align], className)} {...props}>
      {children}
    </div>
  )
);

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
