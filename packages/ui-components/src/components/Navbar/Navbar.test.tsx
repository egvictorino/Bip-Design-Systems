import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Navbar, NavbarBrand, NavbarNav, NavbarItem, NavbarActions } from './Navbar';
import { Button } from '../Button';

const renderNavbar = () =>
  render(
    <Navbar>
      <NavbarBrand href="/">MiApp</NavbarBrand>
      <NavbarNav>
        <NavbarItem href="/dashboard" active>
          Dashboard
        </NavbarItem>
        <NavbarItem href="/clientes">Clientes</NavbarItem>
        <NavbarItem href="/reportes" disabled>
          Reportes
        </NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button size="sm">Cerrar sesión</Button>
      </NavbarActions>
    </Navbar>
  );

describe('Navbar', () => {
  // ─── Basic rendering ────────────────────────────────────────────────────────

  it('renders brand text', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'MiApp' })).toBeInTheDocument();
  });

  it('renders nav items', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clientes' })).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  it('active NavbarItem has aria-current="page"', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('inactive NavbarItem does not have aria-current', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Clientes' })).not.toHaveAttribute('aria-current');
  });

  it('disabled NavbarItem link has aria-disabled="true"', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Reportes' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('disabled NavbarItem button is natively disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem disabled onClick={onClick}>
            Bloqueado
          </NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    const btn = screen.getByRole('button', { name: 'Bloqueado' });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  // ─── Mobile menu toggle ─────────────────────────────────────────────────────

  it('hamburger button is present with aria-expanded=false initially', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('hamburger button toggles aria-expanded on click', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('mobile menu panel is hidden by default with aria-hidden', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;
    const panel = document.getElementById(mobileMenuId);

    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  it('mobile menu panel becomes visible after opening', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    const panel = document.getElementById(mobileMenuId);
    expect(panel).toHaveAttribute('aria-hidden', 'false');
  });

  // Regression test: the panel used to pass inert={isMobileOpen ? undefined : ''}. Under
  // React 19's boolean-attribute handling, an empty string is treated as falsy — the
  // opposite of intent — and logs "Received an empty string for a boolean attribute
  // `inert`" to the console. Passing `true`/`false` (not `''`/`undefined`) is what makes the
  // attribute presence match intent under both React 18 and 19.
  it('mobile menu panel sets inert (a real boolean, not an empty string) when closed', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;
    const panel = document.getElementById(mobileMenuId) as HTMLElement;

    // Closed by default: inert must be present so the panel's contents are out of the tab
    // order and hidden from assistive tech, matching its aria-hidden="true" sibling above.
    expect(panel.hasAttribute('inert')).toBe(true);

    await user.click(toggle);

    // Open: inert must be absent entirely, matching aria-hidden="false".
    expect(panel.hasAttribute('inert')).toBe(false);
  });

  it('pressing Escape closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'false');

    await user.keyboard('{Escape}');
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'true');
  });

  it('NavbarItem button variant calls onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem onClick={onClick}>Inicio</NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    await user.click(screen.getByRole('button', { name: 'Inicio' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('NavbarBrand renders as anchor when href is provided', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'MiApp' })).toHaveAttribute('href', '/');
  });

  it('NavbarBrand renders as span when no href is provided', () => {
    render(
      <Navbar>
        <NavbarBrand>MiApp sin link</NavbarBrand>
      </Navbar>
    );
    expect(screen.getByText('MiApp sin link').tagName).toBe('SPAN');
  });

  it('clicking outside closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'false');

    await user.click(document.body);
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'true');
  });

  it('nav landmark has accessible label', () => {
    renderNavbar();
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
  });

  it('disabled NavbarItem link has tabIndex={-1} to prevent keyboard focus', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Reportes' })).toHaveAttribute('tabindex', '-1');
  });

  it('NavbarItem without href renders a button element', () => {
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem>Inicio</NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument();
  });

  it('active NavbarItem has the active background class', () => {
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('navItemActive');
  });

  it('clicking a NavbarItem button closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem>Inicio</NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    await user.click(toggle);
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'false');

    await user.click(screen.getAllByRole('button', { name: 'Inicio' })[0]);
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'true');
  });

  it('clicking NavbarBrand link closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    await user.click(toggle);
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'false');

    await user.click(screen.getByRole('link', { name: 'MiApp' }));
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'true');
  });

  // ─── className propagation ──────────────────────────────────────────────────

  it('Navbar root applies custom className', () => {
    render(
      <Navbar className="my-navbar">
        <NavbarBrand>App</NavbarBrand>
      </Navbar>
    );
    expect(screen.getByRole('navigation')).toHaveClass('my-navbar');
  });

  it('NavbarBrand applies custom className', () => {
    render(
      <Navbar>
        <NavbarBrand className="my-brand">App</NavbarBrand>
      </Navbar>
    );
    expect(screen.getByText('App')).toHaveClass('my-brand');
  });

  it('NavbarItem applies custom className', () => {
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/x" className="my-item">
            Link
          </NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    expect(screen.getByRole('link', { name: 'Link' })).toHaveClass('my-item');
  });

  // ─── Variants ───────────────────────────────────────────────────────────────

  it('Navbar renders variantDefault class by default', () => {
    render(
      <Navbar>
        <NavbarBrand>App</NavbarBrand>
      </Navbar>
    );
    expect(screen.getByRole('navigation')).toHaveClass('variantDefault');
  });

  it('Navbar renders variantElevated class when variant="elevated"', () => {
    render(
      <Navbar variant="elevated">
        <NavbarBrand>App</NavbarBrand>
      </Navbar>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('variantElevated');
    expect(nav).not.toHaveClass('variantDefault');
  });

  it('Navbar renders variantTransparent class when variant="transparent"', () => {
    render(
      <Navbar variant="transparent">
        <NavbarBrand>App</NavbarBrand>
      </Navbar>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('variantTransparent');
    expect(nav).not.toHaveClass('variantDefault');
  });

  // ─── Icon prop ──────────────────────────────────────────────────────────────

  it('NavbarItem renders icon before text', () => {
    const icon = <svg data-testid="test-icon" />;
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem icon={icon}>Dashboard</NavbarItem>
        </NavbarNav>
      </Navbar>
    );
    // Items render in both desktop and mobile lists
    expect(screen.getAllByTestId('test-icon').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'Dashboard' }).length).toBeGreaterThanOrEqual(1);
  });

  it('NavbarItem icon-only with aria-label is accessible', () => {
    const icon = <svg data-testid="icon-only" />;
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem icon={icon} aria-label="Configuración" />
        </NavbarNav>
      </Navbar>
    );
    const buttons = screen.getAllByRole('button', { name: 'Configuración' });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(within(buttons[0]).getByTestId('icon-only')).toBeInTheDocument();
  });

  // ─── Keyboard navigation ───────────────────────────────────────────────────

  it('ArrowRight moves focus to next NavbarItem in desktop nav', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/a">A</NavbarItem>
          <NavbarItem href="/b">B</NavbarItem>
          <NavbarItem href="/c">C</NavbarItem>
        </NavbarNav>
      </Navbar>
    );

    const linkA = screen.getByRole('link', { name: 'A' });
    linkA.focus();
    expect(document.activeElement).toBe(linkA);

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'B' }));
  });

  it('ArrowLeft wraps around to last NavbarItem', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/a">A</NavbarItem>
          <NavbarItem href="/b">B</NavbarItem>
        </NavbarNav>
      </Navbar>
    );

    const linkA = screen.getByRole('link', { name: 'A' });
    linkA.focus();

    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'B' }));
  });

  it('Home moves focus to first NavbarItem', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/a">A</NavbarItem>
          <NavbarItem href="/b">B</NavbarItem>
          <NavbarItem href="/c">C</NavbarItem>
        </NavbarNav>
      </Navbar>
    );

    const linkC = screen.getByRole('link', { name: 'C' });
    linkC.focus();

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'A' }));
  });

  it('End moves focus to last NavbarItem', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/a">A</NavbarItem>
          <NavbarItem href="/b">B</NavbarItem>
          <NavbarItem href="/c">C</NavbarItem>
        </NavbarNav>
      </Navbar>
    );

    const linkA = screen.getByRole('link', { name: 'A' });
    linkA.focus();

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'C' }));
  });

  // ─── Overlay ────────────────────────────────────────────────────────────────

  it('overlay appears when mobile menu is open', async () => {
    const user = userEvent.setup();
    renderNavbar();

    expect(screen.queryByTestId('navbar-overlay')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByTestId('navbar-overlay')).toBeInTheDocument();
  });

  it('clicking overlay closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'false');

    await user.click(screen.getByTestId('navbar-overlay'));
    expect(document.getElementById(mobileMenuId)).toHaveAttribute('aria-hidden', 'true');
  });

  // ─── Mobile actions ─────────────────────────────────────────────────────────

  it('NavbarActions content is rendered in mobile panel', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    const panel = document.getElementById(mobileMenuId)!;
    expect(within(panel).getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });

  // ─── Focus management ──────────────────────────────────────────────────────

  it('opening mobile menu moves focus to first item', async () => {
    const user = userEvent.setup();
    render(
      <Navbar>
        <NavbarNav>
          <NavbarItem href="/a">Primero</NavbarItem>
          <NavbarItem href="/b">Segundo</NavbarItem>
        </NavbarNav>
      </Navbar>
    );

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));

    // requestAnimationFrame is used for focus — flush it
    await new Promise((r) => requestAnimationFrame(r));

    // The first item inside the mobile panel should have focus
    const mobilePanel = document.getElementById(
      screen.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-controls')!
    )!;
    const firstMobileItem = within(mobilePanel).getByRole('link', { name: 'Primero' });
    expect(document.activeElement).toBe(firstMobileItem);
  });

  it('closing mobile menu returns focus to hamburger button', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
    await user.keyboard('{Escape}');

    // Focus should return to the hamburger button
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Abrir menú' }));
  });
});
