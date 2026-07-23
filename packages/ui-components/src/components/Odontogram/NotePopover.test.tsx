import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotePopover } from './NotePopover';

const POSITION = { top: 10, left: 20 };

describe('NotePopover — render', () => {
  it('renders a dialog labelled with the tooth number', () => {
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog', { name: /Nota del diente 11/ })).toBeInTheDocument();
  });

  it('pre-fills the textarea with the initial note', () => {
    render(
      <NotePopover
        toothNumber={11}
        initialNote="Sensibilidad al frío"
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('textbox')).toHaveValue('Sensibilidad al frío');
  });

  it('focuses the textarea on mount', () => {
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('shows the Guardar button and an editable textarea when editable', () => {
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly');
  });

  it('renders a read-only textarea and no Guardar button when not editable', () => {
    render(
      <NotePopover
        toothNumber={11}
        initialNote="Nota existente"
        editable={false}
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    expect(screen.queryByRole('button', { name: 'Guardar' })).not.toBeInTheDocument();
  });
});

describe('NotePopover — interaction', () => {
  it('calls onSave with the edited note when Guardar is clicked', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );
    await user.type(screen.getByRole('textbox'), 'Nueva nota');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).toHaveBeenCalledWith('Nueva nota');
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cerrar nota' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <NotePopover
        toothNumber={11}
        initialNote=""
        editable
        position={POSITION}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.previousElementSibling as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
