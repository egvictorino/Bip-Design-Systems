import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Odontogram } from './Odontogram';
import type { OdontogramValue } from './Odontogram';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getToothSVG = (toothNumber: number) =>
  screen.getByRole('img', { name: new RegExp(`Diente ${toothNumber}`) });

const getToothSVGQuery = (toothNumber: number) =>
  screen.queryByRole('img', { name: new RegExp(`Diente ${toothNumber}`) });

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
  it('applies fill-red-400 on surface with caries', () => {
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(11).querySelectorAll('[aria-label="Oclusal"]');
    expect(surfaces[0]).toHaveClass('fill-red-400');
  });

  it('applies fill-blue-400 on surface with restoration', () => {
    const value: OdontogramValue = { 21: { surfaces: { buccal: 'restoration' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(21).querySelector('[aria-label="Bucal"]');
    expect(surface).toHaveClass('fill-blue-400');
  });

  it('applies fill-yellow-400 to all surfaces for crown', () => {
    const value: OdontogramValue = { 16: { condition: 'crown' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(16).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fill-yellow-400'));
  });

  it('applies fill-gray-300 to all surfaces for missing tooth', () => {
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(18).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fill-gray-300'));
  });

  it('applies fill-purple-400 to all surfaces for implant', () => {
    const value: OdontogramValue = { 36: { condition: 'implant' } };
    render(<Odontogram value={value} readOnly />);
    const surfaces = getToothSVG(36).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fill-purple-400'));
  });

  it('applies fill-orange-400 on surface with fracture', () => {
    const value: OdontogramValue = { 47: { surfaces: { occlusal: 'fracture' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(47).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fill-orange-400');
  });

  it('applies fill-teal-400 on surface with root canal', () => {
    const value: OdontogramValue = { 46: { surfaces: { occlusal: 'root_canal' } } };
    render(<Odontogram value={value} readOnly />);
    const surface = getToothSVG(46).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fill-teal-400');
  });

  it('applies fill-red-200 to all surfaces for extraction_planned', () => {
    const value: OdontogramValue = { 48: { condition: 'extraction_planned' } };
    render(<Odontogram value={value} readOnly />);
    // extraction_planned is treated as a surface-level condition
    const surface = getToothSVG(48).querySelector('[aria-label="Oclusal"]');
    expect(surface).toHaveClass('fill-red-200');
  });

  it('renders healthy surfaces as fill-white', () => {
    render(<Odontogram />);
    const surfaces = getToothSVG(11).querySelectorAll('polygon');
    surfaces.forEach((s) => expect(s).toHaveClass('fill-white'));
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

  it('surfaces have role="button" when interactive', () => {
    render(<Odontogram onChange={() => {}} />);
    const surfaces = getToothSVG(11).querySelectorAll('[role="button"]');
    expect(surfaces.length).toBe(5);
  });

  it('surfaces do NOT have role="button" when readOnly', () => {
    render(<Odontogram readOnly />);
    const surfaces = getToothSVG(11).querySelectorAll('[role="button"]');
    expect(surfaces.length).toBe(0);
  });

  it('active surfaces have aria-pressed="true"', () => {
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} onChange={() => {}} />);
    const occlusal = getToothSVG(11).querySelector('[aria-label="Oclusal"]');
    expect(occlusal).toHaveAttribute('aria-pressed', 'true');
  });

  it('healthy surfaces have aria-pressed="false"', () => {
    render(<Odontogram onChange={() => {}} />);
    const occlusal = getToothSVG(11).querySelector('[aria-label="Oclusal"]');
    expect(occlusal).toHaveAttribute('aria-pressed', 'false');
  });
});

// ─── Interactivity ────────────────────────────────────────────────────────────

describe('Odontogram — interactivity', () => {
  it('calls onChange with caries condition on surface click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} activeTool="caries" />);

    const occlusal = getToothSVG(11).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.surfaces?.occlusal).toBe('caries');
  });

  it('calls onChange with whole-tooth condition (missing) on surface click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} activeTool="missing" />);

    const anyPolygon = getToothSVG(16).querySelector('polygon')!;
    await user.click(anyPolygon);

    expect(handleChange).toHaveBeenCalledOnce();
    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBe('missing');
  });

  it('does NOT call onChange when readOnly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Odontogram onChange={handleChange} readOnly />);

    // In readOnly mode, polygons have no onClick — clicking should have no effect
    const svg = getToothSVG(11);
    const polygon = svg.querySelector('polygon')!;
    await user.click(polygon);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does NOT call onChange when onChange prop is not provided', async () => {
    const user = userEvent.setup();
    // No onChange = display-only even without readOnly
    render(<Odontogram activeTool="caries" />);
    const polygon = getToothSVG(11).querySelector('polygon')!;
    // Should not throw
    await user.click(polygon);
  });

  it('clicking missing tooth surfaces does not call onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 18: { condition: 'missing' } };
    render(<Odontogram value={value} onChange={handleChange} activeTool="caries" />);

    const polygon = getToothSVG(18).querySelector('polygon')!;
    await user.click(polygon);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('setting activeTool=healthy removes an existing surface condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 11: { surfaces: { occlusal: 'caries' } } };
    render(<Odontogram value={value} onChange={handleChange} activeTool="healthy" />);

    const occlusal = getToothSVG(11).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[11]?.surfaces?.occlusal).toBeUndefined();
  });

  it('setting a surface condition clears a whole-tooth condition', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 16: { condition: 'crown' } };
    render(<Odontogram value={value} onChange={handleChange} activeTool="caries" />);

    const occlusal = getToothSVG(16).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[16]?.condition).toBeUndefined();
    expect(updated[16]?.surfaces?.occlusal).toBe('caries');
  });

  it('preserves existing value for other teeth when changing one tooth', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: OdontogramValue = { 21: { surfaces: { occlusal: 'restoration' } } };
    render(<Odontogram value={value} onChange={handleChange} activeTool="caries" />);

    const occlusal = getToothSVG(11).querySelector('[aria-label="Oclusal"]')!;
    await user.click(occlusal);

    const updated: OdontogramValue = handleChange.mock.calls[0][0];
    expect(updated[21]?.surfaces?.occlusal).toBe('restoration');
    expect(updated[11]?.surfaces?.occlusal).toBe('caries');
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

  it('interactive onChange works with primary teeth', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Odontogram
        dentition="primary"
        onChange={handleChange}
        activeTool="caries"
        value={{}}
      />
    );
    const surfaces = screen.getAllByRole('button', {
      name: /oclusal/i,
    });
    await user.click(surfaces[0]);
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
    const surfaces = screen.queryAllByRole('button');
    expect(surfaces).toHaveLength(0);
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
