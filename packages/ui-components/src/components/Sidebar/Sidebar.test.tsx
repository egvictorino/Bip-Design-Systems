import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarFooter,
  SidebarTrigger,
} from './Sidebar';

const HomeIcon = () => <svg data-testid="home-icon" aria-hidden="true" />;

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
    // ...but no inline text span is rendered inside the link
    expect(within(dashboardLink).queryByText('Dashboard')).not.toBeInTheDocument();
    // Icons should be present
    expect(screen.getAllByTestId('home-icon').length).toBeGreaterThan(0);
  });

  it('shows overlay when isOpen=true', () => {
    render(<DefaultSidebar isOpen />);
    // Overlay has aria-hidden="true" so we need { hidden: true } to find it
    expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
  });

  it('does not show overlay when isOpen=false', () => {
    render(<DefaultSidebar isOpen={false} />);
    expect(screen.queryByRole('presentation', { hidden: true })).not.toBeInTheDocument();
  });

  it('clicking the overlay calls onClose', () => {
    const onClose = vi.fn();
    render(<DefaultSidebar isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('presentation', { hidden: true }));
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

  it('aside has w-60 class when expanded', () => {
    render(<DefaultSidebar />);
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside.className).toMatch(/w-60/);
  });

  it('aside has w-16 class when collapsed', () => {
    render(<DefaultSidebar defaultCollapsed />);
    const aside = screen.getByRole('complementary', { name: 'Navegación lateral' });
    expect(aside.className).toMatch(/w-16/);
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
