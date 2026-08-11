"use client";

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Sidebar.module.css';
import { Tooltip } from '../Tooltip/Tooltip.js';

// ─── Context ─────────────────────────────────────────────────────────────────

type SidebarVariant = 'light' | 'dark' | 'primary';

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  variant: SidebarVariant;
  toggleCollapsed: () => void;
  closeMobile: () => void;
  sidebarId: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = (): SidebarContextValue => {
  const ctx = useContext(SidebarContext);
  if (!ctx)
    throw new Error(
      'SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarItem, SidebarFooter, and SidebarTrigger must be used inside <Sidebar>'
    );
  return ctx;
};

// ─── Sidebar (root) ──────────────────────────────────────────────────────────

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  /** Optional mirror of onClose, invoked with `false` at the same call sites — for consumers that prefer the open/onOpenChange convention. */
  onOpenChange?: (open: boolean) => void;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  variant?: SidebarVariant;
  className?: string;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open = false,
  onClose,
  onOpenChange,
  defaultCollapsed = false,
  collapsed,
  onCollapsedChange,
  variant = 'light',
  className,
  children,
}) => {
  const t = useBipLocale();
  const instanceId = useId();
  const sidebarId = `${instanceId}-sidebar`;

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;

  const toggleCollapsed = useCallback(() => {
    const next = !isCollapsed;
    if (collapsed === undefined) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  }, [isCollapsed, collapsed, onCollapsedChange]);

  const closeMobile = useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, closeMobile]);

  // Focus trap: keep Tab/Shift+Tab cycling inside the panel when mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const panelEl = document.getElementById(sidebarId);
    if (!panelEl) return;
    const focusableSelectors =
      'a:not([tabindex="-1"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        panelEl.querySelectorAll<HTMLElement>(focusableSelectors)
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open, sidebarId]);

  const variantClass =
    variant === 'dark'
      ? styles.variantDark
      : variant === 'primary'
        ? styles.variantPrimary
        : styles.variantLight;

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobileOpen: open, variant, toggleCollapsed, closeMobile, sidebarId }}
    >
      {/* Mobile overlay */}
      {open && (
        <div
          role="presentation"
          data-testid="mobile-overlay"
          className={styles.overlay}
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id={sidebarId}
        aria-label={t.sidebar.nav}
        className={cn(
          styles.panel,
          variantClass,
          isCollapsed ? styles.panelCollapsed : styles.panelExpanded,
          open ? styles.panelMobileOpen : styles.panelMobileClosed,
          className
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
};

// ─── SidebarHeader ───────────────────────────────────────────────────────────

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          styles.header,
          isCollapsed ? styles.headerCollapsed : styles.headerExpanded,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// ─── SidebarBrand ────────────────────────────────────────────────────────────

export interface SidebarBrandProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({ href, className, children }) => {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  const brandClass = cn(styles.brand, className);

  return href ? (
    <a href={href} className={brandClass}>
      {children}
    </a>
  ) : (
    <span className={brandClass}>{children}</span>
  );
};

// ─── SidebarContent ──────────────────────────────────────────────────────────

export interface SidebarContentProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const SidebarContent = forwardRef<HTMLElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    const t = useBipLocale();

    return (
      <nav
        ref={ref}
        aria-label={t.sidebar.navLandmark}
        className={cn(styles.content, className)}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

// ─── SidebarGroup ────────────────────────────────────────────────────────────

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div ref={ref} className={cn(styles.group, className)} {...props}>
        {label && !isCollapsed && <p className={styles.groupLabel}>{label}</p>}
        <ul className={styles.groupList}>{children}</ul>
      </div>
    );
  }
);

// ─── SidebarGroupLabel ───────────────────────────────────────────────────────

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const SidebarGroupLabel = forwardRef<HTMLParagraphElement, SidebarGroupLabelProps>(
  ({ className, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    if (isCollapsed) return null;

    return (
      <p ref={ref} className={cn(styles.groupLabel, className)} {...props}>
        {children}
      </p>
    );
  }
);

// ─── Shared arrow-key navigation helper ──────────────────────────────────────

function navigateSidebarItems(e: React.KeyboardEvent, sidebarId: string) {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const panel = document.getElementById(sidebarId);
  if (!panel) return;
  const items = Array.from(
    panel.querySelectorAll<HTMLElement>('[data-sidebar-item]')
  );
  const currentIndex = items.findIndex((el) => el === document.activeElement);
  let nextIndex = currentIndex;
  if (e.key === 'ArrowDown') nextIndex = Math.min(currentIndex + 1, items.length - 1);
  else if (e.key === 'ArrowUp') nextIndex = Math.max(currentIndex - 1, 0);
  else if (e.key === 'Home') nextIndex = 0;
  else if (e.key === 'End') nextIndex = items.length - 1;
  items[nextIndex]?.focus();
}

// ─── SidebarItem ─────────────────────────────────────────────────────────────

export interface SidebarItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: number | string;
  className?: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
}

export const SidebarItem = forwardRef<HTMLAnchorElement | HTMLButtonElement, SidebarItemProps>(
  (
    { href, active = false, disabled = false, icon, badge, className, onClick, children, ...rest },
    ref
  ) => {
    const { isCollapsed, closeMobile, sidebarId } = useSidebar();

    const handleClick: React.MouseEventHandler = (e) => {
      if (disabled) return;
      closeMobile();
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      navigateSidebarItems(e, sidebarId);
    };

    const itemClass = cn(
      styles.item,
      isCollapsed ? styles.itemCollapsed : styles.itemExpanded,
      active ? styles.itemActive : styles.itemDefault,
      disabled && styles.itemDisabled,
      className
    );

    const badgeLabel =
      badge !== undefined && typeof badge === 'number' && badge > 0
        ? ` (${badge > 99 ? '99+' : badge} notificaciones)`
        : '';

    // When collapsed, provide an accessible name since the text is visually hidden
    const collapsedLabel =
      isCollapsed && typeof children === 'string' ? `${children}${badgeLabel}` : undefined;

    const badgeEl =
      badge !== undefined && !isCollapsed ? (
        <span className={styles.badge} aria-hidden="true">
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </span>
      ) : null;

    const content = isCollapsed ? (
      icon ?? null
    ) : (
      <>
        {icon}
        <span>{children}</span>
        {badgeEl}
      </>
    );

    const itemElement = href ? (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={collapsedLabel}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={itemClass}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-sidebar-item
        {...rest}
      >
        {content}
      </a>
    ) : (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-label={collapsedLabel}
        aria-current={active ? 'page' : undefined}
        disabled={disabled}
        className={itemClass}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-sidebar-item
        {...rest}
      >
        {content}
      </button>
    );

    const wrappedItem =
      isCollapsed && icon ? (
        <Tooltip content={children} position="right">
          {itemElement}
        </Tooltip>
      ) : (
        itemElement
      );

    return <li style={{ display: 'contents' }}>{wrappedItem}</li>;
  }
);

// ─── SidebarSubMenu ──────────────────────────────────────────────────────────

export interface SidebarSubMenuProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number | string;
  className?: string;
  children: React.ReactNode;
}

export const SidebarSubMenu = forwardRef<HTMLButtonElement, SidebarSubMenuProps>(
  ({ label, icon, defaultOpen = false, badge, className, children, ...rest }, ref) => {
  const { isCollapsed, sidebarId } = useSidebar();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const subMenuId = useId();

  // Escape closes the sub-menu and returns focus to the trigger
  const triggerRef = useRef<HTMLButtonElement>(null);
  const combinedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref]
  );
  useEffect(() => {
    if (isCollapsed) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isCollapsed]);

  // When sidebar collapses, auto-close the sub-menu
  useEffect(() => {
    if (isCollapsed) setIsOpen(false);
  }, [isCollapsed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    navigateSidebarItems(e, sidebarId);
  };

  const badgeLabel =
    badge !== undefined && typeof badge === 'number' && badge > 0
      ? ` (${badge > 99 ? '99+' : badge} notificaciones)`
      : '';

  const collapsedLabel =
    isCollapsed && typeof label === 'string' ? `${label}${badgeLabel}` : undefined;

  const badgeEl =
    badge !== undefined && !isCollapsed ? (
      <span className={styles.badge} aria-hidden="true">
        {typeof badge === 'number' && badge > 99 ? '99+' : badge}
      </span>
    ) : null;

  // Collapsed: show only icon with tooltip (no sub-items visible)
  if (isCollapsed) {
    const iconEl = (
      <button
        ref={combinedRef}
        type="button"
        aria-label={collapsedLabel ?? (typeof label === 'string' ? label : undefined)}
        className={cn(styles.item, styles.itemCollapsed, styles.itemDefault, className)}
        onKeyDown={handleKeyDown}
        data-sidebar-item
        {...rest}
      >
        {icon ?? null}
      </button>
    );

    return (
      <li style={{ display: 'contents' }}>
        {icon ? (
          <Tooltip content={label} position="right">
            {iconEl}
          </Tooltip>
        ) : (
          iconEl
        )}
      </li>
    );
  }

  return (
    <li style={{ display: 'contents' }}>
      <button
        ref={combinedRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={subMenuId}
        className={cn(styles.item, styles.itemExpanded, styles.itemDefault, className)}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        data-sidebar-item
        {...rest}
      >
        {icon}
        <span>{label}</span>
        {badgeEl}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={cn(styles.subMenuChevron, isOpen && styles.subMenuChevronOpen)}
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <ul
        id={subMenuId}
        className={cn(styles.subMenuList, isOpen && styles.subMenuListOpen)}
      >
        {children}
      </ul>
    </li>
  );
  }
);

// ─── SidebarFooter ───────────────────────────────────────────────────────────

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...props}>
      {children}
    </div>
  )
);

// ─── SidebarTrigger ──────────────────────────────────────────────────────────

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, ...props }, ref) => {
    const t = useBipLocale();
    const { isCollapsed, toggleCollapsed, sidebarId } = useSidebar();

    return (
      <button
        ref={ref}
        type="button"
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? t.sidebar.expand : t.sidebar.collapse}
        aria-expanded={!isCollapsed}
        aria-controls={sidebarId}
        className={cn(styles.trigger, className)}
        {...props}
      >
        {isCollapsed ? (
          // Chevron right (expand)
          <svg viewBox="0 0 16 16" fill="none" className={styles.triggerIcon} aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Chevron left (collapse)
          <svg viewBox="0 0 16 16" fill="none" className={styles.triggerIcon} aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    );
  }
);

// ─── Display names ────────────────────────────────────────────────────────────

Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'SidebarHeader';
SidebarBrand.displayName = 'SidebarBrand';
SidebarContent.displayName = 'SidebarContent';
SidebarGroup.displayName = 'SidebarGroup';
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
SidebarItem.displayName = 'SidebarItem';
SidebarSubMenu.displayName = 'SidebarSubMenu';
SidebarFooter.displayName = 'SidebarFooter';
SidebarTrigger.displayName = 'SidebarTrigger';
