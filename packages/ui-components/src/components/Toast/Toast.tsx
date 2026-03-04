import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import { Alert } from '../Alert/Alert';
import type { AlertProps } from '../Alert/Alert';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastConfig {
  variant?: AlertProps['variant'];
  title?: string;
  message: React.ReactNode;
  /**
   * Auto-dismiss delay in ms.
   * Set to 0 to disable auto-dismiss (persistent until the user closes it).
   * Default: 5000
   */
  duration?: number;
}

interface ToastItem extends ToastConfig {
  id: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  addToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_MAX = 3;
const DEFAULT_DURATION = 5000;
const EXIT_DURATION_MS = 250;
const PROGRESS_INTERVAL_MS = 100;

// ─── Progress bar color per variant ──────────────────────────────────────────

const progressBarColor: Record<NonNullable<ToastConfig['variant']>, string> = {
  info: 'bg-interaction-primary-default',
  success: 'bg-feedback-success-default',
  warning: 'bg-feedback-warning-default',
  error: 'bg-feedback-error-default',
};

// ─── ToastItemComponent (internal) ────────────────────────────────────────────

interface ToastItemComponentProps {
  item: ToastItem;
  onRemove: (id: number) => void;
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({ item, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const exitingRef = useRef(false);

  // Enter animation: defer one frame so the CSS transition fires
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismiss = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    setTimeout(() => onRemove(item.id), EXIT_DURATION_MS);
  }, [item.id, onRemove]);

  // Auto-dismiss
  useEffect(() => {
    const duration = item.duration ?? DEFAULT_DURATION;
    if (duration === 0) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, item.duration]);

  // Progress bar countdown
  useEffect(() => {
    const duration = item.duration ?? DEFAULT_DURATION;
    if (duration === 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(interval);
    }, PROGRESS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [item.duration]);

  const isIn = visible && !exiting;
  const duration = item.duration ?? DEFAULT_DURATION;
  const showProgress = duration > 0;
  const variant = item.variant ?? 'info';

  return (
    <div
      className={cn(
        'transition-all ease-out will-change-transform',
        isIn
          ? 'duration-300 opacity-100 translate-x-0'
          : 'duration-[250ms] opacity-0 translate-x-6'
      )}
    >
      {/* Card wrapper: shadow + rounding so the toast looks floating */}
      <div className="rounded-lg overflow-hidden shadow-lg ring-1 ring-black/10">
        <Alert variant={item.variant} title={item.title} onClose={dismiss} className="rounded-none">
          {item.message}
        </Alert>

        {/* Auto-dismiss progress bar — only when duration > 0 */}
        {showProgress && (
          <div className="h-1 bg-black/10">
            <div
              data-testid="toast-progress-bar"
              className={cn(
                'h-full transition-[width] duration-100 ease-linear',
                progressBarColor[variant]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts visible at the same time. Default: 3 */
  max?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  max = DEFAULT_MAX,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback(
    (config: ToastConfig) => {
      const id = ++idRef.current;
      setToasts((prev) => {
        const next = [...prev, { ...config, id }];
        // When the limit is exceeded, remove the oldest toast(s)
        return next.length > max ? next.slice(next.length - max) : next;
      });
    },
    [max]
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // SSR guard: createPortal requires document to exist (not available server-side)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {mounted &&
        ReactDOM.createPortal(
          <div
            role="region"
            aria-label="Notificaciones"
            // pointer-events-none on the container so it never blocks clicks beneath it
            className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-80 pointer-events-none"
          >
            {toasts.map((item) => (
              // pointer-events-auto restores interactivity on each individual toast
              <div key={item.id} className="pointer-events-auto">
                <ToastItemComponent item={item} onRemove={removeToast} />
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
