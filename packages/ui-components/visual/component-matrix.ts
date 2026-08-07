/**
 * Manifiesto de cobertura visual por componente — un screenshot canónico por directorio de
 * src/components (48, todos salvo ThemeProvider — ver SKIP_LIST abajo, mismo criterio que
 * SKIP_LIST en src/a11y.test.tsx: no renderiza UI propia).
 *
 * `storyId` es la story canónica de cada componente (la primera exportada de su
 * *.stories.tsx) — se extrajo del `index.json` real de Storybook en vez de reimplementar el
 * algoritmo de slugify (`toId(kind, name)`), para no arriesgar un ID mal calculado. Si un
 * componente cambia el nombre de su primera story exportada, el test de este manifiesto
 * fallará con "story not found" en vez de silenciosamente screenshotear la story vieja — ver
 * component-matrix.spec.ts.
 *
 * `rtl: true` marca el subset (~15) con geometría direccional real — el resto no gana nada
 * de un segundo shot en RTL porque no tiene margin/padding/inset direccional que espejar.
 */
export interface ComponentMatrixEntry {
  dir: string;
  storyId: string;
  rtl?: true;
}

export const COMPONENT_MATRIX: ComponentMatrixEntry[] = [
  { dir: 'Accordion', storyId: 'components-accordion--default' },
  { dir: 'Alert', storyId: 'components-alert--info' },
  { dir: 'Avatar', storyId: 'components-avatar--with-image' },
  { dir: 'Badge', storyId: 'components-badge--primary' },
  { dir: 'Breadcrumb', storyId: 'components-breadcrumb--default' },
  { dir: 'Button', storyId: 'components-button--primary' },
  { dir: 'Calendar', storyId: 'components-calendar--week-view-story', rtl: true },
  { dir: 'Card', storyId: 'components-card--elevated' },
  { dir: 'Checkbox', storyId: 'components-checkbox--default' },
  { dir: 'ConfirmDialog', storyId: 'components-confirmdialog--info' },
  { dir: 'Container', storyId: 'components-container--default' },
  { dir: 'DataTable', storyId: 'components-datatable--default' },
  { dir: 'DatePicker', storyId: 'components-datepicker--default', rtl: true },
  { dir: 'DateRangePicker', storyId: 'components-daterangepicker--default' },
  { dir: 'Divider', storyId: 'components-divider--horizontal' },
  { dir: 'DrawerPanel', storyId: 'components-drawerpanel--default', rtl: true },
  { dir: 'Dropdown', storyId: 'components-dropdown--default', rtl: true },
  { dir: 'EmptyState', storyId: 'components-emptystate--default' },
  { dir: 'FileUpload', storyId: 'components-fileupload--default' },
  { dir: 'Grid', storyId: 'components-grid--responsive' },
  { dir: 'Heading', storyId: 'components-heading--default' },
  { dir: 'Input', storyId: 'components-input--outlined', rtl: true },
  { dir: 'Modal', storyId: 'components-modal--default' },
  { dir: 'MultiSelect', storyId: 'components-multiselect--default', rtl: true },
  { dir: 'Navbar', storyId: 'components-navbar--default' },
  { dir: 'NumberInput', storyId: 'components-numberinput--default', rtl: true },
  { dir: 'Odontogram', storyId: 'components-odontogram--default' },
  { dir: 'Pagination', storyId: 'components-pagination--default' },
  { dir: 'ProgressBar', storyId: 'components-progressbar--default' },
  { dir: 'Radio', storyId: 'components-radio--default' },
  { dir: 'SearchInput', storyId: 'components-searchinput--default', rtl: true },
  { dir: 'Select', storyId: 'components-select--outlined', rtl: true },
  { dir: 'Sidebar', storyId: 'components-sidebar--default', rtl: true },
  { dir: 'Skeleton', storyId: 'components-skeleton--text' },
  { dir: 'Spinner', storyId: 'components-spinner--default' },
  { dir: 'Stack', storyId: 'components-stack--row' },
  { dir: 'StatsCard', storyId: 'components-statscard--default' },
  { dir: 'Stepper', storyId: 'components-stepper--default', rtl: true },
  { dir: 'Table', storyId: 'components-table--default' },
  { dir: 'Tabs', storyId: 'components-tabs--default', rtl: true },
  { dir: 'Text', storyId: 'components-text--default' },
  { dir: 'Textarea', storyId: 'components-textarea--outlined' },
  { dir: 'TimePicker', storyId: 'components-timepicker--default' },
  { dir: 'Timeline', storyId: 'components-timeline--default', rtl: true },
  { dir: 'Toast', storyId: 'components-toast--default' },
  { dir: 'Toggle', storyId: 'components-toggle--default', rtl: true },
  { dir: 'Tooltip', storyId: 'components-tooltip--default', rtl: true },
];

/** Igual criterio que SKIP_LIST en src/a11y.test.tsx: sin UI propia que capturar. */
export const SKIP_LIST = new Set(['ThemeProvider']);
