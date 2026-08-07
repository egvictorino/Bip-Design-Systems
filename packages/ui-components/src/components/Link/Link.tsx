import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import { VisuallyHidden } from '../VisuallyHidden/index.js';
import styles from './Link.module.css';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Underline behavior — defaults to always-on underline like native links. */
  underline?: 'always' | 'hover' | 'none';
  /** Opens in a new tab with `rel="noopener noreferrer"` and an accessible hint appended. */
  external?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const underlineClass: Record<NonNullable<LinkProps['underline']>, string | undefined> = {
  always: undefined,
  hover: styles.underlineHover,
  none: styles.underlineNone,
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { underline = 'always', external = false, disabled = false, className, children, ...props },
    ref
  ) => {
    const t = useBipLocale();

    return (
      <a
        ref={ref}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(styles.link, underlineClass[underline], disabled && styles.disabled, className)}
        {...props}
      >
        {children}
        {external && (
          <>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.externalIcon}
              width="0.875em"
              height="0.875em"
              aria-hidden="true"
            >
              <path d="M6.5 3.5h6v6" />
              <path d="M12.5 3.5 3.5 12.5" />
            </svg>
            <VisuallyHidden> {t.link.opensInNewTab}</VisuallyHidden>
          </>
        )}
      </a>
    );
  }
);
Link.displayName = 'Link';
