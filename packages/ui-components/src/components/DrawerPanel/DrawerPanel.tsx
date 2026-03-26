import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './DrawerPanel.module.css';

export interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  placement?: 'right' | 'left';
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  headerActions?: React.ReactNode;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<NonNullable<DrawerPanelProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// ─── Component ────────────────────────────────────────────────────────────────

export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  placement = 'right',
  className,
  children,
  footer,
  closeOnBackdrop = true,
  headerActions,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Animation state
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  const restoreFocus = useCallback(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current = null;
  }, []);

  // Animation lifecycle — controls mount/unmount with delayed exit
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Lock scroll + save focus when opening
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
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

    // Focus first focusable element inside panel
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    (firstFocusable ?? panelRef.current)?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocus();
    };
  }, [open, onClose, restoreFocus]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      {/* Backdrop — hidden from a11y tree; drawer closes via X button and Escape */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className={cn(styles.backdrop, visible && styles.backdropVisible)}
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          styles.panel,
          sizeStyles[size],
          placement === 'right' ? styles.placementRight : styles.placementLeft,
          visible && styles.panelVisible,
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {headerActions && <div className={styles.headerActions}>{headerActions}</div>}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
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
        )}

        {/* Scrollable content */}
        <div className={styles.content}>{children}</div>

        {/* Sticky footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

DrawerPanel.displayName = 'DrawerPanel';
