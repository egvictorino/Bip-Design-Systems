import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';

export interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  placement?: 'right' | 'left';
  className?: string;
  children: React.ReactNode;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const sizeStyles: Record<NonNullable<DrawerPanelProps['size']>, string> = {
  sm: 'w-80',
  md: 'w-[480px]',
  lg: 'w-[640px]',
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
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const restoreFocus = useCallback(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current = null;
  }, []);

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

  if (!open) return null;

  return ReactDOM.createPortal(
    /* Backdrop */
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-black/50"
      onClick={onClose}
    >
      {/* Panel — stops click propagation so backdrop click works correctly */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute top-0 bottom-0 flex flex-col bg-white shadow-xl focus:outline-none',
          sizeStyles[size],
          placement === 'right' ? 'right-0' : 'left-0',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-edge px-6 py-4 shrink-0">
            <h2 className="text-lg font-semibold text-txt">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
              className={cn(
                'shrink-0 rounded p-1 text-txt-secondary transition-colors',
                'hover:bg-surface-3 hover:text-txt',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
              )}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};

DrawerPanel.displayName = 'DrawerPanel';
