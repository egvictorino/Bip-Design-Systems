// Design tokens + estilos base (nunca se incluían en el build: index.ts no
// importaba index.css, así que Vite jamás los agregaba al grafo de módulos
// y dist/style.css se publicaba sin ninguna definición de --color-*/--text-*/etc.)
import './index.css';

// Componentes
export { EmptyState } from './components/EmptyState/index.js';
export type { EmptyStateProps } from './components/EmptyState/index.js';

export {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useDensity,
  useDir,
  useThemeAttributes,
  useThemeControls,
  getThemeInitScript,
  THEME_RESET_STYLE,
  TOKEN_VAR_MAP,
  RADIUS_VAR_MAP,
  ON_TEXT_VAR_MAP,
  FOCUS_RING_VAR_MAP,
  MOTION_VAR_MAP,
  SPACING_VAR_MAP,
  resolveTokenVars,
} from './components/ThemeProvider/index.js';
export type {
  ThemeProviderProps,
  ThemeInitScriptOptions,
  ThemeControls,
  BipTheme,
  BipColorScheme,
  BipColorSchemePreference,
  BipDensity,
  BipDirection,
  BipTokenOverrides,
  BipRadiusOverrides,
  BipFocusRingOverrides,
  BipMotionOverrides,
  BipSpacingOverrides,
} from './components/ThemeProvider/index.js';

export { contrastRatio, pickReadableText } from './lib/contrast.js';

export { esMX, enUS, useBipLocale, mergeLocale } from './i18n/index.js';
export type { BipLocale, PartialBipLocale } from './i18n/index.js';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion/index.js';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionVariant,
} from './components/Accordion/index.js';

export { Button } from './components/Button/index.js';
export type { ButtonProps } from './components/Button/index.js';

export { Input } from './components/Input/index.js';
export type { InputProps, InputType } from './components/Input/index.js';

export { FileUpload } from './components/FileUpload/index.js';
export type { FileUploadProps, RejectedFile } from './components/FileUpload/index.js';

export { Checkbox } from './components/Checkbox/index.js';
export type { CheckboxProps } from './components/Checkbox/index.js';
export { CheckboxGroup } from './components/Checkbox/index.js';
export type { CheckboxGroupProps } from './components/Checkbox/index.js';

export { Radio } from './components/Radio/index.js';
export type { RadioProps } from './components/Radio/index.js';
export { RadioGroup } from './components/Radio/index.js';
export type { RadioGroupProps } from './components/Radio/index.js';

export { Textarea } from './components/Textarea/index.js';
export type { TextareaProps } from './components/Textarea/index.js';

export { Badge } from './components/Badge/index.js';
export type { BadgeProps } from './components/Badge/index.js';

export { Select } from './components/Select/index.js';
export type { SelectProps, SelectOption, SelectOptionGroup } from './components/Select/index.js';

export { MultiSelect } from './components/MultiSelect/index.js';
export type { MultiSelectProps, MultiSelectOption } from './components/MultiSelect/index.js';

export { Alert } from './components/Alert/index.js';
export type { AlertProps } from './components/Alert/index.js';

export { ToastProvider, useToast } from './components/Toast/index.js';
export type {
  ToastProviderProps,
  ToastConfig,
  ToastPosition,
  ToastContextValue,
} from './components/Toast/index.js';

export { Spinner } from './components/Spinner/index.js';
export type { SpinnerProps } from './components/Spinner/index.js';

export { Card, CardHeader, CardBody, CardFooter, CardMedia } from './components/Card/index.js';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardMediaProps } from './components/Card/index.js';

export { Toggle } from './components/Toggle/index.js';
export type { ToggleProps } from './components/Toggle/index.js';

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from './components/Table/index.js';
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableEmptyProps,
} from './components/Table/index.js';

export { Pagination } from './components/Pagination/index.js';
export type { PaginationProps } from './components/Pagination/index.js';

export { ProgressBar } from './components/ProgressBar/index.js';
export type { ProgressBarProps } from './components/ProgressBar/index.js';

export { Tabs, TabList, Tab, TabPanel } from './components/Tabs/index.js';
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabsVariant,
  TabsSize,
  TabsOrientation,
} from './components/Tabs/index.js';

export { Modal, ModalHeader, ModalBody, ModalFooter } from './components/Modal/index.js';
export type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from './components/Modal/index.js';

export { Tooltip } from './components/Tooltip/index.js';
export type { TooltipProps } from './components/Tooltip/index.js';

export { Breadcrumb } from './components/Breadcrumb/index.js';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb/index.js';

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownGroup,
  DropdownSearch,
  DropdownItemCheckbox,
  DropdownSubmenu,
} from './components/Dropdown/index.js';
export type {
  DropdownProps,
  DropdownTriggerProps,
  DropdownMenuProps,
  DropdownItemProps,
  DropdownGroupProps,
  DropdownSearchProps,
  DropdownItemCheckboxProps,
  DropdownSubmenuProps,
} from './components/Dropdown/index.js';

export { Skeleton } from './components/Skeleton/index.js';
export type { SkeletonProps } from './components/Skeleton/index.js';

export { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarActions } from './components/Navbar/index.js';
export type {
  NavbarProps,
  NavbarVariant,
  NavbarBrandProps,
  NavbarNavProps,
  NavbarItemProps,
  NavbarActionsProps,
} from './components/Navbar/index.js';

export { DatePicker } from './components/DatePicker/index.js';
export type { DatePickerProps } from './components/DatePicker/index.js';

export { TimePicker } from './components/TimePicker/index.js';
export type { TimePickerProps } from './components/TimePicker/index.js';

export { Calendar } from './components/Calendar/index.js';
export type {
  CalendarProps,
  CalendarEvent,
  CalendarEventStatus,
  CalendarResource,
  CalendarSlotInfo,
  CalendarView,
} from './components/Calendar/index.js';

export { Stepper, StepperStep } from './components/Stepper/index.js';
export type { StepperProps, StepperStepProps } from './components/Stepper/index.js';

export { Avatar, AvatarGroup } from './components/Avatar/index.js';
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarShape, AvatarStatus } from './components/Avatar/index.js';

export {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSubMenu,
  SidebarFooter,
  SidebarTrigger,
} from './components/Sidebar/index.js';
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarBrandProps,
  SidebarContentProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarItemProps,
  SidebarSubMenuProps,
  SidebarFooterProps,
  SidebarTriggerProps,
} from './components/Sidebar/index.js';

export { ConfirmDialog } from './components/ConfirmDialog/index.js';
export type { ConfirmDialogProps } from './components/ConfirmDialog/index.js';

export { Divider } from './components/Divider/index.js';
export type { DividerProps } from './components/Divider/index.js';

export { StatsCard } from './components/StatsCard/index.js';
export type {
  StatsCardProps,
  StatsCardVariant,
  StatsCardSize,
} from './components/StatsCard/index.js';

export { SearchInput } from './components/SearchInput/index.js';
export type { SearchInputProps } from './components/SearchInput/index.js';

export { NumberInput } from './components/NumberInput/index.js';
export type { NumberInputProps } from './components/NumberInput/index.js';

export { DateRangePicker } from './components/DateRangePicker/index.js';
export type { DateRangePickerProps, DateRange } from './components/DateRangePicker/index.js';

export { Timeline, TimelineItem } from './components/Timeline/index.js';
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineVariant,
  TimelineSize,
  TimelineOrientation,
} from './components/Timeline/index.js';

export { DrawerPanel } from './components/DrawerPanel/index.js';
export type { DrawerPanelProps } from './components/DrawerPanel/index.js';

export { DataTable } from './components/DataTable/index.js';
export type {
  DataTableProps,
  ColumnDef,
  BulkAction,
  SortDirection,
} from './components/DataTable/index.js';

export { Odontogram } from './components/Odontogram/index.js';
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
} from './components/Odontogram/index.js';

export { Stack } from './components/Stack/index.js';
export type { StackProps, StackGap, StackDirection, StackAlign, StackJustify } from './components/Stack/index.js';

export { Grid } from './components/Grid/index.js';
export type { GridProps, GridColumns, GridGap } from './components/Grid/index.js';

export { Container } from './components/Container/index.js';
export type { ContainerProps, ContainerMaxWidth } from './components/Container/index.js';

export { Text } from './components/Text/index.js';
export type { TextProps, TextSize, TextWeight, TextColor, TextAlign } from './components/Text/index.js';

export { Heading } from './components/Heading/index.js';
export type { HeadingProps, HeadingLevel, HeadingSize, HeadingWeight } from './components/Heading/index.js';

export { Slider } from './components/Slider/index.js';
export type { SliderProps } from './components/Slider/index.js';

export { Popover, PopoverTrigger, PopoverContent } from './components/Popover/index.js';
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
} from './components/Popover/index.js';

export { Link } from './components/Link/index.js';
export type { LinkProps } from './components/Link/index.js';

export { VisuallyHidden } from './components/VisuallyHidden/index.js';
export type { VisuallyHiddenProps } from './components/VisuallyHidden/index.js';

export { cn } from './lib/cn.js';

export { BREAKPOINTS, mediaQuery } from './styles/breakpoints.js';
export type { BreakpointKey } from './styles/breakpoints.js';

export {
  useClickOutside,
  useDisclosure,
  useFocusTrap,
  useMediaQuery,
  useScrollLock,
} from './hooks/index.js';
export type { UseDisclosureReturn, UseFocusTrapOptions } from './hooks/index.js';
