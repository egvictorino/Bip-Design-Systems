"use client";

import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useClickOutside } from '../../lib/useClickOutside';
import styles from './Dropdown.module.css';

// ─── Context ─────────────────────────────────────────────────────────────────

interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  menuId: string;
  triggerId: string;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdown = (): DropdownContextValue => {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error(
      '<DropdownTrigger>, <DropdownMenu> and <DropdownItem> must be used inside <Dropdown>'
    );
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NAVIGABLE_SELECTOR =
  '[role="menuitem"]:not([disabled]), [role="menuitemcheckbox"]:not([disabled])';

/** Returns only items that belong directly to `menu` (not nested inside a sub-menu). */
function getDirectItems(menu: HTMLElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll<HTMLElement>(NAVIGABLE_SELECTOR)).filter(
    (item) => item.closest('[role="menu"]') === menu
  );
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const menuId = `${id}menu`;
  const triggerId = `${id}trigger`;

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  // Close on outside click
  useClickOutside(containerRef, () => setIsOpen(false));

  // Close on Escape and return focus to trigger
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        document.getElementById(triggerId)?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, triggerId]);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close, menuId, triggerId }}>
      <div ref={containerRef} className={cn(styles.container, className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// ─── DropdownTrigger ─────────────────────────────────────────────────────────

export interface DropdownTriggerProps {
  children: React.ReactNode;
}

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children }) => {
  const { isOpen, toggle, menuId, triggerId } = useDropdown();

  if (!React.isValidElement(children)) {
    return (
      <button
        type="button"
        id={triggerId}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggle}
      >
        {children}
      </button>
    );
  }

  const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

  return React.cloneElement(child, {
    id: triggerId,
    'aria-haspopup': 'true' as const,
    'aria-expanded': isOpen,
    'aria-controls': menuId,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      toggle();
      child.props.onClick?.(e);
    },
  });
};

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

export interface DropdownMenuProps {
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

const placementClass: Record<NonNullable<DropdownMenuProps['placement']>, string> = {
  'bottom-start': styles.bottomStart,
  'bottom-end': styles.bottomEnd,
  'top-start': styles.topStart,
  'top-end': styles.topEnd,
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  placement = 'bottom-start',
  className,
}) => {
  const { isOpen, menuId, triggerId, close } = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus first item when menu opens
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const items = getDirectItems(menuRef.current);
    items[0]?.focus();
  }, [isOpen]);

  // Arrow key navigation between items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const items = getDirectItems(menuRef.current);
    const idx = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      // WAI-ARIA Menu Button: Tab closes the menu and lets focus move naturally
      close();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(styles.menu, placementClass[placement], className)}
    >
      {children}
    </div>
  );
};

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  danger = false,
  icon,
  children,
  onClick,
  disabled = false,
  className,
  ...props
}) => {
  const { close } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    close();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(styles.item, danger && styles.itemDanger, className)}
      {...props}
      role="menuitem"
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

// ─── DropdownDivider ──────────────────────────────────────────────────────────

export const DropdownDivider: React.FC = () => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className={styles.divider}
  />
);

// ─── DropdownGroup ────────────────────────────────────────────────────────────

export interface DropdownGroupProps {
  label: string;
  children: React.ReactNode;
}

export const DropdownGroup: React.FC<DropdownGroupProps> = ({ label, children }) => {
  const labelId = useId();
  return (
    <div role="group" aria-labelledby={labelId} className={styles.group}>
      <div id={labelId} className={styles.groupLabel}>
        {label}
      </div>
      {children}
    </div>
  );
};

// ─── DropdownSearch ───────────────────────────────────────────────────────────

export interface DropdownSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const DropdownSearch: React.FC<DropdownSearchProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
}) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        role="searchbox"
        aria-label="Buscar opciones"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          // Let Escape propagate so the root Dropdown can close; block all other keys
          if (e.key !== 'Escape') e.stopPropagation();
        }}
      />
    </div>
  );
};

// ─── DropdownItemCheckbox ─────────────────────────────────────────────────────

export interface DropdownItemCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const DropdownItemCheckbox: React.FC<DropdownItemCheckboxProps> = ({
  checked = false,
  onChange,
  icon,
  disabled = false,
  children,
  className,
}) => {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(styles.item, styles.itemCheckbox, className)}
    >
      <span className={styles.checkIndicator} aria-hidden="true">
        {checked ? '✓' : ''}
      </span>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

// ─── DropdownSubmenu ──────────────────────────────────────────────────────────

export interface DropdownSubmenuProps {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export const DropdownSubmenu: React.FC<DropdownSubmenuProps> = ({
  label,
  icon,
  disabled = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const submenuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const openedViaKeyboard = useRef(false);

  const openSubmenu = () => {
    if (!disabled) setIsOpen(true);
  };
  const closeSubmenu = () => setIsOpen(false);

  // Focus first submenu item when opened via keyboard
  useEffect(() => {
    if (!isOpen || !openedViaKeyboard.current) return;
    openedViaKeyboard.current = false;
    const items = submenuRef.current ? getDirectItems(submenuRef.current) : [];
    items[0]?.focus();
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      openedViaKeyboard.current = true;
      openSubmenu();
    }
  };

  const handleSubmenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!submenuRef.current) return;
    const items = getDirectItems(submenuRef.current);
    const idx = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      e.stopPropagation();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      e.stopPropagation();
      items[items.length - 1]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // Prevent the root Dropdown's document-level Escape handler from firing
      e.nativeEvent.stopImmediatePropagation();
      closeSubmenu();
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className={styles.submenuContainer}
      onMouseEnter={openSubmenu}
      onMouseLeave={closeSubmenu}
    >
      <button
        ref={triggerRef}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? submenuId : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(styles.item, styles.submenuTrigger)}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.submenuLabel}>{label}</span>
        <span className={styles.submenuArrow} aria-hidden="true">
          ›
        </span>
      </button>
      {isOpen && (
        <div
          ref={submenuRef}
          id={submenuId}
          role="menu"
          tabIndex={-1}
          aria-label={label}
          className={cn(styles.menu, styles.submenu)}
          onKeyDown={handleSubmenuKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ─── displayNames ─────────────────────────────────────────────────────────────

Dropdown.displayName = 'Dropdown';
DropdownTrigger.displayName = 'DropdownTrigger';
DropdownMenu.displayName = 'DropdownMenu';
DropdownItem.displayName = 'DropdownItem';
DropdownDivider.displayName = 'DropdownDivider';
DropdownGroup.displayName = 'DropdownGroup';
DropdownSearch.displayName = 'DropdownSearch';
DropdownItemCheckbox.displayName = 'DropdownItemCheckbox';
DropdownSubmenu.displayName = 'DropdownSubmenu';
