// Design tokens + estilos base (nunca se incluían en el build: index.ts no
// importaba index.css, así que Vite jamás los agregaba al grafo de módulos
// y dist/style.css se publicaba sin ninguna definición de --color-*/--text-*/etc.)
import './index.css';

// Componentes
export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';

export {
  ThemeProvider,
  useTheme,
  useColorScheme,
  useThemeAttributes,
  useThemeControls,
  getThemeInitScript,
  THEME_RESET_STYLE,
  TOKEN_VAR_MAP,
  resolveTokenVars,
} from './components/ThemeProvider';
export type {
  ThemeProviderProps,
  ThemeInitScriptOptions,
  ThemeControls,
  BipTheme,
  BipColorScheme,
  BipColorSchemePreference,
  BipTokenOverrides,
  BipRadiusOverrides,
  BipFocusRingOverrides,
  BipMotionOverrides,
} from './components/ThemeProvider';

export { contrastRatio, pickReadableText } from './lib/contrast';

export { esMX, enUS, useBipLocale } from './i18n';
export type { BipLocale, PartialBipLocale } from './i18n';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './components/Accordion';

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input } from './components/Input';
export type { InputProps, InputType } from './components/Input';

export { FileUpload } from './components/FileUpload';
export type { FileUploadProps, RejectedFile } from './components/FileUpload';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';
export { CheckboxGroup } from './components/Checkbox';
export type { CheckboxGroupProps } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';
export { RadioGroup } from './components/Radio';
export type { RadioGroupProps } from './components/Radio';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { MultiSelect } from './components/MultiSelect';
export type { MultiSelectProps, MultiSelectOption } from './components/MultiSelect';

export { Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { ToastProvider, useToast } from './components/Toast';
export type { ToastProviderProps, ToastConfig, ToastPosition } from './components/Toast';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { Card, CardHeader, CardBody, CardFooter, CardMedia } from './components/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardMediaProps } from './components/Card';

export { Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  TableEmpty,
} from './components/Table';
export type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
  TableEmptyProps,
} from './components/Table';

export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar';

export { Tabs, TabList, Tab, TabPanel } from './components/Tabs';
export type { TabsProps, TabListProps, TabProps, TabPanelProps } from './components/Tabs';

export { Modal, ModalHeader, ModalBody, ModalFooter } from './components/Modal';
export type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from './components/Modal';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';

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
} from './components/Dropdown';
export type {
  DropdownProps,
  DropdownTriggerProps,
  DropdownMenuProps,
  DropdownItemProps,
  DropdownGroupProps,
  DropdownSearchProps,
  DropdownItemCheckboxProps,
  DropdownSubmenuProps,
} from './components/Dropdown';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarActions } from './components/Navbar';
export type {
  NavbarProps,
  NavbarVariant,
  NavbarBrandProps,
  NavbarNavProps,
  NavbarItemProps,
  NavbarActionsProps,
} from './components/Navbar';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps } from './components/DatePicker';

export { TimePicker } from './components/TimePicker';
export type { TimePickerProps } from './components/TimePicker';

export { Calendar } from './components/Calendar';
export type {
  CalendarProps,
  CalendarEvent,
  CalendarEventStatus,
  CalendarResource,
  CalendarSlotInfo,
  CalendarView,
} from './components/Calendar';

export { Stepper, StepperStep } from './components/Stepper';
export type { StepperProps, StepperStepProps } from './components/Stepper';

export { Avatar, AvatarGroup } from './components/Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarShape, AvatarStatus } from './components/Avatar';

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
} from './components/Sidebar';
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
} from './components/Sidebar';

export { ConfirmDialog } from './components/ConfirmDialog';
export type { ConfirmDialogProps } from './components/ConfirmDialog';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { StatsCard } from './components/StatsCard';
export type { StatsCardProps } from './components/StatsCard';

export { SearchInput } from './components/SearchInput';
export type { SearchInputProps } from './components/SearchInput';

export { NumberInput } from './components/NumberInput';
export type { NumberInputProps } from './components/NumberInput';

export { DateRangePicker } from './components/DateRangePicker';
export type { DateRangePickerProps, DateRange } from './components/DateRangePicker';

export { Timeline, TimelineItem } from './components/Timeline';
export type { TimelineProps, TimelineItemProps } from './components/Timeline';

export { DrawerPanel } from './components/DrawerPanel';
export type { DrawerPanelProps } from './components/DrawerPanel';

export { DataTable } from './components/DataTable';
export type { DataTableProps, ColumnDef } from './components/DataTable';

export { Odontogram } from './components/Odontogram';
export type {
  OdontogramProps,
  OdontogramValue,
  ToothData,
  ToothCondition,
  ToothSurface,
  SurfaceCondition,
  DentitionMode,
} from './components/Odontogram';

export { Stack } from './components/Stack';
export type { StackProps, StackGap, StackDirection, StackAlign, StackJustify } from './components/Stack';

export { Grid } from './components/Grid';
export type { GridProps, GridColumns, GridGap } from './components/Grid';

export { Container } from './components/Container';
export type { ContainerProps, ContainerMaxWidth } from './components/Container';

export { Text } from './components/Text';
export type { TextProps, TextSize, TextWeight, TextColor, TextAlign } from './components/Text';

export { Heading } from './components/Heading';
export type { HeadingProps, HeadingLevel, HeadingSize, HeadingWeight } from './components/Heading';

export { cn } from './lib/cn';

export { BREAKPOINTS, mediaQuery } from './styles/breakpoints';
export type { BreakpointKey } from './styles/breakpoints';

export {
  useClickOutside,
  useDisclosure,
  useFocusTrap,
  useMediaQuery,
  useScrollLock,
} from './hooks';
export type { UseDisclosureReturn, UseFocusTrapOptions } from './hooks';
