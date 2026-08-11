'use client';

import React, { createContext, useContext, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './Popover.module.css';

// ─── Context ─────────────────────────────────────────────────────────────────

interface PopoverContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  contentId: string;
  triggerId: string;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopover = (): PopoverContextValue => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('<PopoverTrigger> and <PopoverContent> must be used inside <Popover>');
  return ctx;
};

// ─── Popover ─────────────────────────────────────────────────────────────────

export interface PopoverProps {
  children: React.ReactNode;
  className?: string;
  /** Controlado. Si se omite, el componente maneja su propio estado (ver `defaultOpen`). */
  open?: boolean;
  /** Valor inicial en modo no-controlado. @default false */
  defaultOpen?: boolean;
  /** Se invoca en cada cambio de apertura/cierre, tanto en modo controlado como no-controlado. */
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const contentId = `${id}content`;
  const triggerId = `${id}trigger`;

  const isOpen = openProp ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const toggle = () => setOpen(!isOpen);
  const close = () => setOpen(false);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <PopoverContext.Provider value={{ isOpen, toggle, close, contentId, triggerId }}>
      <div ref={containerRef} className={cn(styles.container, className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

// ─── PopoverTrigger ──────────────────────────────────────────────────────────

export interface PopoverTriggerProps {
  children: React.ReactNode;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children }) => {
  const { isOpen, toggle, contentId, triggerId } = usePopover();

  if (!React.isValidElement(children)) {
    return (
      <button
        type="button"
        id={triggerId}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
      >
        {children}
      </button>
    );
  }

  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

  return React.cloneElement(child, {
    id: triggerId,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      toggle();
      child.props.onClick?.(e);
    },
  });
};

// ─── PopoverContent ──────────────────────────────────────────────────────────

export interface PopoverContentProps {
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

const placementClass: Record<NonNullable<PopoverContentProps['placement']>, string> = {
  'bottom-start': styles.bottomStart,
  'bottom-end': styles.bottomEnd,
  'top-start': styles.topStart,
  'top-end': styles.topEnd,
};

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  placement = 'bottom-start',
  className,
}) => {
  const { isOpen, contentId, triggerId, close } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef, { enabled: isOpen, onEscape: close });

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="dialog"
      aria-labelledby={triggerId}
      tabIndex={-1}
      className={cn(styles.content, placementClass[placement], className)}
    >
      {children}
    </div>
  );
};

// ─── displayNames ─────────────────────────────────────────────────────────────

Popover.displayName = 'Popover';
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';
