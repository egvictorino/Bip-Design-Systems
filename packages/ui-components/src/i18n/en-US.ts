import type { BipLocale } from './types.js';

export const enUS: BipLocale = {
  locale: 'en-US',

  alert: {
    close: 'Close alert',
  },

  avatar: {
    overflow: (count) => `+${count}`,
  },

  breadcrumb: {
    nav: 'Breadcrumb',
  },

  card: {
    loading: 'Loading...',
  },

  confirmDialog: {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },

  dataTable: {
    emptyMessage: 'No data available',
    searchPlaceholder: 'Search...',
    columnVisibility: 'Column visibility',
    columnVisibilityToggle: 'Columns',
    selectAllRows: 'Select all rows on this page',
    selectRow: (rowIndex) => `Select row ${rowIndex}`,
    resultsSummary: (shown, total) => `${shown} of ${total} results`,
    selectedCount: (count) => `${count} selected`,
    clearSelection: 'Clear',
  },

  datePicker: {
    prevYear: 'Previous year',
    nextYear: 'Next year',
    selectMonth: 'Select month',
    monthOfYear: (month, year) => `${month} ${year}`,
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonthAndYear: (month, year) => `${month} ${year} — Select month and year`,
    placeholder: 'MM/DD/YYYY',
    clear: 'Clear date',
    calendar: 'Calendar',
    today: 'Today',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    dayLabels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  },

  dateRangePicker: {
    prevYear: 'Previous year',
    nextYear: 'Next year',
    selectMonth: 'Select month',
    monthOfYear: (month, year) => `${month} ${year}`,
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonthAndYear: (month, year) => `${month} ${year} — Select month and year`,
    placeholder: 'MM/DD/YYYY – MM/DD/YYYY',
    selectRange: 'Select date range',
    clearSelection: 'Clear selection',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    monthNamesShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    dayLabels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  },

  drawerPanel: {
    close: 'Close panel',
  },

  dropdown: {
    search: 'Search options',
    searchPlaceholder: 'Search...',
  },

  fileUpload: {
    remove: (fileName) => `Remove ${fileName}`,
    dropHere: 'Drop the file here',
    dragHere: 'Drag your file here',
    clickToSelect: 'or click to select',
    formats: (accept) => `Formats: ${accept}`,
    maxSize: (size) => `Max. ${size}`,
    uploading: 'Uploading…',
  },

  input: {
    clear: 'Clear field',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },

  link: {
    opensInNewTab: '(opens in a new tab)',
  },

  modal: {
    close: 'Close modal',
  },

  multiSelect: {
    placeholder: 'Select...',
    searchPlaceholder: 'Search...',
    selectAll: 'Select all',
    selectVisible: (count) => `Select visible (${count})`,
    remove: (label) => `Remove ${label}`,
    overflow: (count) => `+${count} more`,
    overflowChip: (count) => `+${count} more`,
    removeAll: 'Remove all selections',
    search: 'Search options',
    loading: 'Loading options',
    loadingText: 'Loading...',
    options: 'Options',
    noResults: 'No results',
  },

  navbar: {
    mainNav: 'Main navigation',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },

  numberInput: {
    decrement: 'Decrement',
    increment: 'Increment',
  },

  odontogram: {
    conditionLabels: {
      healthy: 'Healthy',
      caries: 'Caries',
      restoration: 'Restoration',
      crown: 'Crown',
      missing: 'Missing',
      implant: 'Implant',
      fracture: 'Fracture',
      root_canal: 'Root canal',
      extraction_planned: 'Extraction planned',
    },
    surfaceLabels: {
      occlusal: 'Occlusal',
      buccal: 'Buccal',
      lingual: 'Lingual',
      mesial: 'Mesial',
      distal: 'Distal',
    },
    imageTypeLabels: {
      radiograph: 'Radiograph',
      photo: 'Photo',
      other: 'Other',
    },
    toothNames: {
      11: 'Upper right central incisor',
      12: 'Upper right lateral incisor',
      13: 'Upper right canine',
      14: 'Upper right first premolar',
      15: 'Upper right second premolar',
      16: 'Upper right first molar',
      17: 'Upper right second molar',
      18: 'Upper right third molar',
      21: 'Upper left central incisor',
      22: 'Upper left lateral incisor',
      23: 'Upper left canine',
      24: 'Upper left first premolar',
      25: 'Upper left second premolar',
      26: 'Upper left first molar',
      27: 'Upper left second molar',
      28: 'Upper left third molar',
      31: 'Lower left central incisor',
      32: 'Lower left lateral incisor',
      33: 'Lower left canine',
      34: 'Lower left first premolar',
      35: 'Lower left second premolar',
      36: 'Lower left first molar',
      37: 'Lower left second molar',
      38: 'Lower left third molar',
      41: 'Lower right central incisor',
      42: 'Lower right lateral incisor',
      43: 'Lower right canine',
      44: 'Lower right first premolar',
      45: 'Lower right second premolar',
      46: 'Lower right first molar',
      47: 'Lower right second molar',
      48: 'Lower right third molar',
      55: 'Upper right second primary molar',
      54: 'Upper right first primary molar',
      53: 'Upper right primary canine',
      52: 'Upper right primary lateral incisor',
      51: 'Upper right primary central incisor',
      61: 'Upper left primary central incisor',
      62: 'Upper left primary lateral incisor',
      63: 'Upper left primary canine',
      64: 'Upper left first primary molar',
      65: 'Upper left second primary molar',
      71: 'Lower left primary central incisor',
      72: 'Lower left primary lateral incisor',
      73: 'Lower left primary canine',
      74: 'Lower left first primary molar',
      75: 'Lower left second primary molar',
      81: 'Lower right primary central incisor',
      82: 'Lower right primary lateral incisor',
      83: 'Lower right primary canine',
      84: 'Lower right first primary molar',
      85: 'Lower right second primary molar',
    },
    selectTooth: (toothNumber, selected) =>
      `Select tooth ${toothNumber}${selected ? ' — selected' : ''}`,
    toothImages: (toothNumber) => `Tooth ${toothNumber} images`,
    closeImages: 'Close images',
    attachedImages: 'Attached images',
    viewImage: (index, typeLabel) => `View image ${index}: ${typeLabel}`,
    removeImage: (index) => `Remove image ${index}`,
    noImagesAttached: 'No images attached',
    newImage: 'New image',
    imageType: 'Type',
    selectImageFile: 'Select image file',
    previewAlt: 'Preview',
    changeFile: 'Change file',
    selectFile: 'Select file',
    toothNote: (toothNumber) => `Tooth ${toothNumber} note`,
    tooth: (toothNumber) => `Tooth ${toothNumber}`,
    imagePreviewAlt: (typeLabel, toothNumber) => `${typeLabel} — tooth ${toothNumber}`,
    closeNote: 'Close note',
    closeDetail: 'Close detail',
    conditions: 'Conditions',
    noteWithState: (toothNumber, hasNote) =>
      `Tooth ${toothNumber} note${hasNote ? ' — has note' : ''}`,
    imagesWithCount: (toothNumber, count) =>
      `Tooth ${toothNumber} images${count > 0 ? ` — ${count} image${count > 1 ? 's' : ''}` : ''}`,
    toothLabel: (toothNumber, isMissing, name) =>
      `Tooth ${toothNumber}${isMissing ? ' - Missing' : ''}: ${name}`,
    noteLabel: 'Note',
    imagesLabel: (count) => `Images${count > 0 ? ` (${count})` : ''}`,
    notePlaceholder: 'Write a note...',
    save: 'Save',
    imagesGalleryTitle: (toothNumber) => `Images — Tooth ${toothNumber}`,
    cancel: 'Cancel',
    add: 'Add',
    addImage: 'Add image',
  },

  pagination: {
    nav: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    page: (n) => `Page ${n}`,
  },

  progressBar: {
    defaultLabel: 'Progress',
  },

  searchInput: {
    clear: 'Clear search',
  },

  sidebar: {
    nav: 'Side navigation',
    navLandmark: 'Navigation',
    expand: 'Expand sidebar',
    collapse: 'Collapse sidebar',
  },

  spinner: {
    defaultLabel: 'Loading...',
  },

  statsCard: {
    loading: 'Loading stat',
    trend: (trend) => `Trend: ${trend > 0 ? '+' : ''}${trend}%`,
  },

  stepper: {
    nav: 'Process steps',
  },

  table: {
    emptyMessage: 'No records to show.',
  },

  timePicker: {
    placeholder: 'HH:MM',
    openPicker: 'Open time picker',
    selectTime: 'Select time',
    hours: 'Hours',
    minutes: 'Minutes',
    amPm: 'AM/PM',
    hourSelectedAnnouncement: (hour) => `Hour ${hour} selected`,
    timeSelectedAnnouncement: (time) => `${time} selected`,
    periodSelectedAnnouncement: (period) => `${period} selected`,
  },

  toast: {
    region: 'Notifications',
  },

  calendar: {
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    views: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
    },
    statusLabels: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    upcomingEvents: 'Upcoming events',
    prevPeriod: 'Previous period',
    nextPeriod: 'Next period',
    selectedDateRange: 'Selected date range',
    close: 'Close',
    monthLabel: (month) => `Month ${month}`,
    calendarLabel: 'Calendar',
    today: 'Today',
    createEvent: 'Create event',
    overflowCount: (count) => `+${count} more`,
    noEventsFiltered: 'No events with the selected filters',
    noEventsUpcoming: 'No events in the next 30 days',
  },
};
