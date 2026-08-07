import type { BipLocale } from './types.js';

/**
 * Default locale — a literal copy of the strings that used to be hardcoded directly in each
 * component's JSX. Migrating a component to `useBipLocale()` must not change this file's
 * values, or it changes default (unconfigured) behavior for every existing consumer.
 */
export const esMX: BipLocale = {
  locale: 'es-MX',

  alert: {
    close: 'Cerrar alerta',
  },

  avatar: {
    overflow: (count) => `${count} más`,
  },

  breadcrumb: {
    nav: 'Breadcrumb',
  },

  card: {
    loading: 'Cargando...',
  },

  confirmDialog: {
    confirm: 'Confirmar',
    cancel: 'Cancelar',
  },

  dataTable: {
    emptyMessage: 'No hay datos disponibles',
    searchPlaceholder: 'Buscar...',
    columnVisibility: 'Visibilidad de columnas',
    columnVisibilityToggle: 'Columnas',
    selectAllRows: 'Seleccionar todas las filas de esta página',
    selectRow: (rowIndex) => `Seleccionar fila ${rowIndex}`,
    resultsSummary: (shown, total) => `${shown} de ${total} resultados`,
    selectedCount: (count) => `${count} seleccionado${count !== 1 ? 's' : ''}`,
    clearSelection: 'Limpiar',
  },

  datePicker: {
    prevYear: 'Año anterior',
    nextYear: 'Año siguiente',
    selectMonth: 'Seleccionar mes',
    monthOfYear: (month, year) => `${month} ${year}`,
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    selectMonthAndYear: (month, year) => `${month} ${year} — Seleccionar mes y año`,
    placeholder: 'DD/MM/AAAA',
    clear: 'Limpiar fecha',
    calendar: 'Calendario',
    today: 'Hoy',
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ],
    monthNamesShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ],
    dayLabels: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  },

  dateRangePicker: {
    prevYear: 'Año anterior',
    nextYear: 'Año siguiente',
    selectMonth: 'Seleccionar mes',
    monthOfYear: (month, year) => `${month} ${year}`,
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    selectMonthAndYear: (month, year) => `${month} ${year} — Seleccionar mes y año`,
    placeholder: 'DD/MM/AAAA – DD/MM/AAAA',
    selectRange: 'Seleccionar rango de fechas',
    clearSelection: 'Limpiar selección',
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ],
    monthNamesShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ],
    dayLabels: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  },

  drawerPanel: {
    close: 'Cerrar panel',
  },

  dropdown: {
    search: 'Buscar opciones',
    searchPlaceholder: 'Buscar...',
  },

  fileUpload: {
    remove: (fileName) => `Eliminar ${fileName}`,
    dropHere: 'Suelta aquí el archivo',
    dragHere: 'Arrastra tu archivo aquí',
    clickToSelect: 'o haz click para seleccionar',
    formats: (accept) => `Formatos: ${accept}`,
    maxSize: (size) => `Máx. ${size}`,
  },

  input: {
    clear: 'Limpiar campo',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
  },

  link: {
    opensInNewTab: '(abre en una pestaña nueva)',
  },

  modal: {
    close: 'Cerrar modal',
  },

  multiSelect: {
    placeholder: 'Seleccionar...',
    searchPlaceholder: 'Buscar...',
    selectAll: 'Seleccionar todo',
    selectVisible: (count) => `Seleccionar visibles (${count})`,
    remove: (label) => `Eliminar ${label}`,
    overflow: (count) => `${count} selecciones más`,
    overflowChip: (count) => `+${count} más`,
    removeAll: 'Eliminar todas las selecciones',
    search: 'Buscar opciones',
    loading: 'Cargando opciones',
    loadingText: 'Cargando...',
    options: 'Opciones',
    noResults: 'Sin resultados',
  },

  navbar: {
    mainNav: 'Navegación principal',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
  },

  numberInput: {
    decrement: 'Decrementar',
    increment: 'Incrementar',
  },

  odontogram: {
    conditionLabels: {
      healthy: 'Sano',
      caries: 'Caries',
      restoration: 'Restauración',
      crown: 'Corona',
      missing: 'Ausente',
      implant: 'Implante',
      fracture: 'Fractura',
      root_canal: 'Endodoncia',
      extraction_planned: 'Extracción planeada',
    },
    surfaceLabels: {
      occlusal: 'Oclusal',
      buccal: 'Bucal',
      lingual: 'Lingual',
      mesial: 'Mesial',
      distal: 'Distal',
    },
    imageTypeLabels: {
      radiograph: 'Radiografía',
      photo: 'Fotografía',
      other: 'Otra',
    },
    toothNames: {
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
      55: 'Segundo molar temporal superior derecho',
      54: 'Primer molar temporal superior derecho',
      53: 'Canino temporal superior derecho',
      52: 'Incisivo lateral temporal superior derecho',
      51: 'Incisivo central temporal superior derecho',
      61: 'Incisivo central temporal superior izquierdo',
      62: 'Incisivo lateral temporal superior izquierdo',
      63: 'Canino temporal superior izquierdo',
      64: 'Primer molar temporal superior izquierdo',
      65: 'Segundo molar temporal superior izquierdo',
      71: 'Incisivo central temporal inferior izquierdo',
      72: 'Incisivo lateral temporal inferior izquierdo',
      73: 'Canino temporal inferior izquierdo',
      74: 'Primer molar temporal inferior izquierdo',
      75: 'Segundo molar temporal inferior izquierdo',
      81: 'Incisivo central temporal inferior derecho',
      82: 'Incisivo lateral temporal inferior derecho',
      83: 'Canino temporal inferior derecho',
      84: 'Primer molar temporal inferior derecho',
      85: 'Segundo molar temporal inferior derecho',
    },
    selectTooth: (toothNumber, selected) =>
      `Seleccionar diente ${toothNumber}${selected ? ' — seleccionado' : ''}`,
    toothImages: (toothNumber) => `Imágenes del diente ${toothNumber}`,
    closeImages: 'Cerrar imágenes',
    attachedImages: 'Imágenes adjuntas',
    viewImage: (index, typeLabel) => `Ver imagen ${index}: ${typeLabel}`,
    removeImage: (index) => `Eliminar imagen ${index}`,
    noImagesAttached: 'Sin imágenes adjuntas',
    newImage: 'Nueva imagen',
    imageType: 'Tipo',
    selectImageFile: 'Seleccionar archivo de imagen',
    previewAlt: 'Vista previa',
    changeFile: 'Cambiar archivo',
    selectFile: 'Seleccionar archivo',
    toothNote: (toothNumber) => `Nota del diente ${toothNumber}`,
    tooth: (toothNumber) => `Diente ${toothNumber}`,
    imagePreviewAlt: (typeLabel, toothNumber) => `${typeLabel} — diente ${toothNumber}`,
    closeNote: 'Cerrar nota',
    closeDetail: 'Cerrar detalle',
    conditions: 'Condiciones',
    noteWithState: (toothNumber, hasNote) =>
      `Nota del diente ${toothNumber}${hasNote ? ' — tiene nota' : ''}`,
    imagesWithCount: (toothNumber, count) =>
      `Imágenes del diente ${toothNumber}${count > 0 ? ` — ${count} imagen${count > 1 ? 'es' : ''}` : ''}`,
    toothLabel: (toothNumber, isMissing, name) =>
      `Diente ${toothNumber}${isMissing ? ' - Ausente' : ''}: ${name}`,
    noteLabel: 'Nota',
    imagesLabel: (count) => `Imágenes${count > 0 ? ` (${count})` : ''}`,
    notePlaceholder: 'Escribe una nota...',
    save: 'Guardar',
    imagesGalleryTitle: (toothNumber) => `Imágenes — Diente ${toothNumber}`,
    cancel: 'Cancelar',
    add: 'Agregar',
    addImage: 'Agregar imagen',
  },

  pagination: {
    nav: 'Paginación',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    page: (n) => `Página ${n}`,
  },

  progressBar: {
    defaultLabel: 'Progreso',
  },

  searchInput: {
    clear: 'Limpiar búsqueda',
  },

  sidebar: {
    nav: 'Navegación lateral',
    navLandmark: 'Navegación',
    expand: 'Expandir sidebar',
    collapse: 'Colapsar sidebar',
  },

  spinner: {
    defaultLabel: 'Cargando...',
  },

  statsCard: {
    loading: 'Cargando estadística',
    trend: (trend) => `Tendencia: ${trend > 0 ? '+' : ''}${trend}%`,
  },

  stepper: {
    nav: 'Pasos del proceso',
  },

  table: {
    emptyMessage: 'No hay registros que mostrar.',
  },

  timePicker: {
    placeholder: 'HH:MM',
    openPicker: 'Abrir selector de hora',
    selectTime: 'Seleccionar hora',
    hours: 'Horas',
    minutes: 'Minutos',
    amPm: 'AM/PM',
    hourSelectedAnnouncement: (hour) => `Hora ${hour} seleccionada`,
    timeSelectedAnnouncement: (time) => `${time} seleccionado`,
    periodSelectedAnnouncement: (period) => `${period} seleccionado`,
  },

  toast: {
    region: 'Notificaciones',
  },

  calendar: {
    dayNames: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    views: {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
    },
    statusLabels: {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    },
    upcomingEvents: 'Próximos eventos',
    prevPeriod: 'Período anterior',
    nextPeriod: 'Período siguiente',
    selectedDateRange: 'Rango de fechas seleccionado',
    close: 'Cerrar',
    monthLabel: (month) => `Mes ${month}`,
    calendarLabel: 'Calendario',
    today: 'Hoy',
    createEvent: 'Crear evento',
    overflowCount: (count) => `+${count} más`,
    noEventsFiltered: 'No hay eventos con los filtros seleccionados',
    noEventsUpcoming: 'No hay eventos en los próximos 30 días',
  },
};
