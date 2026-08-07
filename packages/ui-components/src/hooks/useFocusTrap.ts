import { useCallback, useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export interface UseFocusTrapOptions {
  enabled: boolean;
  /** Called on Escape keydown. Omit to leave Escape unhandled. */
  onEscape?: () => void;
}

/**
 * Traps Tab/Shift+Tab focus cycling within `containerRef` while `enabled`, moves focus
 * into the container on activation, and restores focus to the previously focused element
 * on cleanup — the WAI-ARIA Dialog pattern shared by Modal and DrawerPanel.
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  { enabled, onEscape }: UseFocusTrapOptions
): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const restoreFocus = useCallback(() => {
    previouslyFocusedRef.current?.focus();
    previouslyFocusedRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
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

    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    (firstFocusable ?? containerRef.current)?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onEscape, restoreFocus]);
}
