import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/cn';

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

type SizeTokens = { container: string; text: string; status: string; statusPos: string };

const sizeStyles: Record<AvatarSize, SizeTokens> = {
  xs: { container: 'w-6 h-6',   text: 'text-[10px]', status: 'w-2 h-2',     statusPos: '-bottom-0.5 -right-0.5' },
  sm: { container: 'w-8 h-8',   text: 'text-xs',     status: 'w-2.5 h-2.5', statusPos: '-bottom-0.5 -right-0.5' },
  md: { container: 'w-10 h-10', text: 'text-sm',     status: 'w-3 h-3',     statusPos: 'bottom-0 right-0' },
  lg: { container: 'w-12 h-12', text: 'text-base',   status: 'w-3.5 h-3.5', statusPos: 'bottom-0 right-0' },
  xl: { container: 'w-16 h-16', text: 'text-xl',     status: 'w-4 h-4',     statusPos: 'bottom-0.5 right-0.5' },
};

const shapeStyles: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

const statusStyles: Record<AvatarStatus, string> = {
  online:  'bg-success',
  offline: 'bg-txt-disabled',
  away:    'bg-warning',
  busy:    'bg-danger',
};

// ─── Initials helpers ─────────────────────────────────────────────────────────

// 8 dark background colors that provide sufficient contrast for white text
const INITIALS_BG_COLORS = [
  'bg-primary',
  'bg-secondary',
  'bg-danger',
  'bg-success-text',
  'bg-warning-text',
  'bg-info-text',
  'bg-slate-500',
  'bg-violet-600',
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

    const { container, text, status: statusSize, statusPos } = sizeStyles[size];
    const shapeClass = shapeStyles[shape];

    const initials = name ? getInitials(name) : '';
    const bgClass = name ? getInitialsBg(name) : '';
    const effectiveAlt = alt ?? name ?? 'Avatar';

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', container, className)}
        {...props}
      >
        {/* Inner display */}
        <div
          className={cn(
            'flex h-full w-full items-center justify-center overflow-hidden',
            shapeClass,
            displayMode === 'initials' && cn(bgClass, 'text-txt-white'),
            displayMode === 'icon' && 'bg-surface-3 text-txt-secondary'
          )}
          {...(displayMode !== 'image'
            ? { role: 'img', 'aria-label': effectiveAlt }
            : {})}
        >
          {displayMode === 'image' && (
            <img
              src={src}
              alt={effectiveAlt}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {displayMode === 'initials' && (
            <span
              className={cn('select-none font-semibold leading-none', text)}
              aria-hidden="true"
            >
              {initials}
            </span>
          )}

          {displayMode === 'icon' && <PersonIcon className="h-[60%] w-[60%]" />}
        </div>

        {/* Status badge */}
        {status && (
          <span
            className={cn(
              'absolute rounded-full ring-2 ring-white',
              statusSize,
              statusPos,
              statusStyles[status]
            )}
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
    <div role="group" className={cn('flex items-center', className)}>
      {visible.map((child, index) => (
        <div
          key={index}
          className={cn('ring-2 ring-white rounded-full', index > 0 && '-ml-2')}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            'relative inline-flex shrink-0 -ml-2',
            sizeStyles[size].container
          )}
        >
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full',
              'bg-surface-3 text-txt-secondary ring-2 ring-white font-semibold',
              sizeStyles[size].text
            )}
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
