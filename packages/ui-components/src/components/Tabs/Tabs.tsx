"use client";

import React, {
  useId,
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
} from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Tabs.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabsVariant = 'line' | 'pill' | 'boxed';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string;
  onChange: (value: string) => void;
  instanceId: string;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  animated: boolean;
  tabRefs: React.RefObject<Map<string, HTMLButtonElement>>;
  registerTabRef: (value: string, el: HTMLButtonElement | null) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabList, Tab, and TabPanel must be used inside <Tabs>');
  return ctx;
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  orientation?: TabsOrientation;
  animated?: boolean;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue = '',
  onChange,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  animated = false,
  className,
  style,
  children,
  ...rest
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const instanceId = useId();
  const activeTab = value ?? internalValue;
  const tabRefsMap = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleChange = (v: string) => {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
  };

  const registerTabRef = useCallback((tabValue: string, el: HTMLButtonElement | null) => {
    if (el) {
      tabRefsMap.current.set(tabValue, el);
    } else {
      tabRefsMap.current.delete(tabValue);
    }
  }, []);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        onChange: handleChange,
        instanceId,
        variant,
        size,
        orientation,
        animated,
        tabRefs: tabRefsMap,
        registerTabRef,
      }}
    >
      <div
        className={cn(
          styles.tabsRoot,
          orientation === 'vertical' && styles.tabsRootVertical,
          className
        )}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// ─── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const tabListClassMap: Record<TabsVariant, Record<'horizontal' | 'vertical', string>> = {
  line: { horizontal: styles.tabListLine, vertical: styles.tabListLineVertical },
  pill: { horizontal: styles.tabListPill, vertical: styles.tabListPillVertical },
  boxed: { horizontal: styles.tabListBoxed, vertical: styles.tabListBoxed },
};

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, orientation, animated, activeTab, tabRefs } = useTabsContext();
    const listRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [initialized, setInitialized] = useState(false);

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      if (!animated || variant !== 'line' || orientation !== 'horizontal') return;
      const activeEl = tabRefs.current?.get(activeTab);
      if (!activeEl || !listRef.current) return;
      const listRect = listRef.current.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({ left: tabRect.left - listRect.left, width: tabRect.width });
      setInitialized(true);
    }, [activeTab, animated, variant, orientation, tabRefs]);

    const orientationKey = orientation === 'vertical' ? 'vertical' : 'horizontal';
    const tabListClass = tabListClassMap[variant][orientationKey];

    return (
      <div
        ref={combinedRef}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          tabListClass,
          animated &&
            variant === 'line' &&
            orientation === 'horizontal' &&
            styles.tabListAnimated,
          className
        )}
        {...props}
      >
        {children}
        {animated && variant === 'line' && orientation === 'horizontal' && (
          <span
            aria-hidden="true"
            className={cn(styles.tabIndicator, initialized && styles.tabIndicatorAnimated)}
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
        )}
      </div>
    );
  }
);

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  children: React.ReactNode;
}

interface TabVariantInfo {
  base: string;
  active: string;
  inactive: string;
  baseVertical?: string;
  activeVertical?: string;
  inactiveVertical?: string;
}

const tabVariantClasses: Record<TabsVariant, TabVariantInfo> = {
  line: {
    base: styles.tabLine,
    active: styles.tabLineActive,
    inactive: styles.tabLineInactive,
    baseVertical: styles.tabLineVertical,
    activeVertical: styles.tabLineVerticalActive,
    inactiveVertical: styles.tabLineVerticalInactive,
  },
  pill: {
    base: styles.tabPill,
    active: styles.tabPillActive,
    inactive: styles.tabPillInactive,
  },
  boxed: {
    base: styles.tabBoxed,
    active: styles.tabBoxedActive,
    inactive: styles.tabBoxedInactive,
  },
};

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, onChange, instanceId, variant, size, orientation, registerTabRef } =
      useTabsContext();
    const isActive = activeTab === value;
    const tabId = `${instanceId}-tab-${value}`;
    const panelId = `${instanceId}-panel-${value}`;
    const buttonRef = useRef<HTMLButtonElement>(null);

    const combinedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      registerTabRef(value, buttonRef.current);
      return () => registerTabRef(value, null);
    }, [value, registerTabRef]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const tablist = e.currentTarget.closest('[role="tablist"]');
      if (!tablist) return;
      const tabs = Array.from(
        tablist.querySelectorAll('[role="tab"]:not([disabled])')
      ) as HTMLElement[];
      const currentIndex = tabs.indexOf(e.currentTarget);
      let nextIndex = currentIndex;

      const isVertical = orientation === 'vertical';
      const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

      if (e.key === nextKey) {
        nextIndex = (currentIndex + 1) % tabs.length;
        e.preventDefault();
      } else if (e.key === prevKey) {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
        e.preventDefault();
      }

      if (nextIndex !== currentIndex) {
        tabs[nextIndex].focus();
      }
    };

    const isVertical = orientation === 'vertical';
    const variantInfo = tabVariantClasses[variant];
    const baseClass =
      isVertical && variant === 'line' ? variantInfo.baseVertical ?? variantInfo.base : variantInfo.base;
    const activeClass =
      isVertical && variant === 'line'
        ? variantInfo.activeVertical ?? variantInfo.active
        : variantInfo.active;
    const inactiveClass =
      isVertical && variant === 'line'
        ? variantInfo.inactiveVertical ?? variantInfo.inactive
        : variantInfo.inactive;

    return (
      <button
        ref={combinedRef}
        role="tab"
        id={tabId}
        aria-controls={panelId}
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        type="button"
        onClick={() => onChange(value)}
        onKeyDown={handleKeyDown}
        className={cn(
          styles.tab,
          baseClass,
          isActive ? activeClass : inactiveClass,
          size === 'sm' && styles.tabSm,
          size === 'lg' && styles.tabLg,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, instanceId, orientation } = useTabsContext();
    const tabId = `${instanceId}-tab-${value}`;
    const panelId = `${instanceId}-panel-${value}`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        hidden={activeTab !== value}
        className={cn(
          styles.tabPanel,
          orientation === 'vertical' && styles.tabPanelVertical,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
TabList.displayName = 'TabList';
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
