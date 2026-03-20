import React, { useId, useState, useContext } from 'react';
import { cn } from '../../lib/cn';

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

// ─── Style helpers ────────────────────────────────────────────────────────────

const getTabClasses = (variant: 'line' | 'pill', isActive: boolean) =>
  cn(
    'text-sm font-medium whitespace-nowrap transition-colors',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    variant === 'line' && 'px-4 py-2 -mb-px border-b-2',
    variant === 'line' && isActive && 'border-primary',
    variant === 'line' && isActive && 'text-primary',
    variant === 'line' && !isActive && 'border-transparent text-txt-secondary',
    variant === 'line' && !isActive && 'hover:text-txt',
    variant === 'line' && !isActive && 'hover:border-edge-hover',
    variant === 'pill' && 'px-4 py-1.5 rounded-md',
    variant === 'pill' && isActive && 'bg-white shadow-sm text-txt',
    variant === 'pill' && !isActive && 'text-txt-secondary',
    variant === 'pill' && !isActive && 'hover:text-txt hover:bg-white/50'
  );

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
      <div className={cn('w-full', className)}>{children}</div>
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
        variant === 'line' && 'flex border-b border-edge',
        variant === 'pill' && 'inline-flex gap-1 p-1 bg-surface-3/50 rounded-lg',
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
      className={cn(getTabClasses(variant, isActive), className)}
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
      className={cn('focus:outline-none', className)}
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
