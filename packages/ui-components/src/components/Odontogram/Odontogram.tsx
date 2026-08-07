"use client";

import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Odontogram.module.css';
import {
  EMPTY_TOOTH,
  LOWER_LEFT,
  LOWER_RIGHT,
  NUMBER_TEXT_SIZE_CLASS,
  PRIMARY_LOWER_LEFT,
  PRIMARY_LOWER_RIGHT,
  PRIMARY_UPPER_LEFT,
  PRIMARY_UPPER_RIGHT,
  UPPER_LEFT,
  UPPER_RIGHT,
} from './types.js';
import type { OdontogramProps, ToothData } from './types.js';
import { ToothSVG } from './ToothSVG.js';
import { ToothDetail } from './ToothDetail.js';

// Re-export public API so consumers can import from './Odontogram.js' or from 'index.ts'
export type {
  OdontogramProps,
  OdontogramValue,
  ToothData,
  ToothCondition,
  ToothSurface,
  SurfaceCondition,
  DentitionMode,
  ToothImageType,
  ToothImage,
} from './types.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the arch for a given FDI tooth number (upper = quadrants 1,2,5,6) */
const getArch = (toothNumber: number): 'upper' | 'lower' => {
  const quadrant = Math.floor(toothNumber / 10);
  return quadrant === 1 || quadrant === 2 || quadrant === 5 || quadrant === 6 ? 'upper' : 'lower';
};

// ─── Odontogram ──────────────────────────────────────────────────────────────

export const Odontogram = forwardRef<HTMLDivElement, OdontogramProps>(
  (
    {
      value = {},
      onChange,
      readOnly = false,
      dentition = 'permanent',
      label,
      size = 'md',
      className,
    },
    ref
  ) => {
    const t = useBipLocale();
    const generatedId = useId();
    const labelId = label ? generatedId : undefined;
    const interactive = !readOnly && onChange != null;

    // Refs keep latest values so callbacks can have empty deps (stable references)
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const valueRef = useRef(value);
    valueRef.current = value;

    // Selected tooth state
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const selectedToothRef = useRef(selectedTooth);
    selectedToothRef.current = selectedTooth;

    const handleToothSelect = useCallback((toothNumber: number) => {
      setSelectedTooth((prev) => (prev === toothNumber ? null : toothNumber));
    }, []);

    const handleToothDetailChange = useCallback((toothData: ToothData) => {
      const currentOnChange = onChangeRef.current;
      const currentSelectedTooth = selectedToothRef.current;
      const currentValue = valueRef.current;
      if (!currentOnChange || currentSelectedTooth === null) return;

      if (Object.keys(toothData).length === 0) {
        const next = { ...currentValue };
        delete next[currentSelectedTooth];
        currentOnChange(next);
      } else {
        currentOnChange({ ...currentValue, [currentSelectedTooth]: toothData });
      }
    }, []); // empty deps — reads latest values via refs

    const handleDetailClose = useCallback(() => {
      setSelectedTooth(null);
    }, []);

    const isPrimary = dentition === 'primary';
    const upperRight = isPrimary ? PRIMARY_UPPER_RIGHT : UPPER_RIGHT;
    const upperLeft = isPrimary ? PRIMARY_UPPER_LEFT : UPPER_LEFT;
    const lowerRight = isPrimary ? PRIMARY_LOWER_RIGHT : LOWER_RIGHT;
    const lowerLeft = isPrimary ? PRIMARY_LOWER_LEFT : LOWER_LEFT;

    const renderTooth = (toothNumber: number, arch: 'upper' | 'lower') => {
      const isSelected = selectedTooth === toothNumber;

      const numberEl = (
        <span className={cn(styles.numberSpan, NUMBER_TEXT_SIZE_CLASS[size])}>{toothNumber}</span>
      );

      const numberRow = (
        <div className={arch === 'upper' ? styles.numberRowUpper : styles.numberRowLower}>
          {numberEl}
        </div>
      );

      const svgEl = (
        <ToothSVG
          toothNumber={toothNumber}
          arch={arch}
          data={value[toothNumber] ?? EMPTY_TOOTH}
          size={size}
          interactive={false}
          onSurfaceClick={() => {}}
        />
      );

      if (interactive) {
        return (
          <button
            key={toothNumber}
            className={cn(
              styles.toothCell,
              styles.toothCellButton,
              isSelected && styles.toothSelected
            )}
            onClick={() => handleToothSelect(toothNumber)}
            aria-label={t.odontogram.selectTooth(toothNumber, isSelected)}
            aria-pressed={isSelected}
          >
            {arch === 'lower' && numberRow}
            {svgEl}
            {arch === 'upper' && numberRow}
          </button>
        );
      }

      return (
        <div key={toothNumber} className={styles.toothCell}>
          {arch === 'lower' && numberRow}
          {svgEl}
          {arch === 'upper' && numberRow}
        </div>
      );
    };

    const renderArch = (left: number[], right: number[], arch: 'upper' | 'lower') => (
      <div className={styles.arch}>
        <div className={styles.archSection}>{left.map((n) => renderTooth(n, arch))}</div>
        <div className={styles.archDivider} aria-hidden="true" />
        <div className={styles.archSection}>{right.map((n) => renderTooth(n, arch))}</div>
      </div>
    );

    return (
      <div ref={ref} role="group" aria-labelledby={labelId} className={cn(styles.root, className)}>
        {label && (
          <span id={labelId} className={styles.label}>
            {label}
          </span>
        )}
        <div className={styles.chart}>
          {renderArch(upperRight, upperLeft, 'upper')}
          <div className={styles.midline} aria-hidden="true" />
          {renderArch(lowerRight, lowerLeft, 'lower')}
        </div>
        {selectedTooth !== null && (
          <ToothDetail
            toothNumber={selectedTooth}
            arch={getArch(selectedTooth)}
            data={value[selectedTooth] ?? EMPTY_TOOTH}
            readOnly={!interactive}
            onChange={handleToothDetailChange}
            onClose={handleDetailClose}
          />
        )}
      </div>
    );
  }
);
Odontogram.displayName = 'Odontogram';
