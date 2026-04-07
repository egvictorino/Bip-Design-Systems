import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Odontogram } from './Odontogram';
import type { OdontogramValue, ToothImage } from './Odontogram';

const SAMPLE_IMG: ToothImage = { type: 'radiograph', url: 'data:image/png;base64,abc123' };
const SAMPLE_IMG2: ToothImage = { type: 'photo', url: 'data:image/png;base64,xyz789' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getToothSVG = (toothNumber: number) =>
  screen.getByRole('img', { name: new RegExp(`Diente ${toothNumber}`) });

const getToothSVGQuery = (toothNumber: number) =>
  screen.queryByRole('img', { name: new RegExp(`Diente ${toothNumber}`) });

const getToothButton = (toothNumber: number) =>
  screen.getByRole('button', { name: new RegExp(`Seleccionar diente ${toothNumber}`) });

const openDetailPanel = async (user: ReturnType<typeof userEvent.setup>, toothNumber: number) => {
  await user.click(getToothButton(toothNumber));
  return screen.getByTestId('tooth-detail-panel');
};

// ─── Render ───────────────────────────────────────────────────────────────────

describe('Odontogram — render', () => {
  it('renders without errors', () => {
    render(<Odontogram />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders all 32 permanent teeth', () => {
    render(<Odontogram />);
    const allTeeth = [
      11, 12, 13, 14, 15, 16, 17, 18,
      21, 22, 23, 24, 25, 26, 27, 28,
      31, 32, 33, 34, 35, 36, 37, 38,
      41, 42, 43, 44, 45, 46, 47, 48,
    ];
    allTeeth.forEach((n) => {
      expect(getToothSVGQuery(n)).toBeInTheDocument();
    });
  });

  it('shows tooth number labels for each quadrant', () => {
    render(<Odontogram />);
    // Check a tooth from each quadrant
    expect(screen.getAllByText('11').length).toBeGreaterThan(0);
    expect(screen.getAllByText('21').length).toBeGreaterThan(0);
    expect(screen.getAllByText('31').length).toBeGreaterThan(0);
    expect(screen.getAllByText('41').length).toBeGreaterThan(0);
    expect(screen.getAllByText('18').length).toBeGreaterThan(0);
    expect(screen.getAllByText('28').length).toBeGreaterThan(0);
    expect(screen.getAllByText('38').length).toBeGreaterThan(0);
    expect(screen.getAllByText('48').length).toBeGreaterThan(0);
  });

  it('renders label and links it to the group via aria-labelledby', () => {
    render(<Odontogram label="Odontograma del paciente" />);
    const label = screen.getByText('Odontograma del paciente');
    const group = screen.getByRole('group');
    expect(label).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-labelledby', label.id);
  });

  it('does not render label element when label prop is omitted', () => {
    render(<Odontogram />);
    expect(screen.queryByText(/Odontograma/)).not.toBeInTheDocument();
  });
});

// ─── Conditions & colors ──────────────────────────────────────────────────────

describe('Odontogram — conditions', () => {
  it('applies fillCaries class on surface with caries', () => {
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(11).querySelectorAll('[aria-label="Oclusal"]');
    expect(surfaces[0]).toHaveClass('fillCaries');
  });

  it('applies fillRestoration class on surface with restoration', () => {
    const value: OdontogramValue = { 21: { surfaces: { buccal: 'restoration' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(21).querySelector('[aria-label="Bucal"]');
    expect(surface).toHaveClass('fillRestoration');
  });

  it('applies fillCrown class to all surfaces for crown', () => {
    const value: OdontogramValue = { 16: { condition: 'crown' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(16).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fillCrown'));
  });

  it('applies fillMissing class to all surfaces for missing tooth', () => {
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(18).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fillMissing'));
  });

  it('applies fillImplant class to all surfaces for implant', () => {
    const value: OdontogramValue = { 36: { condition: 'implant' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(36).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fillImplant'));
  });

  it('applies fillFracture class on surface with fracture', () => {
    const value: OdontogramValue = { 47: { surfaces: { occlusal: 'fracture' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(47).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fillFracture');
  });

  it('applies fillRootCanal class on surface with root canal', () => {
    const value: OdontogramValue = { 46: { surfaces: { occlusal: 'root_canal' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(46).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fillRootCanal');
  });

  it('applies fillExtractionPlanned class to all surfaces for extraction_planned', () => {
    const value: OdontogramValue = { 48: { condition: 'extraction_planned' } };
    render(<Odontogram value={value} readOnly />);
    // extraction_planned is treated as a surface-level condition
    const surface = getToothSVG(48).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fillExtractionPlanned');
  });

  it('renders healthy surfaces with fillHealthy class', () => {
    render(<Odontogram />);
    const surfaces = getToothSVG(11).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fillHealthy'));
  });

  it('renders X marker lines for missing tooth', () => {
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} readOnly />);
    const svg = getToothSVG(18);
    const lines = svg.querySelectorAll('line');
    expect(lines).toHaveLength(2);
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Odontogram — accessibility', () => {
  it('has role="group" on wrapper', () => {
    render(<Odontogram />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('each tooth SVG has an aria-label', () => {
    render(<Odontogram />);
    const tooth11 = getToothSVG(11);
    expect(tooth11).toHaveAttribute('aria-label', expect.stringContaining('Diente 11'));
  });

  it('marks missing tooth as ausente in aria-label', () => {
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} readOnly />);
    const tooth = getToothSVG(18);
    expect(tooth).toHaveAttribute('aria-label', expect.stringContaining('Ausente'));
  });

  it('main view surfaces do NOT have role="button" (interaction via detail panel)', () => {
    render(<Odontogram onChange={() => {}} />);
    // In main view, surfaces are not interactive — tooth cells are buttons
    const surfaces = getToothSVG(11).querySelectorAll('[role="button"]');
    expect(surfaces.length).toBe(0);
  });

  it('surfaces do NOT have role="button" when readOnly', () => {
    render(<Odontogram readOnly />);
    const surfaces = getToothSVG(11).querySelectorAll('[role="button"]');
    expect(surfaces.length).toBe(0);
  });

  it('detail panel surfaces have role="button" when interactive', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const surfaces = within(panel).getByRole('img', { name: /Diente 11/ }).querySelectorAll('[role="button"]');
    expect(surfaces.length).toBe(5);
  });

  it('active surfaces in detail panel have aria-pressed="true"', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const occlusal = within(panel).getByRole('img', { name: /Diente 11/ }).querySelector('[aria-label="Oclusal"]');
    expect(occlusal).toHaveAttribute('aria-pressed', 'true');
  });

  it('healthy surfaces in detail panel have aria-pressed="false"', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const occlusal = within(panel).getByRole('img', { name: /Diente 11/ }).querySelector('[aria-label="Oclusal"]');
    expect(occlusal).toHaveAttribute('aria-pressed', 'false');
  });

  it('tooth buttons in interactive mode have aria-pressed indicating selection', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const toothBtn = getToothButton(11);
    expect(toothBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(toothBtn);
    expect(toothBtn).toHaveAttribute('aria-pressed', 'true');
  });
});

// ─── Interactivity ────────────────────────────────────────────────────────────

describe('Odontogram — interactivity', () => {
  it('clicking a tooth in interactive mode opens the detail panel', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    await user.click(getToothButton(11));
    expect(screen.getByTestId('tooth-detail-panel')).toBeInTheDocument();
  });

  it('detail panel shows tooth number', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    await user.click(getToothButton(16));
    expect(screen.getByTestId('tooth-detail-panel')).toHaveTextContent('Diente 16');
  });

  it('calls onChange with caries condition on surface click in detail panel', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    const occlusal = within(panel).getByRole('img', { name: /Diente 11/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.surfaces?.occlusal).toBe('caries');
  });

  it('calls onChange with whole-tooth condition after selecting it in the panel toolbar', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 16);
    await user.click(within(panel).getByRole('button', { name: 'Ausente' }));

    const anyPolygon = within(panel).getByRole('img', { name: /Diente 16/ }).querySelector('polygon')!;
    await user.click(anyPolygon);

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBe('missing');
  });

  it('does NOT call onChange when readOnly', () => {
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} readOnly />);

    // In readOnly mode, tooth cells are not buttons
    const buttons = screen.queryAllByRole('button', { name: /Seleccionar diente/ });
    expect(buttons).toHaveLength(0);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does NOT call onChange when onChange prop is not provided', () => {
    // No onChange = display-only even without readOnly
    render(<Odontogram />);
    const buttons = screen.queryAllByRole('button', { name: /Seleccionar diente/ });
    expect(buttons).toHaveLength(0);
  });

  it('clicking a missing tooth opens the panel and surfaces are interactive to change condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 18);
    // Default tool is caries — clicking a surface should change the condition
    const occlusal = within(panel).getByRole('img', { name: /Diente 18/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);
    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    // Caries is a surface-level condition, so it clears the whole-tooth condition
    expect(updated[18]?.condition).toBeUndefined();
    expect(updated[18]?.surfaces?.occlusal).toBe('caries');
  });

  it('selecting Sano in panel toolbar removes an existing surface condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: 'Sano' }));

    const occlusal = within(panel).getByRole('img', { name: /Diente 11/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.surfaces?.occlusal).toBeUndefined();
  });

  it('applying a surface condition via panel clears a whole-tooth condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 16: { condition: 'crown' } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 16);
    // Default tool is caries
    const occlusal = within(panel).getByRole('img', { name: /Diente 16/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBeUndefined();
    expect(updated[16]?.surfaces?.occlusal).toBe('caries');
  });

  it('preserves existing value for other teeth when changing one tooth via panel', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 21: { surfaces: { occlusal: 'restoration' } } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    const occlusal = within(panel).getByRole('img', { name: /Diente 11/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[21]?.surfaces?.occlusal).toBe('restoration');
    expect(updated[11]?.surfaces?.occlusal).toBe('caries');
  });

  it('clicking the same tooth again deselects it and closes the panel', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    await user.click(getToothButton(11));
    expect(screen.getByTestId('tooth-detail-panel')).toBeInTheDocument();

    await user.click(getToothButton(11));
    expect(screen.queryByTestId('tooth-detail-panel')).not.toBeInTheDocument();
  });

  it('Cerrar detalle button closes the panel', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    await openDetailPanel(user, 11);
    await user.click(screen.getByRole('button', { name: 'Cerrar detalle' }));

    expect(screen.queryByTestId('tooth-detail-panel')).not.toBeInTheDocument();
  });

  it('detail panel toolbar has all condition buttons', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);

    expect(within(panel).getByRole('button', { name: 'Sano' })).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Caries' })).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Corona' })).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Ausente' })).toBeInTheDocument();
  });

  it('default active condition in panel is Caries (aria-pressed="true")', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);

    expect(within(panel).getByRole('button', { name: 'Caries' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(panel).getByRole('button', { name: 'Sano' })).toHaveAttribute('aria-pressed', 'false');
  });
});

// ─── Size ─────────────────────────────────────────────────────────────────────

describe('Odontogram — size', () => {
  it('renders sm size with 24px tooth SVGs', () => {
    render(<Odontogram size="sm" />);
    const svg = getToothSVG(11);
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders md size with 32px tooth SVGs (default)', () => {
    render(<Odontogram />);
    const svg = getToothSVG(11);
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('renders lg size with 40px tooth SVGs', () => {
    render(<Odontogram size="lg" />);
    const svg = getToothSVG(11);
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('detail panel renders large (xl=120px) tooth SVG', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    // There are two SVGs for tooth 11: main view + detail panel
    const allSvgs = screen.getAllByRole('img', { name: /Diente 11/ });
    // The detail panel SVG is xl=120px
    const detailSvg = within(panel).getByRole('img', { name: /Diente 11/ });
    expect(detailSvg).toHaveAttribute('width', '120');
    expect(detailSvg).toHaveAttribute('height', '120');
    expect(allSvgs.length).toBe(2);
  });
});

// ─── Primary dentition ────────────────────────────────────────────────────────

describe('Odontogram — primary dentition', () => {
  const PRIMARY_TEETH = [51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83, 84, 85];
  const PERMANENT_TEETH = [11, 12, 21, 22, 31, 32, 41, 42];

  it('renders 20 teeth in primary mode', () => {
    render(<Odontogram dentition="primary" />);
    const svgs = screen.getAllByRole('img');
    expect(svgs).toHaveLength(20);
  });

  it('renders all primary FDI tooth numbers', () => {
    render(<Odontogram dentition="primary" />);
    PRIMARY_TEETH.forEach((n) => {
      expect(getToothSVG(n)).toBeInTheDocument();
    });
  });

  it('does not render permanent teeth in primary mode', () => {
    render(<Odontogram dentition="primary" />);
    PERMANENT_TEETH.forEach((n) => {
      expect(getToothSVGQuery(n)).not.toBeInTheDocument();
    });
  });

  it('interactive onChange works with primary teeth via detail panel', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Odontogram
        dentition="primary"
        onChange={handleChange}
        value={{}}
      />
    );
    const panel = await openDetailPanel(user, 51);
    const occlusal = within(panel).getByRole('img', { name: /Diente 51/ }).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    const changedTooth = Object.values(updated)[0];
    expect(changedTooth?.surfaces?.occlusal).toBe('caries');
  });

  it('readOnly prevents changes in primary mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Odontogram
        dentition="primary"
        onChange={handleChange}
        readOnly
        value={{}}
      />
    );
    const buttons = screen.queryAllByRole('button', { name: /Seleccionar diente/ });
    expect(buttons).toHaveLength(0);
    await user.click(getToothSVG(51));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders correct aria-label for primary tooth 51', () => {
    render(<Odontogram dentition="primary" />);
    expect(
      screen.getByRole('img', { name: /Diente 51.*Incisivo central temporal superior derecho/i })
    ).toBeInTheDocument();
  });
});

// ─── Notas por diente ─────────────────────────────────────────────────────────

describe('Odontogram — notas', () => {
  it('detail panel has Nota action button in interactive mode', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    expect(within(panel).getByRole('button', { name: /Nota del diente 11/ })).toBeInTheDocument();
  });

  it('Nota button aria-label indicates when tooth has a note', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 11: { notes: 'fractura leve' } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    expect(within(panel).getByRole('button', { name: /tiene nota/ })).toBeInTheDocument();
  });

  it('clicking Nota opens the note popover', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));

    expect(screen.getByRole('dialog', { name: /Nota del diente 11/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('nota textarea is prefilled with existing note', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 16: { notes: 'corona temporal' } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 16);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 16/ }));

    expect(screen.getByRole('textbox')).toHaveValue('corona temporal');
  });

  it('clicking ✕ closes note popover without calling onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cerrar nota' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('Escape closes note popover without calling onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('clicking Guardar calls onChange with updated note', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    await user.type(screen.getByRole('textbox'), 'caries interproximal');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.notes).toBe('caries interproximal');
  });

  it('saving empty text removes the notes key from tooth', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 11: { notes: 'nota a borrar' } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.notes).toBeUndefined();
  });

  it('saving a note on tooth with no prior data creates the entry correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} value={{}} />);

    const panel = await openDetailPanel(user, 21);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 21/ }));
    await user.type(screen.getByRole('textbox'), 'nueva nota');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[21]?.notes).toBe('nueva nota');
  });

  it('saving closes the note popover', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('saving preserves other tooth properties (condition, surfaces)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 16: { condition: 'crown', surfaces: {} } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 16);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 16/ }));
    await user.type(screen.getByRole('textbox'), 'corona provisional');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBe('crown');
    expect(updated[16]?.notes).toBe('corona provisional');
  });
});

// ─── Imágenes por diente ───────────────────────────────────────────────────────

describe('Odontogram — imágenes', () => {
  it('detail panel has Imágenes action button in interactive mode', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    expect(within(panel).getByRole('button', { name: /Imágenes del diente 11/ })).toBeInTheDocument();
  });

  it('Imágenes button aria-label includes image count when tooth has images', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 16: { images: [SAMPLE_IMG, SAMPLE_IMG2] } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 16);
    const btn = within(panel).getByRole('button', { name: /Imágenes del diente 16/ });
    expect(btn.getAttribute('aria-label')).toMatch(/2 imagen/);
  });

  it('Imágenes button aria-label does not mention images when tooth has none', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const btn = within(panel).getByRole('button', { name: 'Imágenes del diente 11' });
    expect(btn).toHaveAttribute('aria-label', 'Imágenes del diente 11');
  });

  it('clicking Imágenes opens the image popover', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByRole('dialog', { name: /Imágenes del diente 11/ })).toBeInTheDocument();
  });

  it('image popover in editable mode shows type selector and file button', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Seleccionar archivo/ })).toBeInTheDocument();
  });

  it('type selector has the 3 correct options', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByRole('option', { name: 'Radiografía' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fotografía' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Otra' })).toBeInTheDocument();
  });

  it('Escape closes image popover without calling onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('image popover with images shows thumbnails with aria-label', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 11: { images: [SAMPLE_IMG, SAMPLE_IMG2] } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByRole('button', { name: /Ver imagen 1: Radiografía/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver imagen 2: Fotografía/ })).toBeInTheDocument();
  });

  it('image popover shows image count in header', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 11: { images: [SAMPLE_IMG, SAMPLE_IMG2] } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('clicking thumbnail shows image in preview', async () => {
    const user = userEvent.setup();
    const value: OdontogramValue = { 11: { images: [SAMPLE_IMG, SAMPLE_IMG2] } };
    render(<Odontogram value={value} onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));
    await user.click(screen.getByRole('button', { name: /Ver imagen 2/ }));

    const preview = screen.getByAltText(/Fotografía — diente 11/);
    expect(preview).toHaveAttribute('src', SAMPLE_IMG2.url);
  });

  it('deleting an image calls onChange with updated array', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 11: { images: [SAMPLE_IMG, SAMPLE_IMG2] } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));
    await user.click(screen.getByRole('button', { name: 'Eliminar imagen 1' }));

    expect(handleChange).toHaveBeenCalled();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.images).toHaveLength(1);
    expect(updated[11]?.images?.[0].url).toBe(SAMPLE_IMG2.url);
  });

  it('deleting last image removes images from tooth data', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 11: { images: [SAMPLE_IMG] } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));
    await user.click(screen.getByRole('button', { name: 'Eliminar imagen 1' }));

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.images).toBeUndefined();
  });

  it('deleting image preserves other tooth properties', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 16: { condition: 'crown', images: [SAMPLE_IMG] } };
    render(<Odontogram value={value} onChange={handleChange} />);

    const panel = await openDetailPanel(user, 16);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 16/ }));
    await user.click(screen.getByRole('button', { name: 'Eliminar imagen 1' }));

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBe('crown');
    expect(updated[16]?.images).toBeUndefined();
  });

  it('closing image popover restores focus to the Imágenes button', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const imageBtn = within(panel).getByRole('button', { name: 'Imágenes del diente 11' });
    await user.click(imageBtn);
    await user.click(screen.getByRole('button', { name: 'Cerrar imágenes' }));

    expect(imageBtn).toHaveFocus();
  });

  it('clicking backdrop closes image popover without calling onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.previousElementSibling as HTMLElement;
    await user.click(backdrop);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('opening image popover without images shows the add form directly', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Imágenes del diente 11/ }));

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Agregar imagen/ })).not.toBeInTheDocument();
  });
});

// ─── Ref y className ──────────────────────────────────────────────────────────

describe('Odontogram — ref y className', () => {
  it('reenvía ref al elemento div raíz', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Odontogram ref={ref} />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('className adicional se aplica al wrapper', () => {
    render(<Odontogram className="mi-clase-custom" />);
    expect(screen.getByRole('group')).toHaveClass('mi-clase-custom');
  });
});

// ─── Teclado ──────────────────────────────────────────────────────────────────

describe('Odontogram — teclado', () => {
  it('tooth buttons in interactive mode are focusable', () => {
    render(<Odontogram onChange={() => {}} />);
    const toothBtn = getToothButton(11);
    expect(toothBtn).toBeInTheDocument();
  });

  it('tooth cells in readOnly mode are not focusable buttons', () => {
    render(<Odontogram readOnly />);
    const buttons = screen.queryAllByRole('button', { name: /Seleccionar diente/ });
    expect(buttons).toHaveLength(0);
  });

  it('detail panel surfaces have tabIndex=0 in interactive mode', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const surfaces = within(panel).getByRole('img', { name: /Diente 11/ }).querySelectorAll('[role="button"]');
    surfaces.forEach((s) => expect(s).toHaveAttribute('tabindex', '0'));
  });

  it('Enter on a tooth button opens the detail panel', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const toothBtn = getToothButton(11);
    toothBtn.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByTestId('tooth-detail-panel')).toBeInTheDocument();
  });

  it('Enter on a detail panel surface applies the condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    const occlusal = within(panel)
      .getByRole('img', { name: /Diente 11/ })
      .querySelector('[aria-label="Oclusal"]') as HTMLElement;
    occlusal.focus();
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.surfaces?.occlusal).toBe('caries');
  });

  it('Space on a detail panel surface applies the condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 21);
    await user.click(within(panel).getByRole('button', { name: 'Restauración' }));
    const mesial = within(panel)
      .getByRole('img', { name: /Diente 21/ })
      .querySelector('[aria-label="Mesial"]') as HTMLElement;
    mesial.focus();
    await user.keyboard(' ');

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[21]?.surfaces?.mesial).toBe('restoration');
  });
});

// ─── Notas — foco y backdrop ──────────────────────────────────────────────────

describe('Odontogram — notas: foco y backdrop', () => {
  it('nota popover receives focus on textarea when opened', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('closing nota with ✕ restores focus to the Nota button', async () => {
    const user = userEvent.setup();
    render(<Odontogram onChange={() => {}} />);

    const panel = await openDetailPanel(user, 11);
    const noteBtn = within(panel).getByRole('button', { name: /Nota del diente 11/ });
    await user.click(noteBtn);
    await user.click(screen.getByRole('button', { name: 'Cerrar nota' }));

    expect(noteBtn).toHaveFocus();
  });

  it('clicking nota backdrop closes popover without saving', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} />);

    const panel = await openDetailPanel(user, 11);
    await user.click(within(panel).getByRole('button', { name: /Nota del diente 11/ }));
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.previousElementSibling as HTMLElement;
    await user.click(backdrop);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });
});
