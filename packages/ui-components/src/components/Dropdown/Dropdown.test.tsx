import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownGroup,
  DropdownSearch,
  DropdownItemCheckbox,
  DropdownSubmenu,
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
      <DropdownItem variant="danger">Eliminar</DropdownItem>
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

  it('danger item has itemDanger class', () => {
    render(<DefaultDropdown />);
    open();
    expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toHaveClass(
      'itemDanger'
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

  // ── Controlled open ───────────────────────────────────────────────────────

  it('open prop controls menu visibility and onOpenChange is called on toggle', () => {
    const onOpenChange = vi.fn();
    const ControlledDropdown = ({ open }: { open: boolean }) => (
      <Dropdown open={open} onOpenChange={onOpenChange}>
        <DropdownTrigger>
          <button type="button">Abrir menú</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Editar</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );

    const { rerender } = render(<ControlledDropdown open={false} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Clicking the trigger does not open the menu by itself — the parent must
    // react to onOpenChange and pass a new `open` value.
    open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(<ControlledDropdown open={true} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('defaultOpen seeds the initial uncontrolled state', () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>
          <button type="button">Abrir menú</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Editar</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

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

// ─── DropdownGroup ────────────────────────────────────────────────────────────

describe('DropdownGroup', () => {
  const GroupDropdown = () => (
    <Dropdown>
      <DropdownTrigger>
        <button type="button">Abrir</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownGroup label="Acciones">
          <DropdownItem>Editar</DropdownItem>
          <DropdownItem>Duplicar</DropdownItem>
        </DropdownGroup>
        <DropdownGroup label="Zona peligrosa">
          <DropdownItem variant="danger">Eliminar</DropdownItem>
        </DropdownGroup>
      </DropdownMenu>
    </Dropdown>
  );

  it('renders group containers with role="group"', () => {
    render(<GroupDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getAllByRole('group').length).toBe(2);
  });

  it('renders group label text', () => {
    render(<GroupDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByText('Acciones')).toBeInTheDocument();
    expect(screen.getByText('Zona peligrosa')).toBeInTheDocument();
  });

  it('group has aria-labelledby pointing to the label element', () => {
    render(<GroupDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const groups = screen.getAllByRole('group');
    const label = screen.getByText('Acciones');
    expect(groups[0]).toHaveAttribute('aria-labelledby', label.id);
  });

  it('items inside groups are still navigable with arrows', () => {
    render(<GroupDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const menu = screen.getByRole('menu');
    // First item (Editar) has focus on open; ArrowDown → Duplicar
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Duplicar' }));
  });
});

// ─── DropdownSearch ───────────────────────────────────────────────────────────

describe('DropdownSearch', () => {
  const SearchDropdown = ({ onChange = vi.fn() }: { onChange?: (v: string) => void }) => (
    <Dropdown>
      <DropdownTrigger>
        <button type="button">Abrir</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSearch placeholder="Buscar..." value="" onChange={onChange} />
        <DropdownItem>Editar</DropdownItem>
        <DropdownItem>Duplicar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  it('renders a searchbox input', () => {
    render(<SearchDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('has the correct aria-label', () => {
    render(<SearchDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Buscar opciones');
  });

  it('calls onChange when the user types', () => {
    const onChange = vi.fn();
    render(<SearchDropdown onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ed' } });
    expect(onChange).toHaveBeenCalledWith('ed');
  });

  it('stops propagation of ArrowDown so menu navigation does not trigger while typing', () => {
    render(<SearchDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const input = screen.getByRole('searchbox');
    // Focus the input explicitly (menu open focuses the first item by default)
    input.focus();
    expect(document.activeElement).toBe(input);
    // ArrowDown inside the input should not move menu focus away from the input
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(input);
  });

  it('allows Escape to propagate so the root Dropdown closes', () => {
    render(<SearchDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    // Escape propagates to the document listener which closes the root dropdown
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

// ─── DropdownItemCheckbox ─────────────────────────────────────────────────────

describe('DropdownItemCheckbox', () => {
  const CheckboxDropdown = ({
    checked = false,
    onChange = vi.fn(),
  }: {
    checked?: boolean;
    onChange?: (v: boolean) => void;
  }) => (
    <Dropdown>
      <DropdownTrigger>
        <button type="button">Abrir</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItemCheckbox checked={checked} onChange={onChange}>
          Activos
        </DropdownItemCheckbox>
        <DropdownItemCheckbox checked={false} onChange={vi.fn()}>
          Inactivos
        </DropdownItemCheckbox>
      </DropdownMenu>
    </Dropdown>
  );

  it('renders with role="menuitemcheckbox"', () => {
    render(<CheckboxDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getAllByRole('menuitemcheckbox').length).toBe(2);
  });

  it('reflects checked state via aria-checked', () => {
    render(<CheckboxDropdown checked={true} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('menuitemcheckbox', { name: /Activos/ })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('aria-checked is false when unchecked', () => {
    render(<CheckboxDropdown checked={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByRole('menuitemcheckbox', { name: /Activos/ })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('clicking calls onChange with toggled value', () => {
    const onChange = vi.fn();
    render(<CheckboxDropdown checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /Activos/ }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('clicking does NOT close the menu', () => {
    render(<CheckboxDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /Activos/ }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('disabled checkbox cannot be toggled', () => {
    const onChange = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger>
          <button type="button">Abrir</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItemCheckbox checked={false} onChange={onChange} disabled>
            Opción
          </DropdownItemCheckbox>
        </DropdownMenu>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Opción' });
    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('checkboxes are included in arrow-key navigation', () => {
    render(<CheckboxDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const menu = screen.getByRole('menu');
    // First checkbox (Activos) should be focused on open
    expect(document.activeElement).toBe(
      screen.getByRole('menuitemcheckbox', { name: /Activos/ })
    );
    // ArrowDown → second checkbox
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(
      screen.getByRole('menuitemcheckbox', { name: /Inactivos/ })
    );
  });
});

// ─── DropdownSubmenu ──────────────────────────────────────────────────────────

describe('DropdownSubmenu', () => {
  const SubmenuDropdown = () => (
    <Dropdown>
      <DropdownTrigger>
        <button type="button">Abrir</button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>Editar</DropdownItem>
        <DropdownSubmenu label="Mover a">
          <DropdownItem>Carpeta A</DropdownItem>
          <DropdownItem>Carpeta B</DropdownItem>
        </DropdownSubmenu>
        <DropdownItem variant="danger">Eliminar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  it('submenu is not visible initially', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    // Only the root menu is visible — submenu items are not rendered
    expect(screen.queryByRole('menuitem', { name: 'Carpeta A' })).not.toBeInTheDocument();
  });

  it('hovering the submenu trigger opens the submenu', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.getByRole('menuitem', { name: 'Carpeta A' })).toBeInTheDocument();
  });

  it('mouse-leaving the submenu container closes the submenu', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.getByRole('menuitem', { name: 'Carpeta A' })).toBeInTheDocument();
    fireEvent.mouseLeave(trigger.parentElement!);
    expect(screen.queryByRole('menuitem', { name: 'Carpeta A' })).not.toBeInTheDocument();
  });

  it('submenu trigger has aria-haspopup="menu"', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('aria-expanded reflects submenu open state', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('submenu trigger is included in root menu arrow navigation', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const menu = screen.getAllByRole('menu')[0];
    // Focus starts on first root item (Editar); ArrowDown → Mover a trigger
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: /Mover a/ }));
  });

  it('ArrowLeft inside submenu closes it and returns focus to trigger', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    fireEvent.mouseEnter(trigger.parentElement!);
    const submenus = screen.getAllByRole('menu');
    const submenu = submenus[submenus.length - 1];
    fireEvent.keyDown(submenu, { key: 'ArrowLeft' });
    expect(screen.queryByRole('menuitem', { name: 'Carpeta A' })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('clicking a submenu item closes the root dropdown', () => {
    render(<SubmenuDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Mover a/ });
    fireEvent.mouseEnter(trigger.parentElement!);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Carpeta A' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled submenu trigger cannot open submenu', () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <button type="button">Abrir</button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownSubmenu label="Sin permiso" disabled>
            <DropdownItem>Sub item</DropdownItem>
          </DropdownSubmenu>
        </DropdownMenu>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const trigger = screen.getByRole('menuitem', { name: /Sin permiso/ });
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.queryByRole('menuitem', { name: 'Sub item' })).not.toBeInTheDocument();
  });
});
