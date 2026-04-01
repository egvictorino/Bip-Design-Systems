import React from 'react';
import { cn } from '../../lib/cn';
import styles from './Odontogram.module.css';
import {
  CONDITION_FILL_CLASS,
  TOOTH_SIZE,
  TOOTH_NAMES,
  SURFACE_LABELS,
  SURFACES,
  UPPER_POINTS,
  LOWER_POINTS,
} from './types';
import type { ToothData, ToothSurface } from './types';

export interface ToothSVGProps {
  toothNumber: number;
  arch: 'upper' | 'lower';
  data: ToothData;
  size: 'sm' | 'md' | 'lg';
  interactive: boolean;
  onSurfaceClick: (toothNumber: number, surface: ToothSurface) => void;
}

export const ToothSVG = React.memo<ToothSVGProps>(({
  toothNumber,
  arch,
  data,
  size,
  interactive,
  onSurfaceClick,
}) => {
  const points = arch === 'upper' ? UPPER_POINTS : LOWER_POINTS;
  const toothSize = TOOTH_SIZE[size];
  const isMissing = data.condition === 'missing';
  // Any tooth-level condition (not just missing/crown/implant) overrides all surfaces
  const hasToothCondition = data.condition != null;

  const getSurfaceFillClass = (surface: ToothSurface): string => {
    if (hasToothCondition) return CONDITION_FILL_CLASS[data.condition!];
    return CONDITION_FILL_CLASS[data.surfaces?.[surface] ?? 'healthy'];
  };

  const toothLabel = `Diente ${toothNumber}${isMissing ? ' - Ausente' : ''}: ${TOOTH_NAMES[toothNumber] ?? ''}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={toothSize}
      height={toothSize}
      role="img"
      aria-label={toothLabel}
      className={styles.toothSvg}
    >
      {SURFACES.map((surface) => {
        const condition = hasToothCondition
          ? data.condition!
          : (data.surfaces?.[surface] ?? 'healthy');
        const isActive = condition !== 'healthy';
        const canClick = interactive && !isMissing;

        return (
          <polygon
            key={surface}
            points={points[surface]}
            className={cn(
              getSurfaceFillClass(surface),
              styles.surfaceStroke,
              canClick && styles.surfaceInteractive
            )}
            strokeWidth="2"
            aria-label={SURFACE_LABELS[surface]}
            role={interactive ? 'button' : undefined}
            tabIndex={canClick ? 0 : undefined}
            aria-pressed={interactive ? isActive : undefined}
            onClick={canClick ? () => onSurfaceClick(toothNumber, surface) : undefined}
            onKeyDown={
              canClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSurfaceClick(toothNumber, surface);
                    }
                  }
                : undefined
            }
          />
        );
      })}

      {/* X marker for missing tooth */}
      {isMissing && (
        <g aria-hidden="true">
          <line x1="20" y1="20" x2="80" y2="80" strokeWidth="6" strokeLinecap="round" className={styles.missingXLine} />
          <line x1="80" y1="20" x2="20" y2="80" strokeWidth="6" strokeLinecap="round" className={styles.missingXLine} />
        </g>
      )}
    </svg>
  );
});
ToothSVG.displayName = 'ToothSVG';
