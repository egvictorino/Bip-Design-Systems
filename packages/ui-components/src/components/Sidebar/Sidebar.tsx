import React, { createContext, useCallback, useContext, useEffect, useId, useState } from 'react';
import { cn } from '../../lib/cn';
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id={sidebarId}
        aria-label="Navegación lateral"
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col',
          'bg-white border-r border-interaction-tertiary-default',
          'transition-[width,transform] duration-200 ease-in-out',
          isCollapsed ? 'w-16' : 'w-60',
          // Mobile: hidden by default, visible when isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible regardless of mobile state
          'md:translate-x-0',
          className
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
};

// ─── SidebarHeader ───────────────────────────────────────────────────────────
// When collapsed, switches to justify-center so SidebarTrigger stays centered.

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ className, children, ...props }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        'flex items-center shrink-0 border-b border-interaction-tertiary-default px-4 py-3',
        isCollapsed ? 'justify-center' : 'justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── SidebarBrand ────────────────────────────────────────────────────────────
// Shows brand name/logo when expanded; hides automatically when collapsed.
// Place it before <SidebarTrigger> inside <SidebarHeader>.

export interface SidebarBrandProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({ href, className, children }) => {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  const brandClasses = cn('flex items-center gap-2 font-semibold text-sm text-text-primary', className);

  return href ? (
    <a href={href} className={brandClasses}>
      {children}
    </a>
  ) : (
    <span className={brandClasses}>{children}</span>
  );
};

// ─── SidebarContent ──────────────────────────────────────────────────────────
// Renders as <nav> for correct ARIA landmark semantics.
// The <aside> provides the "complementary" landmark for the panel structure;
// the <nav> inside provides the "navigation" landmark for the actual nav items.

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
    className={cn('flex-1 overflow-y-auto px-3 py-2', className)}
    {...props}
  >
    {children}
  </nav>
);

// ─── SidebarGroup ────────────────────────────────────────────────────────────
// Renders a labeled group of SidebarItems.
// Use the `label` prop for the section heading — it is automatically hidden
// when the sidebar is collapsed. Children are wrapped in a semantic <ul>.

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
    <div className={cn('mb-4', className)} {...props}>
      {label && !isCollapsed && (
        <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wide text-text-disabled">
          {label}
        </p>
      )}
      <ul className="list-none m-0 p-0 flex flex-col gap-0.5">{children}</ul>
    </div>
  );
};

// ─── SidebarGroupLabel ───────────────────────────────────────────────────────
// Standalone label for advanced use cases. For the common case, prefer the
// `label` prop on <SidebarGroup> instead.

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
    <p
      className={cn(
        'px-2 mb-1 text-xs font-semibold uppercase tracking-wide text-text-disabled',
        className
      )}
      {...props}
    >
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

  const baseClasses = cn(
    'flex items-center w-full rounded-md text-sm font-medium transition-colors outline-none',
    'focus-visible:ring-2 focus-visible:ring-interaction-primary-default focus-visible:ring-offset-1',
    isCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2',
    active
      ? 'bg-interaction-tertiary-default text-text-primary'
      : 'text-text-secondary hover:bg-interaction-tertiary-default hover:text-text-primary',
    disabled && 'text-text-disabled cursor-not-allowed pointer-events-none',
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
      className={baseClasses}
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
      className={baseClasses}
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

  return <li className="contents">{wrappedItem}</li>;
};

// ─── SidebarFooter ───────────────────────────────────────────────────────────

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      'shrink-0 border-t border-interaction-tertiary-default px-3 py-3',
      className
    )}
    {...props}
  >
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
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded shrink-0',
        'text-text-secondary hover:bg-interaction-tertiary-default hover:text-text-primary',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'focus-visible:ring-interaction-primary-default',
        className
      )}
      {...props}
    >
      {isCollapsed ? (
        // Chevron right (expand)
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
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
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
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
