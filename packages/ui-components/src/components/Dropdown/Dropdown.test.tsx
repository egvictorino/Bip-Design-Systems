import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from './Dropdown';

// ─── Fixture ──────────────────────────────────────────────────────────────────

const DefaultDropdown = ({ onItemClick = vi.fn() }: { onItemClick?: () => void }) => (
  <Dropdown>
    <DropdownTrigger>
      <button type="button">Abrir menú</button>
    </DropdownTrigger>
    <DropdownMenu>
      <DropdownItem onClick={onItemClick}>Editar</DropdownItem>
      <DropdownItem>Duplicar</DropdownItem>
      <DropdownDivider />
      <DropdownItem danger>Eliminar</DropdownItem>
      <DropdownItem disabled>Deshabilitado</DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

const open = () => fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Dropdown', () => {
  // ── Open / close ─────────────────────────────────────────────────────────

  it('menu is not visible initially', () => {
    render(<DefaultDropdown />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking the trigger opens the menu', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('clicking the trigger again closes the menu', () => {
    render(<DefaultDropdown />);
    open();
    open();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking outside (mousedown on document) closes the menu', () => {
    render(<DefaultDropdown />);
    open();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // ── ARIA attributes ───────────────────────────────────────────────────────

  it('trigger has aria-haspopup="true" and aria-expanded reflects state', () => {
    render(<DefaultDropdown />);
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    open();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-controls points to the menu id', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute(
      'aria-controls',
      screen.getByRole('menu').id
    );
  });

  it('menu has role="menu", aria-orientation="vertical" and aria-labelledby pointing to trigger', () => {
    render(<DefaultDropdown />);
    open();
    const menu = screen.getByRole('menu');
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });
    expect(menu).toHaveAttribute('aria-orientation', 'vertical');
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('items have role="menuitem"', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThanOrEqual(4);
  });

  // ── Keyboard: Escape ──────────────────────────────────────────────────────

  it('pressing Escape closes the menu', () => {
    render(<DefaultDropdown />);
    open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('pressing Escape returns focus to the trigger', () => {
    render(<DefaultDropdown />);
    open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Abrir menú' }));
  });

  // ── Keyboard: Tab ────────────────────────────────────────────────────────

  it('pressing Tab inside the menu closes it (WAI-ARIA requirement)', () => {
    render(<DefaultDropdown />);
    open();
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'Tab' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // ── Keyboard: Arrow navigation ────────────────────────────────────────────

  it('ArrowDown moves focus to the next enabled item', () => {
    render(<DefaultDropdown />);
    open();
    const menu = screen.getByRole('menu');
    // First item gets focus on open; ArrowDown should move to second
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Duplicar' }));
  });

  it('ArrowUp from first item wraps to the last enabled item', () => {
    render(<DefaultDropdown />);
    open();
    const menu = screen.getByRole('menu');
    // First item has focus on open; ArrowUp wraps to last enabled
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Eliminar' }));
  });

  it('End moves focus to the last enabled item', () => {
    render(<DefaultDropdown />);
    open();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Eliminar' }));
  });

  it('Home moves focus to the first enabled item', () => {
    render(<DefaultDropdown />);
    open();
    // Move to last first, then Home
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Editar' }));
  });

  // ── Item interaction ──────────────────────────────────────────────────────

  it('clicking an item calls its onClick and closes the menu', () => {
    const onItemClick = vi.fn();
    render(<DefaultDropdown onItemClick={onItemClick} />);
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item is disabled and does not close the menu on click', () => {
    render(<DefaultDropdown />);
    open();
    const disabledItem = screen.getByRole('menuitem', { name: 'Deshabilitado' });
    expect(disabledItem).toBeDisabled();
    fireEvent.click(disabledItem);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  // ── danger variant ────────────────────────────────────────────────────────

  it('danger item has error text color class', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toHaveClass(
      'text-feedback-error-default'
    );
  });

  // ── icon prop ─────────────────────────────────────────────────────────────

  it('icon prop renders an aria-hidden icon wrapper', () => {
    const icon = <svg data-testid="icon" />;
    render(
      <Dropdown>
        <DropdownTrigger>
          <button type="button">Abrir</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem icon={icon}>Con icono</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const iconWrapper = screen.getByTestId('icon').parentElement!;
    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Divider ───────────────────────────────────────────────────────────────

  it('DropdownDivider renders with role="separator"', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  // ── placement ─────────────────────────────────────────────────────────────

  it.each(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const)(
    'placement %s renders the menu',
    (placement) => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button type="button">Abrir</button>
          </DropdownTrigger>
          <DropdownMenu placement={placement}>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    }
  );

  // ── Context guard ─────────────────────────────────────────────────────────

  it('throws when sub-components are used outside <Dropdown>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <DropdownMenu>
          <DropdownItem>Item</DropdownItem>
        </DropdownMenu>
      )
    ).toThrow();
    consoleError.mockRestore();
  });
});
