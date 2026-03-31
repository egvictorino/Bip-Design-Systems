import React, { forwardRef, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
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
  WHOLE_TOOTH_CONDITIONS,
} from './types';
import type {
  OdontogramProps,
  SurfaceCondition,
  ToothData,
  ToothImage,
  ToothSurface,
} from './types';
import { NotePopover } from './NotePopover';
import { ImagePopover } from './ImagePopover';
import { ToothSVG } from './ToothSVG';

// Re-export public API so consumers can import from './Odontogram' or from 'index.ts'
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
} from './types';
export { CONDITION_LABELS } from './types';

// ─── Odontogram ──────────────────────────────────────────────────────────────

export const Odontogram = forwardRef<HTMLDivElement, OdontogramProps>(
  (
    {
      value = {},
      onChange,
      readOnly = false,
      activeTool = 'caries',
      dentition = 'permanent',
      label,
      size = 'md',
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const labelId = label ? generatedId : undefined;
    const interactive = !readOnly && onChange != null;

    // Refs keep latest values so callbacks can have empty deps (stable references)
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const valueRef = useRef(value);
    valueRef.current = value;
    const activeToolRef = useRef(activeTool);
    activeToolRef.current = activeTool;

    // Note popover state
    const [openNoteTooth, setOpenNoteTooth] = useState<number | null>(null);
    const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
    const popoverTriggerRef = useRef<HTMLButtonElement | null>(null);
    const openNoteToothRef = useRef(openNoteTooth);
    openNoteToothRef.current = openNoteTooth;

    // Image popover state
    const [imageState, setImageState] = useState<{
      toothNumber: number;
      position: { top: number; left: number };
    } | null>(null);
    const imageTriggerRef = useRef<HTMLButtonElement | null>(null);
    const imageStateRef = useRef(imageState);
    imageStateRef.current = imageState;

    const handleSurfaceClick = useCallback((toothNumber: number, surface: ToothSurface) => {
      const currentOnChange = onChangeRef.current;
      if (!currentOnChange) return;
      const currentValue = valueRef.current;
      const currentActiveTool = activeToolRef.current;
      const current = currentValue[toothNumber] ?? EMPTY_TOOTH;

      if (WHOLE_TOOTH_CONDITIONS.has(currentActiveTool)) {
        // Whole-tooth conditions override everything
        currentOnChange({
          ...currentValue,
          [toothNumber]: { ...current, condition: currentActiveTool, surfaces: {} },
        });
      } else {
        // Surface-level condition; clear whole-tooth condition if one was set
        const hadWholeTooth = current.condition != null;
        const baseSurfaces = hadWholeTooth ? {} : (current.surfaces ?? {});
        const newSurfaces: SurfaceCondition = { ...baseSurfaces };

        if (currentActiveTool === 'healthy') {
          delete newSurfaces[surface];
        } else {
          newSurfaces[surface] = currentActiveTool;
        }

        currentOnChange({
          ...currentValue,
          [toothNumber]: {
            ...current,
            condition: hadWholeTooth ? undefined : current.condition,
            surfaces: newSurfaces,
          },
        });
      }
    }, []); // empty deps — reads latest values via refs

    const handleNoteOpen = useCallback((toothNumber: number, el: HTMLButtonElement) => {
      const rect = el.getBoundingClientRect();
      popoverTriggerRef.current = el;
      setOpenNoteTooth(toothNumber);
      setPopoverPos({ top: rect.bottom + 4, left: rect.left });
    }, []);

    const handleNoteClose = useCallback(() => {
      setOpenNoteTooth(null);
      setPopoverPos(null);
      popoverTriggerRef.current?.focus();
    }, []);

    const handleNoteSave = useCallback((note: string) => {
      const currentOnChange = onChangeRef.current;
      const currentOpenTooth = openNoteToothRef.current;
      if (currentOnChange && currentOpenTooth !== null) {
        const trimmed = note.trim();
        const current = valueRef.current[currentOpenTooth] ?? {};
        const { notes: _omitted, ...rest } = current;
        const updated: ToothData = trimmed ? { ...rest, notes: trimmed } : rest;
        currentOnChange({ ...valueRef.current, [currentOpenTooth]: updated });
      }
      setOpenNoteTooth(null);
      setPopoverPos(null);
      popoverTriggerRef.current?.focus();
    }, []); // empty deps — reads latest values via refs

    const handleImageOpen = useCallback((toothNumber: number, el: HTMLButtonElement) => {
      const rect = el.getBoundingClientRect();
      imageTriggerRef.current = el;
      setImageState({ toothNumber, position: { top: rect.bottom + 4, left: rect.left } });
    }, []);

    const handleImageClose = useCallback(() => {
      setImageState(null);
      imageTriggerRef.current?.focus();
    }, []);

    const handleImageSave = useCallback((images: ToothImage[]) => {
      const currentOnChange = onChangeRef.current;
      const toothNumber = imageStateRef.current?.toothNumber;
      if (currentOnChange && toothNumber != null) {
        const current = { ...(valueRef.current[toothNumber] ?? {}) };
        if (images.length > 0) {
          current.images = images;
        } else {
          delete current.images;
        }
        if (Object.keys(current).length === 0) {
          const next = { ...valueRef.current };
          delete next[toothNumber];
          currentOnChange(next);
        } else {
          currentOnChange({ ...valueRef.current, [toothNumber]: current });
        }
      }
    }, []); // empty deps — reads latest values via refs

    const isPrimary = dentition === 'primary';
    const upperRight = isPrimary ? PRIMARY_UPPER_RIGHT : UPPER_RIGHT;
    const upperLeft = isPrimary ? PRIMARY_UPPER_LEFT : UPPER_LEFT;
    const lowerRight = isPrimary ? PRIMARY_LOWER_RIGHT : LOWER_RIGHT;
    const lowerLeft = isPrimary ? PRIMARY_LOWER_LEFT : LOWER_LEFT;

    const renderTooth = (toothNumber: number, arch: 'upper' | 'lower') => {
      const hasNote = Boolean(value[toothNumber]?.notes);
      const imageCount = value[toothNumber]?.images?.length ?? 0;
      const hasImages = imageCount > 0;
      // Show note button if interactive (can edit) or if there's a note to view
      const showNoteButton = interactive || hasNote;
      // Show image button if interactive (can upload) or if there are images to view
      const showImageButton = interactive || hasImages;

      const noteButton = showNoteButton ? (
        <button
          onClick={(e) => handleNoteOpen(toothNumber, e.currentTarget)}
          aria-label={`Nota del diente ${toothNumber}${hasNote ? ' — tiene nota' : ''}`}
          className={cn(styles.numberButton, NUMBER_TEXT_SIZE_CLASS[size])}
        >
          {toothNumber}
          {hasNote && (
            <span
              aria-hidden="true"
              className={styles.noteDot}
            />
          )}
        </button>
      ) : (
        <span className={cn(styles.numberSpan, NUMBER_TEXT_SIZE_CLASS[size])}>
          {toothNumber}
        </span>
      );

      const imageButton = showImageButton ? (
        <button
          onClick={(e) => handleImageOpen(toothNumber, e.currentTarget)}
          aria-label={`Imágenes del diente ${toothNumber}${hasImages ? ` — ${imageCount} imagen${imageCount > 1 ? 'es' : ''}` : ''}`}
          className={styles.imageButton}
        >
          {/* Camera icon */}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.iconCamera}
          >
            <path d="M1 5.5A1.5 1.5 0 0 1 2.5 4h.535l.707-1.414A1 1 0 0 1 4.638 2h6.724a1 1 0 0 1 .896.553L13 4h.5A1.5 1.5 0 0 1 15 5.5v7A1.5 1.5 0 0 1 13.5 14h-11A1.5 1.5 0 0 1 1 12.5v-7Z" />
            <circle cx="8" cy="9" r="2.5" />
          </svg>
          {hasImages && (
            <span
              aria-hidden="true"
              className={styles.imageDot}
            />
          )}
        </button>
      ) : null;

      const numberRow = (
        <div className={arch === 'upper' ? styles.numberRowUpper : styles.numberRowLower}>
          {noteButton}
          {imageButton}
        </div>
      );

      return (
        <div key={toothNumber} className={styles.toothCell}>
          {arch === 'lower' && numberRow}
          <ToothSVG
            toothNumber={toothNumber}
            arch={arch}
            data={value[toothNumber] ?? EMPTY_TOOTH}
            size={size}
            interactive={interactive}
            onSurfaceClick={handleSurfaceClick}
          />
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
        {openNoteTooth !== null && popoverPos !== null && (
          <NotePopover
            toothNumber={openNoteTooth}
            initialNote={value[openNoteTooth]?.notes ?? ''}
            editable={interactive}
            position={popoverPos}
            onClose={handleNoteClose}
            onSave={handleNoteSave}
          />
        )}
        {imageState !== null && (
          <ImagePopover
            toothNumber={imageState.toothNumber}
            initialImages={value[imageState.toothNumber]?.images ?? []}
            editable={interactive}
            position={imageState.position}
            onClose={handleImageClose}
            onSave={handleImageSave}
          />
        )}
      </div>
    );
  }
);
Odontogram.displayName = 'Odontogram';
