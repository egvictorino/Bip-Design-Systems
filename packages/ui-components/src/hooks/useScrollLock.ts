import { useEffect } from 'react';

/** Locks `<body>` scroll while `enabled` is true; always restores it on cleanup. */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (enabled) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [enabled]);
}
