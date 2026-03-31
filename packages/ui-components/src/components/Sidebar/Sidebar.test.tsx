import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
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
} from './Sidebar';

const HomeIcon = () => <svg data-testid="home-icon" aria-hidden="true" />;
const FolderIcon = () => <svg data-testid="folder-icon" aria-hidden="true" />;

const DefaultSidebar = ({
  isOpen = false,
  onClose = vi.fn(),
  defaultCollapsed = false,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  defaultCollapsed?: boolean;
}) => (
  <Sidebar isOpen={isOpen} onClose={onClose} defaultCollapsed={defaultCollapsed}>
    <SidebarHeader>
      <SidebarBrand>BipUI</SidebarBrand>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup label="Principal">
        <SidebarItem href="#" icon={<HomeIcon />}>Dashboard</SidebarItem>
        <SidebarItem href="#" icon={<HomeIcon />} active>Usuarios</SidebarItem>
        <SidebarItem href="#" icon={<HomeIcon />} disabled>Reportes</SidebarItem>
        <SidebarItem icon={<HomeIcon />}>Ajustes</SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <p>Footer content</p>
    </SidebarFooter>
  </Sidebar>
);

describe('Sidebar', () => {
  it('renders header, content, group label, and footer', () => {
    render(<DefaultSidebar />);
    expect(screen.getByText('BipUI')).toBeInTheDocument();
    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('has aria-label "Navegación lateral" on the aside element', () => {
    render(<DefaultSidebar />);
    expect(screen.getByRole('complementary', { name: 'Navegación lateral' })).toBeInTheDocument();
  });

  it('SidebarContent renders a <nav> landmark', () => {
    render(<DefaultSidebar />);
    expect(screen.getByRole('navigation', { name: 'Navegación' })).toBeInTheDocument();
  });

  it('active SidebarItem has aria-current="page"', () => {
    render(<DefaultSidebar />);
    expect(screen.getByRole('link', { name: 'Usuarios' })).toHaveAttribute('aria-current', 'page');
  });

  it('non-active SidebarItem does not have aria-current', () => {
    render(<DefaultSidebar />);
    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current');
  });

  it('disabled link SidebarItem has aria-disabled and tabIndex=-1', () => {
    render(<DefaultSidebar />);
    const disabledLink = screen.getByRole('link', { name: /reportes/i });
    expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    expect(disabledLink).toHaveAttribute('tabIndex', '-1');
  });

  it('disabled button SidebarItem has native disabled attribute', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem disabled>Bloqueado</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.getByRole('button', { name: /bloqueado/i })).toBeDisabled();
  });

  it('SidebarGroupLabel is visible when expanded', () => {
    render(<DefaultSidebar />);
    expect(screen.getByText('Principal')).toBeInTheDocument();
  });

  it('SidebarGroupLabel is hidden when collapsed (via label prop)', () => {
    render(<DefaultSidebar defaultCollapsed />);
    expect(screen.queryByText('Principal')).not.toBeInTheDocument();
  });

  it('standalone SidebarGroupLabel is hidden when collapsed', () => {
    render(
      <Sidebar defaultCollapsed>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Standalone label</SidebarGroupLabel>
            <SidebarItem icon={<HomeIcon />}>Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.queryByText('Standalone label')).not.toBeInTheDocument();
  });

  it('SidebarTrigger toggles collapsed state and updates aria-label', () => {
    render(<DefaultSidebar />);
    const trigger = screen.getByRole('button', { name: 'Colapsar sidebar' });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Expandir sidebar' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expandir sidebar' }));
    expect(screen.getByRole('button', { name: 'Colapsar sidebar' })).toBeInTheDocument();
  });

  it('SidebarTrigger has aria-expanded reflecting expanded state', () => {
    render(<DefaultSidebar />);
    const trigger = screen.getByRole('button', { name: 'Colapsar sidebar' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Expandir sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('SidebarTrigger has aria-controls pointing to the sidebar panel', () => {
    render(<DefaultSidebar />);
    const trigger = screen.getByRole('button', { name: 'Colapsar sidebar' });
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(trigger).toHaveAttribute('aria-controls', aside.id);
  });

  it('hides item text and shows icon when collapsed', () => {
    render(<DefaultSidebar defaultCollapsed />);
    // When collapsed, links still have aria-label for screen readers...
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    // ...but no inline text <span> is rendered inside the link (only the icon)
    expect(dashboardLink.querySelector('span')).toBeNull();
    // Icons should be present
    expect(screen.getAllByTestId('home-icon').length).toBeGreaterThan(0);
  });

  it('shows overlay when isOpen=true', () => {
    render(<DefaultSidebar isOpen />);
    expect(screen.getByTestId('mobile-overlay')).toBeInTheDocument();
  });

  it('does not show overlay when isOpen=false', () => {
    render(<DefaultSidebar isOpen={false} />);
    expect(screen.queryByTestId('mobile-overlay')).not.toBeInTheDocument();
  });

  it('clicking the overlay calls onClose', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen onClose={onClose} />);
    fireEvent.click(screen.getByTestId('mobile-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape calls onClose when isOpen', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape does NOT call onClose when sidebar is closed', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('clicking a SidebarItem calls onClose (closes mobile drawer)', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('link', { name: /dashboard/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking a disabled SidebarItem does not call onClose', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('link', { name: /reportes/i }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('SidebarBrand is visible when expanded', () => {
    render(<DefaultSidebar />);
    expect(screen.getByText('BipUI')).toBeInTheDocument();
  });

  it('SidebarBrand is hidden when collapsed', () => {
    render(<DefaultSidebar defaultCollapsed />);
    expect(screen.queryByText('BipUI')).not.toBeInTheDocument();
  });

  it('SidebarBrand renders an anchor when href is provided', () => {
    render(
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand href="/home">MyApp</SidebarBrand>
          <SidebarTrigger />
        </SidebarHeader>
      </Sidebar>
    );
    const link = screen.getByRole('link', { name: 'MyApp' });
    expect(link).toHaveAttribute('href', '/home');
  });

  it('throws when sub-components are used outside <Sidebar>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SidebarTrigger />)).toThrow();
    consoleError.mockRestore();
  });

  it('aside has panelExpanded class when expanded', () => {
    render(<DefaultSidebar />);
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside).toHaveClass('panelExpanded');
  });

  it('aside has panelCollapsed class when collapsed', () => {
    render(<DefaultSidebar defaultCollapsed />);
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside).toHaveClass('panelCollapsed');
  });

  it('Sidebar forwards className to the aside panel', () => {
    render(<DefaultSidebar />);
    // DefaultSidebar doesn't pass className, verify the aside exists
    // Render directly with className
    render(
      <Sidebar className="my-sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem>Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const asides = screen.getAllByRole('complementary', { name: 'Navegación lateral' });
    // The second aside (last rendered) has the className
    expect(asides[asides.length - 1].className).toMatch(/my-sidebar/);
  });
});

// ─── Variant tests ────────────────────────────────────────────────────────────

describe('Sidebar — variant', () => {
  it('applies variantLight class by default', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem>Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside).toHaveClass('variantLight');
  });

  it('applies variantDark class when variant="dark"', () => {
    render(
      <Sidebar variant="dark">
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem>Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside).toHaveClass('variantDark');
  });

  it('applies variantPrimary class when variant="primary"', () => {
    render(
      <Sidebar variant="primary">
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem>Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside).toHaveClass('variantPrimary');
  });
});

// ─── Badge tests ──────────────────────────────────────────────────────────────

describe('SidebarItem — badge', () => {
  it('shows numeric badge when expanded', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<HomeIcon />} badge={5}>Notificaciones</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows string badge when expanded', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<HomeIcon />} badge="nuevo">Mensajes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.getByText('nuevo')).toBeInTheDocument();
  });

  it('truncates badge to "99+" when value exceeds 99', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<HomeIcon />} badge={150}>Mensajes</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.getByText('99+')).toBeInTheDocument();
    expect(screen.queryByText('150')).not.toBeInTheDocument();
  });

  it('hides badge when sidebar is collapsed', () => {
    render(
      <Sidebar defaultCollapsed>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<HomeIcon />} badge={5}>Notificaciones</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('includes badge count in aria-label when collapsed', () => {
    render(
      <Sidebar defaultCollapsed>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={<HomeIcon />} badge={5}>Notificaciones</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const item = screen.getByRole('button', { name: /notificaciones/i });
    expect(item).toHaveAttribute('aria-label', expect.stringContaining('5 notificaciones'));
  });
});

// ─── SidebarSubMenu tests ─────────────────────────────────────────────────────

describe('SidebarSubMenu', () => {
  const SubMenuSidebar = ({
    defaultOpen = false,
    defaultCollapsed = false,
  }: {
    defaultOpen?: boolean;
    defaultCollapsed?: boolean;
  }) => (
    <Sidebar defaultCollapsed={defaultCollapsed}>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarSubMenu label="Archivos" icon={<FolderIcon />} defaultOpen={defaultOpen}>
            <SidebarItem href="#">Documentos</SidebarItem>
            <SidebarItem href="#">Imágenes</SidebarItem>
          </SidebarSubMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  it('renders the trigger button with label', () => {
    render(<SubMenuSidebar />);
    expect(screen.getByRole('button', { name: /archivos/i })).toBeInTheDocument();
  });

  it('sub-items are hidden when defaultOpen=false', () => {
    render(<SubMenuSidebar defaultOpen={false} />);
    const trigger = screen.getByRole('button', { name: /archivos/i });
    const controlsId = trigger.getAttribute('aria-controls')!;
    const subMenuList = document.getElementById(controlsId)!;
    // When closed, the list does NOT have the open class (max-height stays 0)
    expect(subMenuList).not.toHaveClass('subMenuListOpen');
  });

  it('sub-items are visible when defaultOpen=true', () => {
    render(<SubMenuSidebar defaultOpen />);
    expect(screen.getByText('Documentos')).toBeVisible();
  });

  it('clicking the trigger toggles the sub-menu open', () => {
    render(<SubMenuSidebar defaultOpen={false} />);
    const trigger = screen.getByRole('button', { name: /archivos/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking the trigger again closes the sub-menu', () => {
    render(<SubMenuSidebar defaultOpen />);
    const trigger = screen.getByRole('button', { name: /archivos/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger has aria-controls pointing to the sub-menu list', () => {
    render(<SubMenuSidebar defaultOpen />);
    const trigger = screen.getByRole('button', { name: /archivos/i });
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    const list = document.getElementById(controlsId!);
    expect(list).toBeInTheDocument();
  });

  it('shows icon only when sidebar is collapsed', () => {
    render(<SubMenuSidebar defaultCollapsed />);
    // Icon is present
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    // No expand/collapse trigger button for sub-menu (collapsed mode shows plain icon button)
    // The sub-menu children are not rendered in the collapsed state
    expect(screen.queryByText('Documentos')).not.toBeInTheDocument();
    // Label text is inside a Tooltip (role="tooltip"), not as visible button text
    const tooltips = screen.queryAllByRole('tooltip');
    const labelInTooltip = tooltips.some((t) => t.textContent?.includes('Archivos'));
    expect(labelInTooltip).toBe(true);
  });

  it('Escape key closes an open sub-menu', () => {
    render(<SubMenuSidebar defaultOpen />);
    const trigger = screen.getByRole('button', { name: /archivos/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows badge on trigger when expanded', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarSubMenu label="Archivos" icon={<FolderIcon />} badge={3}>
              <SidebarItem href="#">Documentos</SidebarItem>
            </SidebarSubMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides badge when sidebar is collapsed', () => {
    render(
      <Sidebar defaultCollapsed>
        <SidebarContent>
          <SidebarGroup>
            <SidebarSubMenu label="Archivos" icon={<FolderIcon />} badge={3}>
              <SidebarItem href="#">Documentos</SidebarItem>
            </SidebarSubMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('collapses automatically when sidebar collapses', () => {
    render(<SubMenuSidebar defaultOpen />);
    // Initially the sub-menu trigger has aria-expanded="true"
    expect(screen.getByRole('button', { name: /archivos/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    // Collapse the sidebar (SidebarTrigger is included in SubMenuSidebar)
    fireEvent.click(screen.getByRole('button', { name: /colapsar sidebar/i }));

    // Expand the sidebar again
    fireEvent.click(screen.getByRole('button', { name: /expandir sidebar/i }));

    // After re-expanding, the sub-menu should be closed (auto-reset on collapse)
    expect(screen.getByRole('button', { name: /archivos/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});

// ─── Arrow key navigation tests ───────────────────────────────────────────────

describe('Sidebar — arrow key navigation', () => {
  it('ArrowDown moves focus to the next item', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const item1 = screen.getByRole('link', { name: /item 1/i });
    const item2 = screen.getByRole('link', { name: /item 2/i });

    item1.focus();
    fireEvent.keyDown(item1, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item2);
  });

  it('ArrowUp moves focus to the previous item', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const item1 = screen.getByRole('link', { name: /item 1/i });
    const item2 = screen.getByRole('link', { name: /item 2/i });

    item2.focus();
    fireEvent.keyDown(item2, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(item1);
  });

  it('Home moves focus to the first item', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 3</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const item1 = screen.getByRole('link', { name: /item 1/i });
    const item3 = screen.getByRole('link', { name: /item 3/i });

    item3.focus();
    fireEvent.keyDown(item3, { key: 'Home' });
    expect(document.activeElement).toBe(item1);
  });

  it('End moves focus to the last item', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 3</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
    const item1 = screen.getByRole('link', { name: /item 1/i });
    const item3 = screen.getByRole('link', { name: /item 3/i });

    item1.focus();
    fireEvent.keyDown(item1, { key: 'End' });
    expect(document.activeElement).toBe(item3);
  });
});

// ─── Focus trap tests ─────────────────────────────────────────────────────────

describe('Sidebar — focus trap (mobile)', () => {
  it('Tab key wraps from last to first focusable element when mobile is open', () => {
    render(
      <Sidebar isOpen onClose={vi.fn()}>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    const focusable = aside.querySelectorAll<HTMLElement>(
      'a:not([tabindex="-1"]), button:not([disabled])'
    );
    const lastEl = focusable[focusable.length - 1];
    const firstEl = focusable[0];

    // Simulate Tab from last element
    lastEl.focus();
    expect(document.activeElement).toBe(lastEl);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(firstEl);
  });

  it('Shift+Tab key wraps from first to last focusable element when mobile is open', () => {
    render(
      <Sidebar isOpen onClose={vi.fn()}>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 1</SidebarItem>
            <SidebarItem href="#" icon={<HomeIcon />}>Item 2</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );

    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    const focusable = aside.querySelectorAll<HTMLElement>(
      'a:not([tabindex="-1"]), button:not([disabled])'
    );
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    firstEl.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastEl);
  });
});
