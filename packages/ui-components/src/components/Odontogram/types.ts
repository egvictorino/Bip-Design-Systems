import styles from './Odontogram.module.css';

// ─── Public types ─────────────────────────────────────────────────────────────

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

export type ToothImageType = 'radiograph' | 'photo' | 'other';

export interface ToothImage {
  type: ToothImageType;
  /** base64 data URL or external URL */
  url: string;
}

export interface ToothData {
  condition?: ToothCondition;
  surfaces?: SurfaceCondition;
  notes?: string;
  images?: ToothImage[];
}

export type OdontogramValue = Record<number, ToothData>;

export interface OdontogramProps {
  value?: OdontogramValue;
  onChange?: (value: OdontogramValue) => void;
  readOnly?: boolean;
  /** Dentition mode: permanent (default, 32 teeth FDI 11-48) or primary (20 teeth FDI 51-85) */
  dentition?: DentitionMode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CONDITION_FILL_CLASS: Record<ToothCondition, string> = {
  healthy: styles.fillHealthy,
  caries: styles.fillCaries,
  restoration: styles.fillRestoration,
  crown: styles.fillCrown,
  missing: styles.fillMissing,
  implant: styles.fillImplant,
  fracture: styles.fillFracture,
  root_canal: styles.fillRootCanal,
  extraction_planned: styles.fillExtractionPlanned,
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

export const TOOTH_SIZE: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 120,
};

export const NUMBER_TEXT_SIZE_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: styles.numberSm,
  md: styles.numberMd,
  lg: styles.numberLg,
};

/** Conditions that apply to the whole tooth, not per surface */
export const WHOLE_TOOTH_CONDITIONS = new Set<ToothCondition>(['missing', 'crown', 'implant']);

export const TOOTH_NAMES: Record<number, string> = {
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

export const SURFACE_LABELS: Record<ToothSurface, string> = {
  occlusal: 'Oclusal',
  buccal: 'Bucal',
  lingual: 'Lingual',
  mesial: 'Mesial',
  distal: 'Distal',
};

export const SURFACES: ToothSurface[] = ['buccal', 'lingual', 'mesial', 'distal', 'occlusal'];

/**
 * Polygon points for each tooth surface (SVG viewBox: 0 0 100 100).
 * Upper arch: buccal at top, lingual at bottom.
 */
export const UPPER_POINTS: Record<ToothSurface, string> = {
  buccal: '0,0 100,0 70,30 30,30',
  lingual: '30,70 70,70 100,100 0,100',
  mesial: '0,0 30,30 30,70 0,100',
  distal: '70,30 100,0 100,100 70,70',
  occlusal: '30,30 70,30 70,70 30,70',
};

/**
 * Lower arch: buccal at bottom, lingual at top (swapped from upper).
 */
export const LOWER_POINTS: Record<ToothSurface, string> = {
  buccal: '30,70 70,70 100,100 0,100',
  lingual: '0,0 100,0 70,30 30,30',
  mesial: '0,0 30,30 30,70 0,100',
  distal: '70,30 100,0 100,100 70,70',
  occlusal: '30,30 70,30 70,70 30,70',
};

/** Stable empty tooth data — avoids creating a new object reference per render */
export const EMPTY_TOOTH: ToothData = {};

/** FDI tooth numbers per arch section, ordered left-to-right on screen */
export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

/** FDI primary tooth numbers per arch section, ordered left-to-right on screen */
export const PRIMARY_UPPER_RIGHT = [55, 54, 53, 52, 51];
export const PRIMARY_UPPER_LEFT = [61, 62, 63, 64, 65];
export const PRIMARY_LOWER_RIGHT = [85, 84, 83, 82, 81];
export const PRIMARY_LOWER_LEFT = [71, 72, 73, 74, 75];

export const IMAGE_TYPE_LABELS: Record<ToothImageType, string> = {
  radiograph: 'Radiografía',
  photo: 'Fotografía',
  other: 'Otra',
};

export const IMAGE_TYPES: ToothImageType[] = ['radiograph', 'photo', 'other'];

export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
