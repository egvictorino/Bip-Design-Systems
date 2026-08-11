"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Tooltip.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Secondary-axis alignment (default: 'center') */
  align?: 'start' | 'center' | 'end';
  /** Color variant (default: 'default') */
  variant?: 'default' | 'light' | 'info' | 'success' | 'warning' | 'error';
  /** Delay in ms before opening (default: 0) */
  delay?: number;
  /** Delay in ms before closing (default: 0) */
  closeDelay?: number;
  /** Controlled open state. When provided, hover/focus no longer toggle internally. */
  open?: boolean;
  /** Initial open state when uncontrolled (default: false) */
  defaultOpen?: boolean;
  /** Callback fired when the internal open state would change */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const variantClassMap: Record<NonNullable<TooltipProps['variant']>, string> = {
  default: '',
  light: styles.variantLight,
  info: styles.variantInfo,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  error: styles.variantError,
};

const alignClassMap: Record<NonNullable<TooltipProps['align']>, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  align = 'center',
  variant = 'default',
  delay = 0,
  closeDelay = 0,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ...rest
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const isRestoringFocusRef = useRef(false);

  const isControlled = open !== undefined;
  const isVisible = isControlled ? open : isOpen;

  // ── Timer cleanup on unmount ──────────────────────────────────────────────

  useEffect(() => () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // ── Escape key: close immediately (no closeDelay) ─────────────────────────

  useEffect(() => {
    if (!isVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openTimerRef.current) clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          setIsOpen(false);
          onOpenChange?.(false);
        }
        isRestoringFocusRef.current = true;
        triggerRef.current?.focus();
        isRestoringFocusRef.current = false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isVisible, isControlled, onOpenChange]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpen = () => {
    if (isRestoringFocusRef.current) return;
    if (isControlled) {
      onOpenChange?.(true);
      return;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (delay > 0) {
      openTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        onOpenChange?.(true);
      }, delay);
    } else {
      setIsOpen(true);
      onOpenChange?.(true);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
      return;
    }
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeDelay > 0) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        onOpenChange?.(false);
      }, closeDelay);
    } else {
      setIsOpen(false);
      onOpenChange?.(false);
    }
  };

  // ── Trigger cloning ───────────────────────────────────────────────────────

  const isElement = React.isValidElement(children);
  const childProps = isElement
    ? (children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props
    : null;

  const triggerEventProps = {
    'aria-describedby': id,
    ref: triggerRef as React.Ref<HTMLElement>,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      childProps?.onMouseEnter?.(e);
      handleOpen();
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      childProps?.onMouseLeave?.(e);
      handleClose();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      childProps?.onFocus?.(e);
      handleOpen();
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      childProps?.onBlur?.(e);
      handleClose();
    },
  };

  const trigger = isElement
    ? React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        triggerEventProps
      )
    : (
      <span
        ref={triggerRef as React.Ref<HTMLSpanElement>}
        aria-describedby={id}
        onMouseEnter={triggerEventProps.onMouseEnter as React.MouseEventHandler<HTMLSpanElement>}
        onMouseLeave={triggerEventProps.onMouseLeave as React.MouseEventHandler<HTMLSpanElement>}
        onFocus={triggerEventProps.onFocus as React.FocusEventHandler<HTMLSpanElement>}
        onBlur={triggerEventProps.onBlur as React.FocusEventHandler<HTMLSpanElement>}
      >
        {children}
      </span>
    );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <span className={cn(styles.wrapper, className)}>
      {trigger}
      <span
        {...rest}
        id={id}
        role="tooltip"
        data-open={isVisible}
        className={cn(
          styles.tooltip,
          styles[position],
          alignClassMap[align],
          variantClassMap[variant]
        )}
      >
        {content}
        <span aria-hidden="true" className={styles.arrow} />
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
