import React, { useId, useState, useContext } from 'react';
import { cn } from '../../lib/cn';
import styles from './Tabs.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string;
  onChange: (value: string) => void;
  instanceId: string;
  variant: 'line' | 'pill';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabList, Tab, and TabPanel must be used inside <Tabs>');
  return ctx;
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'pill';
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue = '',
  onChange,
  variant = 'line',
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const instanceId = useId();
  const activeTab = value ?? internalValue;

  const handleChange = (v: string) => {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ activeTab, onChange: handleChange, instanceId, variant }}>
      <div className={cn(styles.tabsRoot, className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// ─── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ className, children, ...props }) => {
  const { variant } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        variant === 'line' ? styles.tabListLine : styles.tabListPill,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ value, className, children, ...props }) => {
  const { activeTab, onChange, instanceId, variant } = useTabsContext();
  const isActive = activeTab === value;
  const tabId = `${instanceId}-tab-${value}`;
  const panelId = `${instanceId}-panel-${value}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tablist = e.currentTarget.closest('[role="tablist"]');
    if (!tablist) return;
    const tabs = Array.from(
      tablist.querySelectorAll('[role="tab"]:not([disabled])')
    ) as HTMLElement[];
    const currentIndex = tabs.indexOf(e.currentTarget);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
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

  const tabClass =
    variant === 'line'
      ? cn(styles.tab, styles.tabLine, isActive ? styles.tabLineActive : styles.tabLineInactive)
      : cn(styles.tab, styles.tabPill, isActive ? styles.tabPillActive : styles.tabPillInactive);

  return (
    <button
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      type="button"
      onClick={() => onChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(tabClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, className, children, ...props }) => {
  const { activeTab, instanceId } = useTabsContext();
  const tabId = `${instanceId}-tab-${value}`;
  const panelId = `${instanceId}-panel-${value}`;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={activeTab !== value}
      className={cn(styles.tabPanel, className)}
      {...props}
    >
      {children}
    </div>
  );
};

Tabs.displayName = 'Tabs';
TabList.displayName = 'TabList';
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
