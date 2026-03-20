import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

// ─── Context ───────────────────────────────────────────────────────────────

interface NavbarContextValue {
  isMobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  mobileMenuId: string;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

const useNavbar = (): NavbarContextValue => {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error('Navbar sub-components must be used inside <Navbar>');
  return ctx;
};

// ─── Navbar (root) ─────────────────────────────────────────────────────────

export interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ children, className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const instanceId = useId();
  const mobileMenuId = `${instanceId}-mobile-menu`;
  const toggleButtonId = `${instanceId}-toggle`;
  const navRef = useRef<HTMLElement>(null);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMobile();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileOpen]);

  return (
    <NavbarContext.Provider value={{ isMobileOpen, toggleMobile, closeMobile, mobileMenuId }}>
      <nav
        ref={navRef}
        aria-label="Navegación principal"
        className={cn(
          'sticky top-0 z-50 bg-white border-b border-edge',
          className
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {children}

          {/* Hamburger button — mobile only */}
          <button
            id={toggleButtonId}
            type="button"
            aria-expanded={isMobileOpen}
            aria-controls={mobileMenuId}
            aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={toggleMobile}
            className={cn(
              'md:hidden flex items-center justify-center w-9 h-9 rounded-md text-txt-secondary',
              'hover:bg-surface-3 hover:text-txt',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              'transition-colors'
            )}
          >
            {isMobileOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </NavbarContext.Provider>
  );
};

Navbar.displayName = 'Navbar';

// ─── NavbarBrand ────────────────────────────────────────────────────────────

export interface NavbarBrandProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({ children, href, className }) => {
  const { closeMobile } = useNavbar();

  const baseClass = cn(
    'flex items-center gap-2 font-semibold text-sm text-txt shrink-0',
    className
  );

  if (href) {
    return (
      <a href={href} onClick={closeMobile} className={baseClass}>
        {children}
      </a>
    );
  }

  return <span className={baseClass}>{children}</span>;
};

NavbarBrand.displayName = 'NavbarBrand';

// ─── NavbarNav ──────────────────────────────────────────────────────────────

export interface NavbarNavProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarNav: React.FC<NavbarNavProps> = ({ children, className }) => {
  const { isMobileOpen, mobileMenuId } = useNavbar();

  return (
    <>
      {/* Desktop nav */}
      <ul className={cn('hidden md:flex items-center gap-1 list-none', className)}>
        {children}
      </ul>

      {/* Mobile panel */}
      {isMobileOpen && (
        <ul
          id={mobileMenuId}
          className="absolute top-full left-0 right-0 bg-white border-b border-edge shadow-md flex flex-col md:hidden px-4 py-3 gap-1 list-none"
        >
          {children}
        </ul>
      )}
    </>
  );
};

NavbarNav.displayName = 'NavbarNav';

// ─── NavbarItem ─────────────────────────────────────────────────────────────

export interface NavbarItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  href,
  active = false,
  disabled = false,
  className,
  onClick,
}) => {
  const { closeMobile } = useNavbar();

  const baseClass = cn(
    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
    'w-full md:w-auto',
    active
      ? 'bg-surface-3 text-txt'
      : 'text-txt-secondary hover:bg-surface-3 hover:text-txt',
    disabled && 'text-txt-disabled cursor-not-allowed pointer-events-none',
    className
  );

  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    closeMobile();
    onClick?.(e);
  };

  if (href) {
    return (
      <li className="contents">
        <a
          href={href}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={handleClick}
          className={baseClass}
        >
          {children}
        </a>
      </li>
    );
  }

  return (
    <li className="contents">
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        disabled={disabled || undefined}
        onClick={handleClick}
        className={baseClass}
      >
        {children}
      </button>
    </li>
  );
};

NavbarItem.displayName = 'NavbarItem';

// ─── NavbarActions ──────────────────────────────────────────────────────────

export interface NavbarActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({ children, className }) => {
  return (
    <div className={cn('hidden md:flex items-center gap-2', className)}>{children}</div>
  );
};

NavbarActions.displayName = 'NavbarActions';
