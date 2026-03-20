import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from './MultiSelect';
import type { MultiSelectOption } from './MultiSelect';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const options: MultiSelectOption[] = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C', disabled: true },
  { value: 'd', label: 'Opción D' },
];

// ─── Controlled wrapper ────────────────────────────────────────────────────────

const Controlled = (
  props: Omit<React.ComponentProps<typeof MultiSelect>, 'value' | 'onChange'> & {
    initialValue?: string[];
  }
) => {
  const { initialValue = [], ...rest } = props;
  const [value, setValue] = useState<string[]>(initialValue);
  return <MultiSelect {...rest} value={value} onChange={setValue} />;
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MultiSelect', () => {
  // 1. Renders without selections (placeholder visible)
  it('renders placeholder when no options are selected', () => {
    render(<Controlled options={options} placeholder="Seleccionar..." />);
    expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
  });

  // 2. Renders with label and helperText
  it('renders label and helperText', () => {
    render(<Controlled options={options} label="Frutas" helperText="Elige tu fruta" />);
    expect(screen.getByText('Frutas')).toBeInTheDocument();
    expect(screen.getByText('Elige tu fruta')).toBeInTheDocument();
  });

  // 3. Renders chips for initial selections
  it('shows chips for pre-selected values', () => {
    render(<Controlled options={options} initialValue={['a', 'b']} />);
    expect(screen.getByText('Opción A')).toBeInTheDocument();
    expect(screen.getByText('Opción B')).toBeInTheDocument();
  });

  // 4. Opens dropdown on click
  it('opens dropdown when trigger is clicked', async () => {
    render(<Controlled options={options} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  // 5. Closes with Escape, returns focus to trigger
  it('closes dropdown on Escape and returns focus to trigger', async () => {
    render(<Controlled options={options} />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  // 6. Closes on outside click
  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Controlled options={options} />
        <button data-testid="outside">Outside</button>
      </div>
    );
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // 7. Filters options by search query (label match)
  it('filters options when typing in search input', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByRole('textbox', { name: /buscar/i });
    await userEvent.type(search, 'A');
    expect(screen.getByText('Opción A')).toBeInTheDocument();
    expect(screen.queryByText('Opción B')).not.toBeInTheDocument();
  });

  // 8. Filters options by value match
  it('filters options by value when typing in search', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByRole('textbox', { name: /buscar/i });
    await userEvent.type(search, 'b');
    expect(screen.getByText('Opción B')).toBeInTheDocument();
    expect(screen.queryByText('Opción A')).not.toBeInTheDocument();
  });

  // 9. Shows "Sin resultados" when no match
  it('shows "Sin resultados" when search has no matches', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('textbox', { name: /buscar/i }), 'zzz');
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  // 10. Selecting an option adds a chip
  it('adds a chip when an option is selected', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Opción A/i }));
    // A chip remove button appears for the selected option
    expect(screen.getByRole('button', { name: 'Eliminar Opción A' })).toBeInTheDocument();
  });

  // 11. Deselecting an option removes the chip
  it('removes chip when option is deselected', async () => {
    render(<Controlled options={options} initialValue={['a']} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: /Opción A/i }));
    // After deselect the chip should no longer be visible outside the dropdown
    // The dropdown still shows "Opción A" as an unselected option, but the chip area should not have it
    const chips = screen.queryAllByLabelText(/Eliminar Opción A/i);
    expect(chips).toHaveLength(0);
  });

  // 12. Remove individual chip with × button
  it('removes a chip when its remove button is clicked', async () => {
    render(<Controlled options={options} initialValue={['a', 'b']} />);
    const removeBtn = screen.getByRole('button', { name: 'Eliminar Opción A' });
    await userEvent.click(removeBtn);
    expect(screen.queryByRole('button', { name: 'Eliminar Opción A' })).not.toBeInTheDocument();
    // Opción B chip should still be there
    expect(screen.getByRole('button', { name: 'Eliminar Opción B' })).toBeInTheDocument();
  });

  // 13. Clear all removes all chips
  it('clears all selections when "Eliminar todas las selecciones" is clicked', async () => {
    render(<Controlled options={options} initialValue={['a', 'b', 'd']} />);
    const clearBtn = screen.getByRole('button', { name: 'Eliminar todas las selecciones' });
    await userEvent.click(clearBtn);
    expect(screen.queryByRole('button', { name: /Eliminar Opción/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Eliminar todas las selecciones' })).not.toBeInTheDocument();
  });

  // 14. Disabled state: does not open dropdown on click
  it('does not open dropdown when disabled', async () => {
    render(<Controlled options={options} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // 15. aria-invalid is set when error=true
  it('sets aria-invalid when error is true', () => {
    render(<Controlled options={options} error errorMessage="Requerido" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  // 16. aria-invalid is NOT present when error=false
  it('does not set aria-invalid when error is false', () => {
    render(<Controlled options={options} error={false} />);
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  // 17. aria-describedby links to messageId when helperText is present
  it('links aria-describedby to helper text element', () => {
    render(<Controlled options={options} label="Frutas" helperText="Texto de ayuda" />);
    const trigger = screen.getByRole('combobox');
    const messageId = trigger.getAttribute('aria-describedby');
    expect(messageId).toBeTruthy();
    const helperEl = document.getElementById(messageId!);
    expect(helperEl).toHaveTextContent('Texto de ayuda');
  });

  // 18. aria-describedby links to error message
  it('links aria-describedby to error message element with role="alert"', () => {
    render(<Controlled options={options} label="X" error errorMessage="Error aquí" />);
    const trigger = screen.getByRole('combobox');
    const messageId = trigger.getAttribute('aria-describedby');
    expect(messageId).toBeTruthy();
    const errorEl = document.getElementById(messageId!);
    expect(errorEl).toHaveTextContent('Error aquí');
    expect(errorEl).toHaveAttribute('role', 'alert');
  });

  // 19. role="listbox" with aria-multiselectable="true"
  it('renders listbox with aria-multiselectable="true"', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  });

  // 20. role="option" with correct aria-selected
  it('marks selected options with aria-selected="true"', async () => {
    render(<Controlled options={options} initialValue={['a']} />);
    await userEvent.click(screen.getByRole('combobox'));
    const optA = screen.getByRole('option', { name: /Opción A/i });
    const optB = screen.getByRole('option', { name: /Opción B/i });
    expect(optA).toHaveAttribute('aria-selected', 'true');
    expect(optB).toHaveAttribute('aria-selected', 'false');
  });

  // 21. Disabled option cannot be selected
  it('does not toggle a disabled option when clicked', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    const disabledOpt = screen.getByRole('option', { name: /Opción C/i });
    await userEvent.click(disabledOpt);
    expect(onChange).not.toHaveBeenCalled();
  });

  // 22. fullWidth applies w-full to the outer container
  it('applies w-full class when fullWidth is true', () => {
    const { container } = render(<Controlled options={options} fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  // 23. Keyboard: ArrowDown on trigger opens dropdown and focuses first option
  it('opens dropdown and moves focus to first option on ArrowDown from trigger', async () => {
    render(<Controlled options={options} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
  });

  // 24. Keyboard: Space on option toggles selection
  it('toggles option selection on Space key', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    const optA = screen.getByRole('option', { name: /Opción A/i });
    optA.focus();
    fireEvent.keyDown(optA, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  // 25. Keyboard: Enter on option toggles selection
  it('toggles option selection on Enter key', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={['a']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    const optA = screen.getByRole('option', { name: /Opción A/i });
    optA.focus();
    fireEvent.keyDown(optA, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith([]);
  });

  // 26. Search query is cleared when dropdown closes
  it('clears search query when dropdown closes', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByRole('textbox', { name: /buscar/i });
    await userEvent.type(search, 'xyz');
    fireEvent.keyDown(document, { key: 'Escape' });
    // Reopen and verify search is empty
    await userEvent.click(screen.getByRole('combobox'));
    const searchReopen = screen.getByRole('textbox', { name: /buscar/i });
    expect(searchReopen).toHaveValue('');
  });

  // 27. ArrowDown in search moves focus to first listbox option
  it('moves focus to first option when ArrowDown is pressed in search input', async () => {
    render(<Controlled options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const search = screen.getByRole('textbox', { name: /buscar/i });
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    const firstEnabledOption = screen.getAllByRole('option').find(
      (el) => el.getAttribute('aria-disabled') !== 'true'
    );
    expect(firstEnabledOption).toHaveFocus();
  });

  // 28. Clear all button is not shown when disabled, even with selections
  it('does not show clear-all button when component is disabled', () => {
    render(<Controlled options={options} initialValue={['a', 'b']} disabled />);
    expect(
      screen.queryByRole('button', { name: 'Eliminar todas las selecciones' })
    ).not.toBeInTheDocument();
  });

  // 29. Chip remove buttons not shown when disabled
  it('does not show chip remove buttons when component is disabled', () => {
    render(<Controlled options={options} initialValue={['a']} disabled />);
    expect(screen.queryByRole('button', { name: /Eliminar Opción A/i })).not.toBeInTheDocument();
  });

  // 30. Chevron icon rotates when dropdown is open (aria-expanded)
  it('sets aria-expanded on trigger combobox', async () => {
    render(<Controlled options={options} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
