import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/cn';
import styles from './Avatar.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  className?: string;
}

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  children: React.ReactNode;
  className?: string;
}

// ─── Style maps ──────────────────────────────────────────────────────────────

type SizeTokens = { container: string; text: string; status: string };

const sizeStyles: Record<AvatarSize, SizeTokens> = {
  xs: { container: styles.xs, text: styles.textXs, status: styles.statusXs },
  sm: { container: styles.sm, text: styles.textSm, status: styles.statusSm },
  md: { container: styles.md, text: styles.textMd, status: styles.statusMd },
  lg: { container: styles.lg, text: styles.textLg, status: styles.statusLg },
  xl: { container: styles.xl, text: styles.textXl, status: styles.statusXl },
};

const shapeStyles: Record<AvatarShape, string> = {
  circle: styles.circle,
  square: styles.square,
};

const statusStyles: Record<AvatarStatus, string> = {
  online:  styles.online,
  offline: styles.offline,
  away:    styles.away,
  busy:    styles.busy,
};

// ─── Initials helpers ─────────────────────────────────────────────────────────

const INITIALS_BG_COLORS = [
  styles.bgPrimary,
  styles.bgSecondary,
  styles.bgDanger,
  styles.bgSuccessText,
  styles.bgWarningText,
  styles.bgInfoText,
  styles.bgSlate,
  styles.bgViolet,
] as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return Math.abs(hash);
}

function getInitialsBg(name: string): string {
  return INITIALS_BG_COLORS[hashName(name) % INITIALS_BG_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── PersonIcon ───────────────────────────────────────────────────────────────

const PersonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
PersonIcon.displayName = 'PersonIcon';

// ─── Avatar ───────────────────────────────────────────────────────────────────

type DisplayMode = 'image' | 'initials' | 'icon';

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      name,
      alt,
      size = 'md',
      shape = 'circle',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = useState(false);

    const displayMode: DisplayMode =
      src && !imgError ? 'image' : name?.trim() ? 'initials' : 'icon';

    const { container, text, status: statusSize } = sizeStyles[size];
    const shapeClass = shapeStyles[shape];

    const initials = name ? getInitials(name) : '';
    const bgClass = name ? getInitialsBg(name) : '';
    const effectiveAlt = alt ?? name ?? 'Avatar';

    return (
      <div
        ref={ref}
        className={cn(styles.avatar, container, className)}
        {...props}
      >
        {/* Inner display */}
        <div
          className={cn(
            styles.inner,
            shapeClass,
            displayMode === 'initials' && cn(bgClass, styles.initials),
            displayMode === 'icon' && styles.icon
          )}
          {...(displayMode !== 'image'
            ? { role: 'img', 'aria-label': effectiveAlt }
            : {})}
        >
          {displayMode === 'image' && (
            <img
              src={src}
              alt={effectiveAlt}
              className={styles.img}
              onError={() => setImgError(true)}
            />
          )}

          {displayMode === 'initials' && (
            <span
              className={cn(styles.initialsText, text)}
              aria-hidden="true"
            >
              {initials}
            </span>
          )}

          {displayMode === 'icon' && <PersonIcon className={styles.personIcon} />}
        </div>

        {/* Status badge */}
        {status && (
          <span
            className={cn(styles.status, statusSize, statusStyles[status])}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max = 4,
  size = 'md',
  children,
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const visible = childArray.slice(0, max);
  const overflow = childArray.length - max;

  return (
    <div role="group" className={cn(styles.group, className)}>
      {visible.map((child, index) => (
        <div
          key={index}
          className={cn(styles.groupItem, index > 0 && styles.groupItemOffset)}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(styles.overflow, sizeStyles[size].container)}
        >
          <div
            className={cn(styles.overflowInner, sizeStyles[size].text)}
            role="img"
            aria-label={`${overflow} más`}
          >
            <span aria-hidden="true">+{overflow}</span>
          </div>
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
