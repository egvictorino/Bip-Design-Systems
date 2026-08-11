import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToothDetail } from './ToothDetail';
import type { ToothData } from './types';

describe('ToothDetail — render', () => {
  it('renders the detail panel with the tooth number and name', () => {
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByTestId('tooth-detail-panel')).toBeInTheDocument();
    expect(screen.getByText('Diente 11')).toBeInTheDocument();
    expect(screen.getByText(/Incisivo central superior derecho/)).toBeInTheDocument();
  });

  it('renders the condition toolbar in edit mode', () => {
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('group', { name: 'Condiciones' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Caries' })).toBeInTheDocument();
  });

  it('hides the condition toolbar in read-only mode', () => {
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled
        onChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByRole('group', { name: 'Condiciones' })).not.toBeInTheDocument();
  });

  it('shows a condition badge in read-only mode when the tooth has a whole-tooth condition', () => {
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{ condition: 'missing' }}
        disabled
        onChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('Ausente')).toBeInTheDocument();
  });
});

describe('ToothDetail — interaction', () => {
  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={vi.fn()}
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cerrar detalle' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies the active tool to a clicked surface', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={onChange}
        onClose={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Restauración' }));
    const surface = screen
      .getByRole('img', { name: /Diente 11/ })
      .querySelector('[aria-label="Oclusal"]') as SVGElement;
    await user.click(surface);
    expect(onChange).toHaveBeenCalledWith({
      condition: undefined,
      surfaces: { occlusal: 'restoration' },
    });
  });

  it('applies a whole-tooth condition and clears per-surface data', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const data: ToothData = { surfaces: { occlusal: 'caries' } };
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={data}
        disabled={false}
        onChange={onChange}
        onClose={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Ausente' }));
    const surface = screen
      .getByRole('img', { name: /Diente 11/ })
      .querySelector('[aria-label="Mesial"]') as SVGElement;
    await user.click(surface);
    expect(onChange).toHaveBeenCalledWith({ condition: 'missing', surfaces: {} });
  });

  it('opens the note popover and calls onChange with the saved note', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={onChange}
        onClose={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Nota del diente 11/ }));
    expect(screen.getByRole('dialog', { name: /Nota del diente 11/ })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), 'Diente sensible');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onChange).toHaveBeenCalledWith({ notes: 'Diente sensible' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the image popover for the tooth', async () => {
    const user = userEvent.setup();
    render(
      <ToothDetail
        toothNumber={11}
        arch="upper"
        data={{}}
        disabled={false}
        onChange={vi.fn()}
        onClose={vi.fn()}
      />
    );
    await user.click(screen.getByRole('button', { name: /Imágenes del diente 11/ }));
    expect(screen.getByRole('dialog', { name: /Imágenes del diente 11/ })).toBeInTheDocument();
  });
});
