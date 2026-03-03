import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
} from './Dropdown';

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

describe('Dropdown', () => {
  it('menu is not visible initially', () => {
    render(<DefaultDropdown />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking the trigger opens the menu', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('clicking the trigger again closes the menu', () => {
    render(<DefaultDropdown />);
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('trigger has aria-haspopup="true" and aria-expanded reflects state', () => {
    render(<DefaultDropdown />);
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-controls points to the menu', () => {
    render(<DefaultDropdown />);
    const trigger = screen.getByRole('button', { name: 'Abrir menú' });
    fireEvent.click(trigger);
    const menu = screen.getByRole('menu');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
  });

  it('menu has role="menu" and aria-orientation="vertical"', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('items have role="menuitem"', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThanOrEqual(4);
  });

  it('pressing Escape closes the menu', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking outside (mousedown on document) closes the menu', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('clicking an item calls its onClick and closes the menu', () => {
    const onItemClick = vi.fn();
    render(<DefaultDropdown onItemClick={onItemClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled item is disabled', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('menuitem', { name: 'Deshabilitado' })).toBeDisabled();
  });

  it('DropdownDivider renders with role="separator"', () => {
    render(<DefaultDropdown />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('throws when sub-components are used outside <Dropdown>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DropdownMenu><DropdownItem>Item</DropdownItem></DropdownMenu>)).toThrow();
    consoleError.mockRestore();
  });
});
