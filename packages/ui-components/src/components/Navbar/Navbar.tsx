import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/cn';
import { useClickOutside } from '../../lib/useClickOutside';
import styles from './Navbar.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavbarVariant = 'default' | 'elevated' | 'transparent';

// ─── Context ──────────────────────────────────────────────────────────────────

interface NavbarContextValue {
  isMobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
  mobileMenuId: string;
  toggleButtonId: string;
  variant: NavbarVariant;
  setNavChildren: (node: React.ReactNode) => void;
  setActionsChildren: (node: React.ReactNode) => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

const useNavbar = (): NavbarContextValue => {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error('Navbar sub-components must be used inside <Navbar>');
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const variantClassMap: Record<NavbarVariant, string> = {
  default: styles.variantDefault,
  elevated: styles.variantElevated,
  transparent: styles.variantTransparent,
};

const getNavbarItems = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(
      '[data-navbar-item]:not([disabled]):not([aria-disabled="true"])'
    )
  );

// ─── Navbar (root) ────────────────────────────────────────────────────────────

export interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  variant?: NavbarVariant;
}

export const Navbar: React.FC<NavbarProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navChildren, setNavChildren] = useState<React.ReactNode>(null);
  const [actionsChildren, setActionsChildren] = useState<React.ReactNode>(null);

  const instanceId = useId();
  const mobileMenuId = `${instanceId}-mobile-menu`;
  const toggleButtonId = `${instanceId}-toggle`;
  const navRef = useRef<HTMLElement>(null);
  const prevMobileOpenRef = useRef(false);

  const toggleMobile = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  // Escape to close
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  // Outside click to close
  useClickOutside(navRef, closeMobile, isMobileOpen);

  // Focus management: open → focus first mobile item, close → focus hamburger
  useEffect(() => {
    if (isMobileOpen) {
      requestAnimationFrame(() => {
        const panel = document.getElementById(mobileMenuId);
        if (panel) {
          const items = getNavbarItems(panel);
          if (items.length > 0) items[0].focus();
        }
      });
    } else if (prevMobileOpenRef.current) {
      const toggleBtn = document.getElementById(toggleButtonId);
      toggleBtn?.focus();
    }
    prevMobileOpenRef.current = isMobileOpen;
  }, [isMobileOpen, mobileMenuId, toggleButtonId]);

  return (
    <NavbarContext.Provider
      value={{
        isMobileOpen,
        toggleMobile,
        closeMobile,
        mobileMenuId,
        toggleButtonId,
        variant,
        setNavChildren,
        setActionsChildren,
      }}
    >
      {/* Overlay / scrim — mobile only */}
      {isMobileOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          data-testid="navbar-overlay"
          className={styles.overlay}
          onClick={closeMobile}
        />
      )}

      <nav
        ref={navRef}
        aria-label="Navegación principal"
        className={cn(styles.nav, variantClassMap[variant], className)}
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

        {/* Mobile panel — always rendered for animation */}
        <div
          id={mobileMenuId}
          className={cn(styles.mobilePanel, isMobileOpen && styles.mobilePanelOpen)}
          aria-hidden={!isMobileOpen}
        >
          <ul className={styles.mobileNavList}>{navChildren}</ul>
          {actionsChildren && (
            <div className={styles.mobileActions}>{actionsChildren}</div>
          )}
        </div>
      </nav>
    </NavbarContext.Provider>
  );
};

Navbar.displayName = 'Navbar';

// ─── NavbarBrand ──────────────────────────────────────────────────────────────

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

// ─── NavbarNav ────────────────────────────────────────────────────────────────

export interface NavbarNavProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarNav: React.FC<NavbarNavProps> = ({ children, className }) => {
  const { setNavChildren } = useNavbar();

  // Register children for the mobile panel rendered by Navbar root
  useLayoutEffect(() => {
    setNavChildren(children);
    return () => setNavChildren(null);
  }, [children, setNavChildren]);

  return (
    <ul className={cn(styles.desktopNav, className)}>
      {children}
    </ul>
  );
};

NavbarNav.displayName = 'NavbarNav';

// ─── NavbarItem ───────────────────────────────────────────────────────────────

export interface NavbarItemProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  'aria-label'?: string;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  icon,
  href,
  active = false,
  disabled = false,
  className,
  onClick,
  'aria-label': ariaLabel,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const list = e.currentTarget.closest('ul');
    if (!list) return;

    const items = getNavbarItems(list);
    const currentIndex = items.indexOf(e.currentTarget as HTMLElement);
    if (currentIndex === -1) return;

    // Desktop (desktopNav): ArrowLeft/ArrowRight | Mobile (mobileNavList): ArrowUp/ArrowDown
    const isMobile = list.id !== '';
    const prevKey = isMobile ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = isMobile ? 'ArrowDown' : 'ArrowRight';

    let nextIndex = currentIndex;

    if (e.key === nextKey) {
      nextIndex = (currentIndex + 1) % items.length;
      e.preventDefault();
    } else if (e.key === prevKey) {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex) {
      items[nextIndex].focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const list = e.currentTarget.closest('ul');
    if (!list) return;
    const items = getNavbarItems(list);
    items.forEach((item) => {
      item.setAttribute('tabindex', item === e.currentTarget ? '0' : '-1');
    });
  };

  const content = (
    <>
      {icon && (
        <span className={styles.navItemIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <li style={{ display: 'contents' }}>
        <a
          href={href}
          data-navbar-item=""
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          aria-label={ariaLabel}
          tabIndex={disabled ? -1 : undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={itemClass}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li style={{ display: 'contents' }}>
      <button
        type="button"
        data-navbar-item=""
        aria-current={active ? 'page' : undefined}
        aria-label={ariaLabel}
        disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={itemClass}
      >
        {content}
      </button>
    </li>
  );
};

NavbarItem.displayName = 'NavbarItem';

// ─── NavbarActions ────────────────────────────────────────────────────────────

export interface NavbarActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({ children, className }) => {
  const { setActionsChildren } = useNavbar();

  // Register children for the mobile panel rendered by Navbar root
  useLayoutEffect(() => {
    setActionsChildren(children);
    return () => setActionsChildren(null);
  }, [children, setActionsChildren]);

  return <div className={cn(styles.actions, className)}>{children}</div>;
};

NavbarActions.displayName = 'NavbarActions';
