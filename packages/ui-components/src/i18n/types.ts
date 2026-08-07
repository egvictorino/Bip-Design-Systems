import type { CalendarEventStatus, CalendarView } from '../components/Calendar/Calendar';
import type { ToothCondition, ToothImageType, ToothSurface } from '../components/Odontogram/types';

/**
 * Full locale dictionary consumed by every component via useBipLocale(). `locale` is a
 * BCP-47 tag fed into every `Intl.*` call in the library (Calendar/DatePicker/DateRangePicker
 * formatters) — it is not just a label, it drives date/number formatting too.
 */
export interface BipLocale {
  locale: string;

  alert: {
    close: string;
  };

  avatar: {
    /** e.g. (n) => `${n} más` */
    overflow: (count: number) => string;
  };

  breadcrumb: {
    nav: string;
  };

  card: {
    loading: string;
  };

  confirmDialog: {
    confirm: string;
    cancel: string;
  };

  dataTable: {
    emptyMessage: string;
    searchPlaceholder: string;
    columnVisibility: string;
    selectAllRows: string;
    selectRow: (rowIndex: number) => string;
  };

  datePicker: {
    prevYear: string;
    nextYear: string;
    selectMonth: string;
    monthOfYear: (month: string, year: number) => string;
    prevMonth: string;
    nextMonth: string;
    selectMonthAndYear: (month: string, year: number) => string;
    placeholder: string;
    clear: string;
    calendar: string;
    today: string;
    monthNames: string[];
    dayLabels: string[];
  };

  dateRangePicker: {
    prevYear: string;
    nextYear: string;
    selectMonth: string;
    monthOfYear: (month: string, year: number) => string;
    prevMonth: string;
    nextMonth: string;
    selectMonthAndYear: (month: string, year: number) => string;
    placeholder: string;
    selectRange: string;
    clearSelection: string;
    monthNames: string[];
    dayLabels: string[];
  };

  drawerPanel: {
    close: string;
  };

  dropdown: {
    search: string;
    searchPlaceholder: string;
  };

  fileUpload: {
    remove: (fileName: string) => string;
  };

  input: {
    clear: string;
    showPassword: string;
    hidePassword: string;
  };

  modal: {
    close: string;
  };

  multiSelect: {
    placeholder: string;
    searchPlaceholder: string;
    selectAll: string;
    remove: (label: string) => string;
    overflow: (count: number) => string;
    removeAll: string;
    search: string;
    loading: string;
    loadingText: string;
    options: string;
    noResults: string;
  };

  navbar: {
    mainNav: string;
    closeMenu: string;
    openMenu: string;
  };

  numberInput: {
    decrement: string;
    increment: string;
  };

  odontogram: {
    conditionLabels: Record<ToothCondition, string>;
    surfaceLabels: Record<ToothSurface, string>;
    imageTypeLabels: Record<ToothImageType, string>;
    toothNames: Record<number, string>;
    selectTooth: (toothNumber: number, selected: boolean) => string;
    toothImages: (toothNumber: number) => string;
    closeImages: string;
    attachedImages: string;
    viewImage: (index: number, typeLabel: string) => string;
    removeImage: (index: number) => string;
    noImagesAttached: string;
    newImage: string;
    imageType: string;
    selectImageFile: string;
    previewAlt: string;
    changeFile: string;
    selectFile: string;
    toothNote: (toothNumber: number) => string;
    tooth: (toothNumber: number) => string;
    imagePreviewAlt: (typeLabel: string, toothNumber: number) => string;
    closeNote: string;
    closeDetail: string;
    conditions: string;
    noteWithState: (toothNumber: number, hasNote: boolean) => string;
    imagesWithCount: (toothNumber: number, count: number) => string;
  };

  pagination: {
    nav: string;
    prevPage: string;
    nextPage: string;
    page: (n: number) => string;
  };

  progressBar: {
    defaultLabel: string;
  };

  searchInput: {
    clear: string;
  };

  sidebar: {
    nav: string;
    navLandmark: string;
    expand: string;
    collapse: string;
  };

  spinner: {
    defaultLabel: string;
  };

  statsCard: {
    loading: string;
    trend: (trend: number) => string;
  };

  stepper: {
    nav: string;
  };

  timePicker: {
    placeholder: string;
    openPicker: string;
    selectTime: string;
    hours: string;
    minutes: string;
    amPm: string;
    hourSelectedAnnouncement: (hour: string) => string;
    timeSelectedAnnouncement: (time: string) => string;
    periodSelectedAnnouncement: (period: string) => string;
  };

  toast: {
    region: string;
  };

  calendar: {
    dayNames: string[];
    views: Record<CalendarView, string>;
    statusLabels: Record<CalendarEventStatus, string>;
    upcomingEvents: string;
    prevPeriod: string;
    nextPeriod: string;
    selectedDateRange: string;
    close: string;
    monthLabel: (month: string) => string;
    calendarLabel: string;
    today: string;
  };
}

/** Deep partial for `<ThemeProvider locale={{ alert: { close: '...' } }} />` overrides. */
export type PartialBipLocale = {
  [K in keyof BipLocale]?: BipLocale[K] extends (...args: never[]) => unknown
    ? BipLocale[K]
    : BipLocale[K] extends object
      ? Partial<BipLocale[K]>
      : BipLocale[K];
};
