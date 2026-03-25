import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import styles from './Navbar.module.css';

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
        className={cn(styles.nav, className)}
      >
        <div className={styles.container}>
          {children}

          {/* Hamburger button — mobile only */}
          <button
            id={toggleButtonId}
            type="button"
            aria-expanded={isMobileOpen}
            aria-controls={mobileMenuId}
            aria-label={isMobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={toggleMobile}
            className={styles.hamburger}
          >
            {isMobileOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.hamburgerIcon}
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
                className={styles.hamburgerIcon}
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

  const brandClass = cn(styles.brand, className);

  if (href) {
    return (
      <a href={href} onClick={closeMobile} className={brandClass}>
        {children}
      </a>
    );
  }

  return <span className={brandClass}>{children}</span>;
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
      <ul className={cn(styles.desktopNav, className)}>
        {children}
      </ul>

      {/* Mobile panel */}
      {isMobileOpen && (
        <ul id={mobileMenuId} className={styles.mobilePanel}>
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

  const itemClass = cn(
    styles.navItem,
    active ? styles.navItemActive : styles.navItemDefault,
    disabled && styles.navItemDisabled,
    className
  );

  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    closeMobile();
    onClick?.(e);
  };

  if (href) {
    return (
      <li style={{ display: 'contents' }}>
        <a
          href={href}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={handleClick}
          className={itemClass}
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
        className={itemClass}
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
    <div className={cn(styles.actions, className)}>{children}</div>
  );
};

NavbarActions.displayName = 'NavbarActions';
