import React, { useCallback, useRef, useState } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './ToothDetail.module.css';
import {
  CONDITION_LABELS,
  EMPTY_TOOTH,
  TOOTH_NAMES,
  WHOLE_TOOTH_CONDITIONS,
} from './types.js';
import type {
  SurfaceCondition,
  ToothCondition,
  ToothData,
  ToothImage,
  ToothSurface,
} from './types.js';
import { ToothSVG } from './ToothSVG.js';
import { NotePopover } from './NotePopover.js';
import { ImagePopover } from './ImagePopover.js';

export interface ToothDetailProps {
  toothNumber: number;
  arch: 'upper' | 'lower';
  data: ToothData;
  readOnly: boolean;
  onChange: (data: ToothData) => void;
  onClose: () => void;
}

export const ToothDetail = React.memo<ToothDetailProps>(
  ({ toothNumber, arch, data, readOnly, onChange, onClose }) => {
    const [activeTool, setActiveTool] = useState<ToothCondition>('caries');

    // Note popover state
    const [noteOpen, setNoteOpen] = useState(false);
    const [notePos, setNotePos] = useState<{ top: number; left: number } | null>(null);
    const noteTriggerRef = useRef<HTMLButtonElement | null>(null);

    // Image popover state
    const [imageOpen, setImageOpen] = useState(false);
    const [imagePos, setImagePos] = useState<{ top: number; left: number } | null>(null);
    const imageTriggerRef = useRef<HTMLButtonElement | null>(null);

    // Refs for stable callbacks
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const dataRef = useRef(data);
    dataRef.current = data;
    const activeToolRef = useRef(activeTool);
    activeToolRef.current = activeTool;

    const handleSurfaceClick = useCallback((_toothNumber: number, surface: ToothSurface) => {
      const current = dataRef.current ?? EMPTY_TOOTH;
      const currentActiveTool = activeToolRef.current;

      if (WHOLE_TOOTH_CONDITIONS.has(currentActiveTool)) {
        onChangeRef.current({ ...current, condition: currentActiveTool, surfaces: {} });
      } else {
        const hadWholeTooth = current.condition != null;
        const baseSurfaces = hadWholeTooth ? {} : (current.surfaces ?? {});
        const newSurfaces: SurfaceCondition = { ...baseSurfaces };

        if (currentActiveTool === 'healthy') {
          delete newSurfaces[surface];
        } else {
          newSurfaces[surface] = currentActiveTool;
        }

        onChangeRef.current({
          ...current,
          condition: hadWholeTooth ? undefined : current.condition,
          surfaces: newSurfaces,
        });
      }
    }, []); // empty deps — reads latest values via refs

    const handleNoteOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      noteTriggerRef.current = el;
      setNoteOpen(true);
      setNotePos({ top: rect.bottom + 4, left: rect.left });
    }, []);

    const handleNoteClose = useCallback(() => {
      setNoteOpen(false);
      setNotePos(null);
      noteTriggerRef.current?.focus();
    }, []);

    const handleNoteSave = useCallback((note: string) => {
      const current = dataRef.current ?? {};
      const trimmed = note.trim();
      const { notes: _omitted, ...rest } = current;
      const updated: ToothData = trimmed ? { ...rest, notes: trimmed } : rest;
      onChangeRef.current(updated);
      setNoteOpen(false);
      setNotePos(null);
      noteTriggerRef.current?.focus();
    }, []); // empty deps — reads latest values via refs

    const handleImageOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      imageTriggerRef.current = el;
      setImageOpen(true);
      setImagePos({ top: rect.bottom + 4, left: rect.left });
    }, []);

    const handleImageClose = useCallback(() => {
      setImageOpen(false);
      setImagePos(null);
      imageTriggerRef.current?.focus();
    }, []);

    const handleImageSave = useCallback((images: ToothImage[]) => {
      const current = { ...(dataRef.current ?? {}) };
      if (images.length > 0) {
        current.images = images;
      } else {
        delete current.images;
      }
      onChangeRef.current(current);
    }, []); // empty deps — reads latest values via refs

    const conditions = Object.entries(CONDITION_LABELS) as [ToothCondition, string][];
    const toothName = TOOTH_NAMES[toothNumber] ?? '';
    const imageCount = data.images?.length ?? 0;
    const hasNote = Boolean(data.notes);

    return (
      <div className={styles.detailPanel} data-testid="tooth-detail-panel">
        {/* Header */}
        <div className={styles.detailHeader}>
          <span className={styles.detailTitle}>
            Diente {toothNumber}
            {toothName && <span className={styles.detailSubtitle}> — {toothName}</span>}
          </span>
          <button onClick={onClose} aria-label="Cerrar detalle" className={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.detailBody}>
          {/* Left: large tooth SVG */}
          <div className={styles.detailLeft}>
            <ToothSVG
              toothNumber={toothNumber}
              arch={arch}
              data={data}
              size="xl"
              interactive={!readOnly}
              onSurfaceClick={handleSurfaceClick}
            />
            <span className={styles.detailToothLabel}>{toothNumber}</span>
          </div>

          {/* Right: controls */}
          <div className={styles.detailRight}>
            {/* Condition toolbar (edit mode only) */}
            {!readOnly && (
              <div className={styles.conditionToolbar} role="group" aria-label="Condiciones">
                {conditions.map(([condition, label]) => (
                  <button
                    key={condition}
                    onClick={() => setActiveTool(condition)}
                    aria-pressed={activeTool === condition}
                    className={cn(
                      styles.conditionButton,
                      activeTool === condition && styles.conditionButtonActive
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Condition badge (readOnly) */}
            {readOnly && data.condition && (
              <span className={styles.conditionBadge}>{CONDITION_LABELS[data.condition]}</span>
            )}

            <div className={styles.divider} aria-hidden="true" />

            {/* Actions */}
            <div className={styles.actionsRow}>
              <button
                onClick={handleNoteOpen}
                className={cn(styles.actionButton, hasNote && styles.actionButtonActive)}
                aria-label={`Nota del diente ${toothNumber}${hasNote ? ' — tiene nota' : ''}`}
              >
                {/* Note icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.actionIcon}
                >
                  <path d="M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                  <path d="M5 6h6M5 9h6M5 12h3" />
                </svg>
                Nota
                {hasNote && <span aria-hidden="true" className={styles.actionDot} />}
              </button>

              <button
                onClick={handleImageOpen}
                className={cn(styles.actionButton, imageCount > 0 && styles.actionButtonActive)}
                aria-label={`Imágenes del diente ${toothNumber}${imageCount > 0 ? ` — ${imageCount} imagen${imageCount > 1 ? 'es' : ''}` : ''}`}
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
                  className={styles.actionIcon}
                >
                  <path d="M1 5.5A1.5 1.5 0 0 1 2.5 4h.535l.707-1.414A1 1 0 0 1 4.638 2h6.724a1 1 0 0 1 .896.553L13 4h.5A1.5 1.5 0 0 1 15 5.5v7A1.5 1.5 0 0 1 13.5 14h-11A1.5 1.5 0 0 1 1 12.5v-7Z" />
                  <circle cx="8" cy="9" r="2.5" />
                </svg>
                Imágenes{imageCount > 0 && ` (${imageCount})`}
                {imageCount > 0 && <span aria-hidden="true" className={styles.actionDot} />}
              </button>
            </div>
          </div>
        </div>

        {/* Note popover */}
        {noteOpen && notePos && (
          <NotePopover
            toothNumber={toothNumber}
            initialNote={data.notes ?? ''}
            editable={!readOnly}
            position={notePos}
            onClose={handleNoteClose}
            onSave={handleNoteSave}
          />
        )}

        {/* Image popover */}
        {imageOpen && imagePos && (
          <ImagePopover
            toothNumber={toothNumber}
            initialImages={data.images ?? []}
            editable={!readOnly}
            position={imagePos}
            onClose={handleImageClose}
            onSave={handleImageSave}
          />
        )}
      </div>
    );
  }
);
ToothDetail.displayName = 'ToothDetail';
