import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImagePopover } from './ImagePopover';
import type { ToothImage } from './types';

const POSITION = { top: 10, left: 20 };
const IMG_A: ToothImage = { type: 'radiograph', url: 'data:image/png;base64,aaa' };
const IMG_B: ToothImage = { type: 'photo', url: 'data:image/png;base64,bbb' };

describe('ImagePopover — render', () => {
  it('renders a dialog labelled with the tooth number', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog', { name: /Imágenes del diente 11/ })).toBeInTheDocument();
  });

  it('opens directly in the add-image form when there are no images and it is editable', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByText('Nueva imagen')).toBeInTheDocument();
  });

  it('shows an empty state and no add form when there are no images and it is read-only', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[]}
        editable={false}
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByText('Sin imágenes adjuntas')).toBeInTheDocument();
    expect(screen.queryByText('Nueva imagen')).not.toBeInTheDocument();
  });

  it('renders the thumbnail list and count when images are provided', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A, IMG_B]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('list', { name: 'Imágenes adjuntas' })).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('preselects and previews the first image when images are provided', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Ver imagen 1/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('does not render delete buttons when read-only', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable={false}
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /Eliminar imagen/ })).not.toBeInTheDocument();
  });
});

describe('ImagePopover — interaction', () => {
  it('toggles selection off when clicking the already-selected thumbnail', async () => {
    const user = userEvent.setup();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    const thumb = screen.getByRole('button', { name: /Ver imagen 1/ });
    expect(thumb).toHaveAttribute('aria-pressed', 'true');
    await user.click(thumb);
    expect(thumb).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onSave with the remaining images when one is deleted', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A, IMG_B]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar imagen 1' }));
    expect(onSave).toHaveBeenCalledWith([IMG_B]);
  });

  it('re-enters the add form after deleting the last remaining image', async () => {
    const user = userEvent.setup();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Eliminar imagen 1' }));
    expect(screen.getByText('Nueva imagen')).toBeInTheDocument();
  });

  it('shows the add form when "Agregar imagen" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Agregar imagen/ }));
    expect(screen.getByText('Nueva imagen')).toBeInTheDocument();
  });

  it('disables the confirm button until a file has been selected', () => {
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[]}
        editable
        position={POSITION}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeDisabled();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cerrar imágenes' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ImagePopover
        toothNumber={11}
        initialImages={[IMG_A]}
        editable
        position={POSITION}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
