"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn.js';
import { useThemeAttributes } from '../ThemeProvider/index.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Toast.module.css';
import { Alert } from '../Alert/Alert.js';
import type { AlertProps } from '../Alert/Alert.js';

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

export interface ToastContextValue {
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

const positionClass: Record<ToastPosition, string> = {
  'top-left':      styles.topLeft,
  'top-center':    styles.topCenter,
  'top-right':     styles.topRight,
  'bottom-left':   styles.bottomLeft,
  'bottom-center': styles.bottomCenter,
  'bottom-right':  styles.bottomRight,
};

// Slide direction for enter/exit animation based on position
const slideOutClass: Record<ToastPosition, string> = {
  'top-left':      styles.slideOutTopLeft,
  'top-center':    styles.slideOutTopCenter,
  'top-right':     styles.slideOutTopRight,
  'bottom-left':   styles.slideOutBottomLeft,
  'bottom-center': styles.slideOutBottomCenter,
  'bottom-right':  styles.slideOutBottomRight,
};

// ─── Progress bar color per variant ──────────────────────────────────────────

const progressBarClass: Record<NonNullable<ToastConfig['variant']>, string> = {
  info:    styles.progressInfo,
  success: styles.progressSuccess,
  warning: styles.progressWarning,
  danger:  styles.progressDanger,
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
      className={cn(styles.toastItem, isIn ? styles.toastItemIn : slideOutClass[position])}
    >
      {/* Card wrapper: shadow + rounding */}
      <div className={styles.card}>
        <Alert variant={item.variant} title={item.title} onClose={dismiss}>
          {item.message}
        </Alert>

        {/* Auto-dismiss progress bar — only when duration > 0 */}
        {showProgress && (
          <div className={styles.progressTrack}>
            <div
              data-testid="toast-progress-bar"
              className={cn(styles.progressBar, progressBarClass[variant])}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ToastStack (internal) ────────────────────────────────────────────────────

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
      className={styles.stack}
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
            className={styles.toastWrapper}
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
  const t = useBipLocale();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();

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
            aria-label={t.toast.region}
            {...themeAttrs}
            style={themeStyle}
            className={cn(styles.region, positionClass[position])}
          >
            <ToastStack toasts={toasts} onRemove={removeToast} position={position} />
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
