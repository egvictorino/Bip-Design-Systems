import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

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
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

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
      <div ref={containerRef} className={cn('relative inline-block', className)}>
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

const placementStyles: Record<NonNullable<DropdownMenuProps['placement']>, string> = {
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
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
    if (!isOpen) return;
    const firstItem = menuRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([disabled])'
    );
    firstItem?.focus();
  }, [isOpen]);

  // Arrow key navigation between items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []
    );
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
      className={cn(
        'absolute z-50 min-w-[160px] rounded-md border border-interaction-tertiary-default bg-white py-1 shadow-md',
        placementStyles[placement],
        className
      )}
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
      className={cn(
        'flex w-full items-center gap-2 px-4 py-2 text-sm text-left transition-colors',
        'focus:outline-none focus-visible:bg-interaction-tertiary-default',
        danger
          ? 'text-feedback-error-default hover:bg-feedback-error-light focus-visible:bg-feedback-error-light'
          : 'text-text-primary hover:bg-interaction-tertiary-default',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
      role="menuitem"
    >
      {icon && (
        <span className="flex shrink-0 items-center justify-center w-4 h-4" aria-hidden="true">
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
    className="my-1 border-t border-interaction-tertiary-default"
  />
);

Dropdown.displayName = 'Dropdown';
DropdownTrigger.displayName = 'DropdownTrigger';
DropdownMenu.displayName = 'DropdownMenu';
DropdownItem.displayName = 'DropdownItem';
DropdownDivider.displayName = 'DropdownDivider';
