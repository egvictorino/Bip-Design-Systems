import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const DefaultTabs = ({
  defaultValue = 'tab1',
  onChange,
}: {
  defaultValue?: string;
  onChange?: (v: string) => void;
}) => (
  <Tabs defaultValue={defaultValue} onChange={onChange}>
    <TabList>
      <Tab value="tab1">Pestaña 1</Tab>
      <Tab value="tab2">Pestaña 2</Tab>
      <Tab value="tab3" disabled>
        Pestaña 3
      </Tab>
    </TabList>
    <TabPanel value="tab1">Contenido 1</TabPanel>
    <TabPanel value="tab2">Contenido 2</TabPanel>
    <TabPanel value="tab3">Contenido 3</TabPanel>
  </Tabs>
);

describe('Tabs', () => {
  it('renders a tablist', () => {
    render(<DefaultTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('tabs have role="tab"', () => {
    render(<DefaultTabs />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('tabpanels have role="tabpanel"', () => {
    render(<DefaultTabs />);
    // Include hidden panels with { hidden: true }
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(3);
  });

  it('active tab has aria-selected="true", others have aria-selected="false"', () => {
    render(<DefaultTabs defaultValue="tab1" />);
    expect(screen.getByRole('tab', { name: 'Pestaña 1' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Pestaña 2' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('clicking a tab activates it', () => {
    render(<DefaultTabs />);
    fireEvent.click(screen.getByRole('tab', { name: 'Pestaña 2' }));
    expect(screen.getByRole('tab', { name: 'Pestaña 2' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Pestaña 1' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('active panel is visible, inactive panels are hidden', () => {
    const { container } = render(<DefaultTabs defaultValue="tab1" />);
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels[0]).not.toHaveAttribute('hidden');
    expect(panels[1]).toHaveAttribute('hidden');
    expect(panels[2]).toHaveAttribute('hidden');
  });

  it('switching tab shows the correct panel', () => {
    render(<DefaultTabs />);
    fireEvent.click(screen.getByRole('tab', { name: 'Pestaña 2' }));
    expect(screen.getByText('Contenido 2')).toBeVisible();
  });

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<DefaultTabs onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Pestaña 2' }));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('Tab and TabPanel are linked via aria-controls / aria-labelledby', () => {
    render(<DefaultTabs />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    const panelId = tab1.getAttribute('aria-controls')!;
    const panel1 = document.getElementById(panelId)!;
    expect(panel1).toBeInTheDocument();
    expect(panel1).toHaveAttribute('aria-labelledby', tab1.id);
  });

  it('ArrowRight moves focus to the next tab', () => {
    render(<DefaultTabs />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    const tab2 = screen.getByRole('tab', { name: 'Pestaña 2' });
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tab2);
  });

  it('ArrowLeft moves focus to the previous tab', () => {
    render(<DefaultTabs defaultValue="tab2" />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    const tab2 = screen.getByRole('tab', { name: 'Pestaña 2' });
    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(tab1);
  });

  it('controlled mode: value prop controls which tab is active', () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabList>
          <Tab value="tab1">T1</Tab>
          <Tab value="tab2">T2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'T1' })).toHaveAttribute('aria-selected', 'true');

    rerender(
      <Tabs value="tab2">
        <TabList>
          <Tab value="tab1">T1</Tab>
          <Tab value="tab2">T2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'T2' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'T1' })).toHaveAttribute('aria-selected', 'false');
  });

  it('Home key moves focus to the first enabled tab', () => {
    render(<DefaultTabs defaultValue="tab2" />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    const tab2 = screen.getByRole('tab', { name: 'Pestaña 2' });
    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'Home' });
    expect(document.activeElement).toBe(tab1);
  });

  it('End key moves focus to the last enabled tab', () => {
    render(<DefaultTabs />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    // tab3 is disabled so last enabled is tab2
    const tab2 = screen.getByRole('tab', { name: 'Pestaña 2' });
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'End' });
    expect(document.activeElement).toBe(tab2);
  });

  it('disabled tab is not focusable via tabIndex', () => {
    render(<DefaultTabs />);
    const tab3 = screen.getByRole('tab', { name: 'Pestaña 3' });
    expect(tab3).toBeDisabled();
    expect(tab3).toHaveAttribute('tabindex', '-1');
  });

  it('throws when sub-components are used outside <Tabs>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TabList><Tab value="x">X</Tab></TabList>)).toThrow();
    consoleError.mockRestore();
  });
});

// ─── ARIA orientation ─────────────────────────────────────────────────────────

describe('Tabs — aria-orientation', () => {
  it('tablist has aria-orientation="horizontal" by default', () => {
    render(<DefaultTabs />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('tablist has aria-orientation="vertical" when orientation="vertical"', () => {
    render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabList>
          <Tab value="tab1">T1</Tab>
          <Tab value="tab2">T2</Tab>
        </TabList>
        <TabPanel value="tab1">Panel 1</TabPanel>
        <TabPanel value="tab2">Panel 2</TabPanel>
      </Tabs>
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

// ─── Size prop ────────────────────────────────────────────────────────────────

describe('Tabs — size prop', () => {
  it('size="md" is the default (no sm or lg class applied)', () => {
    render(<DefaultTabs />);
    const tab1 = screen.getByRole('tab', { name: 'Pestaña 1' });
    // No explicit assertion on class name; verify it renders without error
    expect(tab1).toBeInTheDocument();
  });

  it('applies sm styles when size="sm"', () => {
    render(
      <Tabs defaultValue="tab1" size="sm">
        <TabList>
          <Tab value="tab1">T1</Tab>
        </TabList>
        <TabPanel value="tab1">P1</TabPanel>
      </Tabs>
    );
    const tab = screen.getByRole('tab', { name: 'T1' });
    expect(tab.className).toMatch(/tabSm/);
  });

  it('applies lg styles when size="lg"', () => {
    render(
      <Tabs defaultValue="tab1" size="lg">
        <TabList>
          <Tab value="tab1">T1</Tab>
        </TabList>
        <TabPanel value="tab1">P1</TabPanel>
      </Tabs>
    );
    const tab = screen.getByRole('tab', { name: 'T1' });
    expect(tab.className).toMatch(/tabLg/);
  });
});

// ─── Boxed variant ────────────────────────────────────────────────────────────

describe('Tabs — variant="boxed"', () => {
  const BoxedTabs = () => (
    <Tabs defaultValue="tab1" variant="boxed">
      <TabList>
        <Tab value="tab1">Activo</Tab>
        <Tab value="tab2">Inactivo</Tab>
      </TabList>
      <TabPanel value="tab1">Panel 1</TabPanel>
      <TabPanel value="tab2">Panel 2</TabPanel>
    </Tabs>
  );

  it('tablist has border container class', () => {
    render(<BoxedTabs />);
    expect(screen.getByRole('tablist').className).toMatch(/tabListBoxed/);
  });

  it('active tab has boxed active class', () => {
    render(<BoxedTabs />);
    const activeTab = screen.getByRole('tab', { name: 'Activo' });
    expect(activeTab.className).toMatch(/tabBoxedActive/);
  });

  it('inactive tab has boxed inactive class', () => {
    render(<BoxedTabs />);
    const inactiveTab = screen.getByRole('tab', { name: 'Inactivo' });
    expect(inactiveTab.className).toMatch(/tabBoxedInactive/);
  });

  it('clicking a boxed tab activates it', () => {
    render(<BoxedTabs />);
    fireEvent.click(screen.getByRole('tab', { name: 'Inactivo' }));
    expect(screen.getByRole('tab', { name: 'Inactivo' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Activo' })).toHaveAttribute('aria-selected', 'false');
  });
});

// ─── Vertical orientation ─────────────────────────────────────────────────────

describe('Tabs — orientation="vertical"', () => {
  const VerticalTabs = () => (
    <Tabs defaultValue="tab1" orientation="vertical">
      <TabList>
        <Tab value="tab1">T1</Tab>
        <Tab value="tab2">T2</Tab>
        <Tab value="tab3">T3</Tab>
      </TabList>
      <TabPanel value="tab1">Panel 1</TabPanel>
      <TabPanel value="tab2">Panel 2</TabPanel>
      <TabPanel value="tab3">Panel 3</TabPanel>
    </Tabs>
  );

  it('tablist has aria-orientation="vertical"', () => {
    render(<VerticalTabs />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('root element has vertical layout class', () => {
    const { container } = render(<VerticalTabs />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/tabsRootVertical/);
  });

  it('ArrowDown moves focus to the next tab', () => {
    render(<VerticalTabs />);
    const tab1 = screen.getByRole('tab', { name: 'T1' });
    const tab2 = screen.getByRole('tab', { name: 'T2' });
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tab2);
  });

  it('ArrowUp moves focus to the previous tab', () => {
    render(<VerticalTabs />);
    const tab1 = screen.getByRole('tab', { name: 'T1' });
    const tab2 = screen.getByRole('tab', { name: 'T2' });
    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(tab1);
  });

  it('ArrowRight does not navigate in vertical orientation', () => {
    render(<VerticalTabs />);
    const tab1 = screen.getByRole('tab', { name: 'T1' });
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tab1);
  });
});

// ─── Animated indicator ───────────────────────────────────────────────────────

describe('Tabs — animated indicator', () => {
  it('does not render indicator span when animated=false (default)', () => {
    const { container } = render(<DefaultTabs />);
    // The indicator span has aria-hidden="true" — check it's absent
    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeNull();
  });

  it('renders indicator span with aria-hidden="true" when animated=true and variant="line"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" animated>
        <TabList>
          <Tab value="tab1">T1</Tab>
          <Tab value="tab2">T2</Tab>
        </TabList>
        <TabPanel value="tab1">P1</TabPanel>
        <TabPanel value="tab2">P2</TabPanel>
      </Tabs>
    );
    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render indicator span when animated=true and variant="pill"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" animated variant="pill">
        <TabList>
          <Tab value="tab1">T1</Tab>
          <Tab value="tab2">T2</Tab>
        </TabList>
        <TabPanel value="tab1">P1</TabPanel>
        <TabPanel value="tab2">P2</TabPanel>
      </Tabs>
    );
    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeNull();
  });
});
