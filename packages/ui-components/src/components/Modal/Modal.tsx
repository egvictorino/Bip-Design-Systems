"use client";

import React, { useEffect, useRef, useContext, useId, createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import { useFocusTrap, useScrollLock } from '../../hooks';
import { useThemeAttributes } from '../ThemeProvider';
import { useBipLocale } from '../../i18n';
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
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  children,
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();

  // Animation state: isVisible keeps the portal in the DOM during exit animation
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useScrollLock(isOpen);
  useFocusTrap(dialogRef, { enabled: isOpen, onEscape: closeOnEscape ? onClose : undefined });

  if (!isVisible) return null;

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
        {...themeAttrs}
        style={themeStyle}
        className={cn(styles.backdrop, isAnimating && styles.backdropOpen)}
        onClick={handleBackdropClick}
      >
        {/* Dialog */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(styles.dialog, sizeClass[size], isAnimating && styles.dialogOpen, className)}
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
  const t = useBipLocale();

  return (
    <div className={cn(styles.header, className)} {...props}>
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
  align?: 'left' | 'center' | 'right';
}

const footerAlignClass: Record<NonNullable<ModalFooterProps['align']>, string> = {
  left: styles.footerLeft,
  center: styles.footerCenter,
  right: styles.footerRight,
};

export const ModalFooter: React.FC<ModalFooterProps> = ({
  className,
  children,
  align = 'right',
  ...props
}) => (
  <div className={cn(styles.footer, footerAlignClass[align], className)} {...props}>
    {children}
  </div>
);

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
