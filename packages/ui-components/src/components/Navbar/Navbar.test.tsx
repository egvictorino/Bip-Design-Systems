import { render, screen } from '@testing-library/react';
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

  it('mobile menu panel appears after opening', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    // Mobile panel is conditionally rendered — not in DOM when closed
    expect(document.getElementById(mobileMenuId)).not.toBeInTheDocument();

    await user.click(toggle);
    expect(document.getElementById(mobileMenuId)).toBeInTheDocument();
  });

  it('pressing Escape closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;

    await user.click(toggle);
    expect(document.getElementById(mobileMenuId)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(document.getElementById(mobileMenuId)).not.toBeInTheDocument();
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
    expect(document.getElementById(mobileMenuId)).toBeInTheDocument();

    await user.click(document.body);
    expect(document.getElementById(mobileMenuId)).not.toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass(
      'bg-interaction-tertiary-default'
    );
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
    expect(document.getElementById(mobileMenuId)).toBeInTheDocument();

    // NavbarNav renders items in both desktop and mobile lists — click any instance
    await user.click(screen.getAllByRole('button', { name: 'Inicio' })[0]);
    expect(document.getElementById(mobileMenuId)).not.toBeInTheDocument();
  });

  it('clicking NavbarBrand link closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    await user.click(toggle);
    const mobileMenuId = toggle.getAttribute('aria-controls') as string;
    expect(document.getElementById(mobileMenuId)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'MiApp' }));
    expect(document.getElementById(mobileMenuId)).not.toBeInTheDocument();
  });
});
