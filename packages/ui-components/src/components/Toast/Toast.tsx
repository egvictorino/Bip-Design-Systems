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

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

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
const TOAST_GAP = 12;    // px gap between toasts in expanded view
const PEEK_PX = 14;      // px older toasts peek behind the front toast
const SCALE_STEP = 0.05; // scale reduction per step from front

// ─── Position classes ─────────────────────────────────────────────────────────

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

// Slide direction for enter/exit animation based on position
const slideOutClasses: Record<ToastPosition, string> = {
  'top-left': 'opacity-0 -translate-x-6',
  'top-center': 'opacity-0 -translate-y-2',
  'top-right': 'opacity-0 translate-x-6',
  'bottom-left': 'opacity-0 -translate-x-6',
  'bottom-center': 'opacity-0 translate-y-2',
  'bottom-right': 'opacity-0 translate-x-6',
};

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
  onHeightChange: (id: number, height: number) => void;
  position: ToastPosition;
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({
  item,
  onRemove,
  onHeightChange,
  position,
}) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const exitingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Enter animation: defer one frame so the CSS transition fires
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Report height to ToastStack for stacking calculations
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // Report initial height immediately (ResizeObserver may not fire in test envs)
    onHeightChange(item.id, el.offsetHeight);
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() => onHeightChange(item.id, el.offsetHeight));
    obs.observe(el);
    return () => obs.disconnect();
  }, [item.id, onHeightChange]);

  const dismiss = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    setTimeout(() => onRemove(item.id), EXIT_DURATION_MS);
  }, [item.id, onRemove]);

  const duration = item.duration ?? DEFAULT_DURATION;
  const showProgress = duration > 0;
  const variant = item.variant ?? 'info';

  // Auto-dismiss
  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  // Progress bar countdown
  useEffect(() => {
    if (duration === 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(interval);
    }, PROGRESS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [duration]);

  const isIn = visible && !exiting;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'transition-all ease-out will-change-transform',
        isIn
          ? 'duration-300 opacity-100 translate-x-0 translate-y-0'
          : ['duration-[250ms]', slideOutClasses[position]]
      )}
    >
      {/* Card wrapper: shadow + rounding */}
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

// ─── ToastStack (internal) ────────────────────────────────────────────────────
// Manages the Sonner-style stacking: collapsed depth effect + hover to expand.

interface ToastStackProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
  position: ToastPosition;
}

const ToastStack: React.FC<ToastStackProps> = ({ toasts, onRemove, position }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heights, setHeights] = useState<Record<number, number>>({});

  const isBottom = position.startsWith('bottom');

  const handleHeightChange = useCallback((id: number, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  // Remove stale heights when toasts are dismissed
  useEffect(() => {
    const ids = new Set(toasts.map((t) => t.id));
    setHeights((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([id]) => ids.has(Number(id)))
      );
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [toasts]);

  if (toasts.length === 0) return null;

  const frontId = toasts[toasts.length - 1].id;
  const frontHeight = heights[frontId] ?? 80;

  const expandedHeight =
    toasts.reduce((sum, t) => sum + (heights[t.id] ?? 80), 0) +
    Math.max(0, toasts.length - 1) * TOAST_GAP;

  const containerHeight = isExpanded ? expandedHeight : frontHeight;

  // Precompute suffix sums for O(N) expanded offsets (avoids O(N²) inner loop)
  const cumFromFront: number[] = new Array(toasts.length).fill(0);
  for (let i = toasts.length - 2; i >= 0; i--) {
    cumFromFront[i] = cumFromFront[i + 1] + (heights[toasts[i + 1].id] ?? 80) + TOAST_GAP;
  }

  return (
    <div
      className="relative w-80 pointer-events-none transition-[height] duration-300 ease-out"
      style={{ height: containerHeight }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {toasts.map((item, arrayIdx) => {
        // fromFront: 0 = newest (front of stack), increases toward oldest
        const fromFront = toasts.length - 1 - arrayIdx;
        const isHidden = fromFront >= 3;

        // Common style properties shared by both expanded and collapsed states
        const baseStyle: React.CSSProperties = {
          ...(isBottom ? { bottom: 0 } : { top: 0 }),
          zIndex: toasts.length - fromFront,
        };

        const wrapperStyle: React.CSSProperties = isExpanded
          ? {
              // Expanded: offset each toast by cumulative height of newer toasts
              ...baseStyle,
              transform: `translateY(${isBottom ? -cumFromFront[arrayIdx] : cumFromFront[arrayIdx]}px) scale(1)`,
              opacity: 1,
              pointerEvents: 'auto',
            }
          : {
              // Collapsed: stacked with scale + peek effect
              ...baseStyle,
              transform: `translateY(${isBottom ? -(fromFront * PEEK_PX) : fromFront * PEEK_PX}px) scale(${1 - fromFront * SCALE_STEP})`,
              opacity: isHidden ? 0 : 1 - fromFront * 0.1,
              pointerEvents: fromFront === 0 ? 'auto' : 'none',
            };

        return (
          <div
            key={item.id}
            className="absolute w-full transition-[transform,opacity] duration-300 ease-out"
            style={wrapperStyle}
          >
            <ToastItemComponent
              item={item}
              onRemove={onRemove}
              onHeightChange={handleHeightChange}
              position={position}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts visible at the same time. Default: 3 */
  max?: number;
  /**
   * Position of the toast stack on screen. Default: 'top-right'
   * @example 'bottom-right' — Sonner-style bottom corner
   */
  position?: ToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  max = DEFAULT_MAX,
  position = 'top-right',
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
            className={cn('fixed z-[100] pointer-events-none', positionClasses[position])}
          >
            <ToastStack toasts={toasts} onRemove={removeToast} position={position} />
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
