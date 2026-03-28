import React, { createContext, useCallback, useContext, useEffect, useId, useState } from 'react';
import { cn } from '../../lib/cn';
import styles from './Sidebar.module.css';
import { Tooltip } from '../Tooltip/Tooltip';

// ─── Context ─────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
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
  isOpen?: boolean;
  onClose?: () => void;
  defaultCollapsed?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  defaultCollapsed = false,
  className,
  children,
}) => {
  const instanceId = useId();
  const sidebarId = `${instanceId}-sidebar`;

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const closeMobile = useCallback(() => onClose?.(), [onClose]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeMobile]);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, isMobileOpen: isOpen, toggleCollapsed, closeMobile, sidebarId }}
    >
      {/* Mobile overlay */}
      {isOpen && (
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
        aria-label="Navegación lateral"
        className={cn(
          styles.panel,
          isCollapsed ? styles.panelCollapsed : styles.panelExpanded,
          isOpen ? styles.panelMobileOpen : styles.panelMobileClosed,
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

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ className, children, ...props }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
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
};

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

export const SidebarContent: React.FC<SidebarContentProps> = ({
  className,
  children,
  ...props
}) => (
  <nav
    aria-label="Navegación"
    className={cn(styles.content, className)}
    {...props}
  >
    {children}
  </nav>
);

// ─── SidebarGroup ────────────────────────────────────────────────────────────

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  className,
  children,
  ...props
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={cn(styles.group, className)} {...props}>
      {label && !isCollapsed && (
        <p className={styles.groupLabel}>{label}</p>
      )}
      <ul className={styles.groupList}>{children}</ul>
    </div>
  );
};

// ─── SidebarGroupLabel ───────────────────────────────────────────────────────

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({
  className,
  children,
  ...props
}) => {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  return (
    <p className={cn(styles.groupLabel, className)} {...props}>
      {children}
    </p>
  );
};

// ─── SidebarItem ─────────────────────────────────────────────────────────────

export interface SidebarItemProps {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  active = false,
  disabled = false,
  icon,
  className,
  onClick,
  children,
}) => {
  const { isCollapsed, closeMobile } = useSidebar();

  const handleClick: React.MouseEventHandler = (e) => {
    if (disabled) return;
    closeMobile();
    onClick?.(e);
  };

  const itemClass = cn(
    styles.item,
    isCollapsed ? styles.itemCollapsed : styles.itemExpanded,
    active ? styles.itemActive : styles.itemDefault,
    disabled && styles.itemDisabled,
    className
  );

  // When collapsed, provide an accessible name since the text is visually hidden
  const collapsedLabel = isCollapsed && typeof children === 'string' ? children : undefined;

  const content = isCollapsed ? (
    icon ?? null
  ) : (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  const itemElement = href ? (
    <a
      href={href}
      aria-label={collapsedLabel}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={itemClass}
      onClick={handleClick}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      aria-label={collapsedLabel}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      className={itemClass}
      onClick={handleClick}
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
};

// ─── SidebarFooter ───────────────────────────────────────────────────────────

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, children, ...props }) => (
  <div className={cn(styles.footer, className)} {...props}>
    {children}
  </div>
);

// ─── SidebarTrigger ──────────────────────────────────────────────────────────

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className, ...props }) => {
  const { isCollapsed, toggleCollapsed, sidebarId } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
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
};

// ─── Display names ────────────────────────────────────────────────────────────

Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'SidebarHeader';
SidebarBrand.displayName = 'SidebarBrand';
SidebarContent.displayName = 'SidebarContent';
SidebarGroup.displayName = 'SidebarGroup';
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
SidebarItem.displayName = 'SidebarItem';
SidebarFooter.displayName = 'SidebarFooter';
SidebarTrigger.displayName = 'SidebarTrigger';
