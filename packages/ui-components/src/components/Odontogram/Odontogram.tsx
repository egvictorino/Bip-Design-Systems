import React, { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';

export type ToothSurface = 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual';

export type DentitionMode = 'permanent' | 'primary';

export type ToothCondition =
  | 'healthy'
  | 'caries'
  | 'restoration'
  | 'crown'
  | 'missing'
  | 'implant'
  | 'fracture'
  | 'root_canal'
  | 'extraction_planned';

export type SurfaceCondition = Partial<Record<ToothSurface, ToothCondition>>;

export interface ToothData {
  condition?: ToothCondition;
  surfaces?: SurfaceCondition;
  notes?: string;
}

export type OdontogramValue = Record<number, ToothData>;

export interface OdontogramProps {
  value?: OdontogramValue;
  onChange?: (value: OdontogramValue) => void;
  readOnly?: boolean;
  /** Condition applied when clicking a surface (interactive mode) */
  activeTool?: ToothCondition;
  /** Dentition mode: permanent (default, 32 teeth FDI 11-48) or primary (20 teeth FDI 51-85) */
  dentition?: DentitionMode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CONDITION_FILL: Record<ToothCondition, string> = {
  healthy: 'fill-white',
  caries: 'fill-red-400',
  restoration: 'fill-blue-400',
  crown: 'fill-yellow-400',
  missing: 'fill-gray-300',
  implant: 'fill-purple-400',
  fracture: 'fill-orange-400',
  root_canal: 'fill-teal-400',
  extraction_planned: 'fill-red-200',
};

export const CONDITION_LABELS: Record<ToothCondition, string> = {
  healthy: 'Sano',
  caries: 'Caries',
  restoration: 'Restauración',
  crown: 'Corona',
  missing: 'Ausente',
  implant: 'Implante',
  fracture: 'Fractura',
  root_canal: 'Endodoncia',
  extraction_planned: 'Extracción planeada',
};

const TOOTH_SIZE: Record<'sm' | 'md' | 'lg', number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const NUMBER_TEXT_SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[7px]',
  md: 'text-[9px]',
  lg: 'text-[10px]',
};

/** Conditions that apply to the whole tooth, not per surface */
const WHOLE_TOOTH_CONDITIONS = new Set<ToothCondition>(['missing', 'crown', 'implant']);

const TOOTH_NAMES: Record<number, string> = {
  11: 'Incisivo central superior derecho',
  12: 'Incisivo lateral superior derecho',
  13: 'Canino superior derecho',
  14: 'Primer premolar superior derecho',
  15: 'Segundo premolar superior derecho',
  16: 'Primer molar superior derecho',
  17: 'Segundo molar superior derecho',
  18: 'Tercer molar superior derecho',
  21: 'Incisivo central superior izquierdo',
  22: 'Incisivo lateral superior izquierdo',
  23: 'Canino superior izquierdo',
  24: 'Primer premolar superior izquierdo',
  25: 'Segundo premolar superior izquierdo',
  26: 'Primer molar superior izquierdo',
  27: 'Segundo molar superior izquierdo',
  28: 'Tercer molar superior izquierdo',
  31: 'Incisivo central inferior izquierdo',
  32: 'Incisivo lateral inferior izquierdo',
  33: 'Canino inferior izquierdo',
  34: 'Primer premolar inferior izquierdo',
  35: 'Segundo premolar inferior izquierdo',
  36: 'Primer molar inferior izquierdo',
  37: 'Segundo molar inferior izquierdo',
  38: 'Tercer molar inferior izquierdo',
  41: 'Incisivo central inferior derecho',
  42: 'Incisivo lateral inferior derecho',
  43: 'Canino inferior derecho',
  44: 'Primer premolar inferior derecho',
  45: 'Segundo premolar inferior derecho',
  46: 'Primer molar inferior derecho',
  47: 'Segundo molar inferior derecho',
  48: 'Tercer molar inferior derecho',
  // Cuadrante 5 — Superior derecho primario
  55: 'Segundo molar temporal superior derecho',
  54: 'Primer molar temporal superior derecho',
  53: 'Canino temporal superior derecho',
  52: 'Incisivo lateral temporal superior derecho',
  51: 'Incisivo central temporal superior derecho',
  // Cuadrante 6 — Superior izquierdo primario
  61: 'Incisivo central temporal superior izquierdo',
  62: 'Incisivo lateral temporal superior izquierdo',
  63: 'Canino temporal superior izquierdo',
  64: 'Primer molar temporal superior izquierdo',
  65: 'Segundo molar temporal superior izquierdo',
  // Cuadrante 7 — Inferior izquierdo primario
  71: 'Incisivo central temporal inferior izquierdo',
  72: 'Incisivo lateral temporal inferior izquierdo',
  73: 'Canino temporal inferior izquierdo',
  74: 'Primer molar temporal inferior izquierdo',
  75: 'Segundo molar temporal inferior izquierdo',
  // Cuadrante 8 — Inferior derecho primario
  81: 'Incisivo central temporal inferior derecho',
  82: 'Incisivo lateral temporal inferior derecho',
  83: 'Canino temporal inferior derecho',
  84: 'Primer molar temporal inferior derecho',
  85: 'Segundo molar temporal inferior derecho',
};

const SURFACE_LABELS: Record<ToothSurface, string> = {
  occlusal: 'Oclusal',
  buccal: 'Bucal',
  lingual: 'Lingual',
  mesial: 'Mesial',
  distal: 'Distal',
};

const SURFACES: ToothSurface[] = ['buccal', 'lingual', 'mesial', 'distal', 'occlusal'];

/**
 * Polygon points for each tooth surface (SVG viewBox: 0 0 100 100).
 * Upper arch: buccal at top, lingual at bottom.
 */
const UPPER_POINTS: Record<ToothSurface, string> = {
  buccal: '0,0 100,0 70,30 30,30',
  lingual: '30,70 70,70 100,100 0,100',
  mesial: '0,0 30,30 30,70 0,100',
  distal: '70,30 100,0 100,100 70,70',
  occlusal: '30,30 70,30 70,70 30,70',
};

/**
 * Lower arch: buccal at bottom, lingual at top (swapped from upper).
 */
const LOWER_POINTS: Record<ToothSurface, string> = {
  buccal: '30,70 70,70 100,100 0,100',
  lingual: '0,0 100,0 70,30 30,30',
  mesial: '0,0 30,30 30,70 0,100',
  distal: '70,30 100,0 100,100 70,70',
  occlusal: '30,30 70,30 70,70 30,70',
};

/** Stable empty tooth data — avoids creating a new object reference per render */
const EMPTY_TOOTH: ToothData = {};

/** FDI tooth numbers per arch section, ordered left-to-right on screen */
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

/** FDI primary tooth numbers per arch section, ordered left-to-right on screen */
const PRIMARY_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PRIMARY_UPPER_LEFT = [61, 62, 63, 64, 65];
const PRIMARY_LOWER_RIGHT = [85, 84, 83, 82, 81];
const PRIMARY_LOWER_LEFT = [71, 72, 73, 74, 75];

// ─── NotePopover ─────────────────────────────────────────────────────────────

interface NotePopoverProps {
  toothNumber: number;
  initialNote: string;
  editable: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onSave: (note: string) => void;
}

const NotePopover = React.memo<NotePopoverProps>(({
  toothNumber,
  initialNote,
  editable,
  position,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState(initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-40" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Nota del diente ${toothNumber}`}
        style={{ top: position.top, left: position.left }}
        className="fixed z-50 w-64 bg-white border border-edge rounded-md shadow-lg p-3 flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-txt">Diente {toothNumber}</span>
          <button
            onClick={onClose}
            aria-label="Cerrar nota"
            className="text-txt-secondary hover:text-txt rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-edge-focus"
          >
            ✕
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={editable ? (e) => setDraft(e.target.value) : undefined}
          readOnly={!editable}
          rows={4}
          placeholder={editable ? 'Escribe una nota...' : undefined}
          className={cn(
            'w-full resize-none rounded border border-edge text-sm text-txt p-2 outline-none',
            'focus-visible:border-edge-focus focus-visible:ring-1 focus-visible:ring-edge-focus',
            !editable && 'bg-field-readonly cursor-default'
          )}
        />
        {editable && (
          <div className="flex justify-end">
            <button
              onClick={() => onSave(draft)}
              className="px-3 py-1 rounded bg-primary text-txt-white text-xs font-medium hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
});
NotePopover.displayName = 'NotePopover';

// ─── ToothSVG ────────────────────────────────────────────────────────────────

interface ToothSVGProps {
  toothNumber: number;
  arch: 'upper' | 'lower';
  data: ToothData;
  size: 'sm' | 'md' | 'lg';
  interactive: boolean;
  onSurfaceClick: (toothNumber: number, surface: ToothSurface) => void;
}

const ToothSVG = React.memo<ToothSVGProps>(({
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

  const getSurfaceFill = (surface: ToothSurface): string => {
    if (hasToothCondition) return CONDITION_FILL[data.condition!];
    return CONDITION_FILL[data.surfaces?.[surface] ?? 'healthy'];
  };

  const toothLabel = `Diente ${toothNumber}${isMissing ? ' - Ausente' : ''}: ${TOOTH_NAMES[toothNumber] ?? ''}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={toothSize}
      height={toothSize}
      role="img"
      aria-label={toothLabel}
      className="block flex-shrink-0"
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
              getSurfaceFill(surface),
              'stroke-gray-400 outline-none',
              canClick && 'cursor-pointer hover:opacity-70 focus-visible:opacity-70'
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
          <line x1="20" y1="20" x2="80" y2="80" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
});
ToothSVG.displayName = 'ToothSVG';

// ─── Odontogram ──────────────────────────────────────────────────────────────

export const Odontogram = forwardRef<HTMLDivElement, OdontogramProps>(
  (
    { value = {}, onChange, readOnly = false, activeTool = 'caries', dentition = 'permanent', label, size = 'md', className },
    ref
  ) => {
    const generatedId = useId();
    const labelId = label ? generatedId : undefined;
    const interactive = !readOnly && onChange != null;

    // Refs keep latest values so handleSurfaceClick can have empty deps (stable reference)
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

    const handleNoteOpen = (toothNumber: number, el: HTMLButtonElement) => {
      const rect = el.getBoundingClientRect();
      popoverTriggerRef.current = el;
      setOpenNoteTooth(toothNumber);
      setPopoverPos({ top: rect.bottom + 4, left: rect.left });
    };

    const handleNoteClose = () => {
      setOpenNoteTooth(null);
      setPopoverPos(null);
      popoverTriggerRef.current?.focus();
    };

    const handleNoteSave = (note: string) => {
      const currentOnChange = onChangeRef.current;
      if (currentOnChange && openNoteTooth !== null) {
        const trimmed = note.trim();
        const current = valueRef.current[openNoteTooth] ?? {};
        const { notes: _omitted, ...rest } = current;
        const updated: ToothData = trimmed ? { ...rest, notes: trimmed } : rest;
        currentOnChange({ ...valueRef.current, [openNoteTooth]: updated });
      }
      handleNoteClose();
    };

    const isPrimary = dentition === 'primary';
    const upperRight = isPrimary ? PRIMARY_UPPER_RIGHT : UPPER_RIGHT;
    const upperLeft = isPrimary ? PRIMARY_UPPER_LEFT : UPPER_LEFT;
    const lowerRight = isPrimary ? PRIMARY_LOWER_RIGHT : LOWER_RIGHT;
    const lowerLeft = isPrimary ? PRIMARY_LOWER_LEFT : LOWER_LEFT;

    const renderTooth = (toothNumber: number, arch: 'upper' | 'lower') => {
      const hasNote = Boolean(value[toothNumber]?.notes);
      // Show note button if interactive (can edit) or if there's a note to view
      const showNoteButton = interactive || hasNote;

      const numberEl = showNoteButton ? (
        <button
          onClick={(e) => handleNoteOpen(toothNumber, e.currentTarget)}
          aria-label={`Nota del diente ${toothNumber}${hasNote ? ' — tiene nota' : ''}`}
          className={cn(
            'inline-flex items-center gap-0.5 font-mono leading-none rounded',
            'text-text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-edge-focus',
            NUMBER_TEXT_SIZE[size],
            arch === 'upper' ? 'mt-0.5' : 'mb-0.5'
          )}
        >
          {toothNumber}
          {hasNote && (
            <span
              aria-hidden="true"
              className="inline-block w-1 h-1 rounded-full bg-primary flex-shrink-0"
            />
          )}
        </button>
      ) : (
        <span
          className={cn(
            'font-mono leading-none text-text-secondary',
            NUMBER_TEXT_SIZE[size],
            arch === 'upper' ? 'mt-0.5' : 'mb-0.5'
          )}
        >
          {toothNumber}
        </span>
      );

      return (
        <div key={toothNumber} className="flex flex-col items-center">
          {arch === 'lower' && numberEl}
          <ToothSVG
            toothNumber={toothNumber}
            arch={arch}
            data={value[toothNumber] ?? EMPTY_TOOTH}
            size={size}
            interactive={interactive}
            onSurfaceClick={handleSurfaceClick}
          />
          {arch === 'upper' && numberEl}
        </div>
      );
    };

    const renderArch = (left: number[], right: number[], arch: 'upper' | 'lower') => (
      <div className="flex flex-row items-center">
        <div className="flex flex-row gap-0.5">{left.map((n) => renderTooth(n, arch))}</div>
        <div className="w-px self-stretch bg-gray-300 mx-1.5" aria-hidden="true" />
        <div className="flex flex-row gap-0.5">{right.map((n) => renderTooth(n, arch))}</div>
      </div>
    );

    return (
      <div ref={ref} role="group" aria-labelledby={labelId} className={cn('inline-flex flex-col gap-1.5', className)}>
        {label && (
          <span id={labelId} className="text-sm font-medium text-text-primary">
            {label}
          </span>
        )}
        <div className="flex flex-col border border-gray-200 rounded-md p-2 bg-white overflow-x-auto">
          {renderArch(upperRight, upperLeft, 'upper')}
          <div className="h-3 border-b border-gray-300 mb-1" aria-hidden="true" />
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
      </div>
    );
  }
);
Odontogram.displayName = 'Odontogram';
