import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToothSVG } from './ToothSVG';
import type { ToothData } from './types';

const HEALTHY: ToothData = {};

describe('ToothSVG — render', () => {
  it('renders an svg with role img and a label including the tooth number', () => {
    render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    expect(screen.getByRole('img', { name: /Diente 11/ })).toBeInTheDocument();
  });

  it('appends "Ausente" to the label when the tooth condition is missing', () => {
    render(
      <ToothSVG
        toothNumber={22}
        arch="upper"
        data={{ condition: 'missing' }}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    expect(screen.getByRole('img', { name: /Diente 22 - Ausente/ })).toBeInTheDocument();
  });

  it('renders the 5 surface polygons with their aria-labels', () => {
    render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    const svg = screen.getByRole('img', { name: /Diente 11/ });
    ['Oclusal', 'Bucal', 'Lingual', 'Mesial', 'Distal'].forEach((label) => {
      expect(svg.querySelector(`[aria-label="${label}"]`)).toBeInTheDocument();
    });
  });

  it('renders an X marker when the tooth is missing', () => {
    const { container } = render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={{ condition: 'missing' }}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    expect(container.querySelectorAll('line').length).toBe(2);
  });

  it('does not render an X marker for a non-missing tooth', () => {
    const { container } = render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    expect(container.querySelectorAll('line').length).toBe(0);
  });
});

describe('ToothSVG — interaction', () => {
  it('gives surfaces role="button" and tabIndex only when interactive', () => {
    render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive
        onSurfaceClick={vi.fn()}
      />
    );
    const surface = screen.getByRole('img', { name: /Diente 11/ }).querySelector(
      '[aria-label="Oclusal"]'
    );
    expect(surface).toHaveAttribute('tabindex', '0');
  });

  it('does not expose surfaces as buttons when not interactive', () => {
    render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive={false}
        onSurfaceClick={vi.fn()}
      />
    );
    const surface = screen.getByRole('img', { name: /Diente 11/ }).querySelector(
      '[aria-label="Oclusal"]'
    );
    expect(surface).not.toHaveAttribute('role');
    expect(surface).not.toHaveAttribute('tabindex');
  });

  it('calls onSurfaceClick with the tooth number and surface on click', async () => {
    const user = userEvent.setup();
    const onSurfaceClick = vi.fn();
    render(
      <ToothSVG
        toothNumber={16}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive
        onSurfaceClick={onSurfaceClick}
      />
    );
    const surface = screen
      .getByRole('img', { name: /Diente 16/ })
      .querySelector('[aria-label="Oclusal"]') as SVGElement;
    await user.click(surface);
    expect(onSurfaceClick).toHaveBeenCalledWith(16, 'occlusal');
  });

  it('calls onSurfaceClick on Enter and Space when interactive', async () => {
    const user = userEvent.setup();
    const onSurfaceClick = vi.fn();
    render(
      <ToothSVG
        toothNumber={16}
        arch="upper"
        data={HEALTHY}
        size="md"
        interactive
        onSurfaceClick={onSurfaceClick}
      />
    );
    const surface = screen
      .getByRole('img', { name: /Diente 16/ })
      .querySelector('[aria-label="Mesial"]') as SVGElement;
    surface.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onSurfaceClick).toHaveBeenCalledTimes(2);
    expect(onSurfaceClick).toHaveBeenCalledWith(16, 'mesial');
  });

  it('marks a surface as pressed when its condition is not healthy', () => {
    render(
      <ToothSVG
        toothNumber={11}
        arch="upper"
        data={{ surfaces: { occlusal: 'caries' } }}
        size="md"
        interactive
        onSurfaceClick={vi.fn()}
      />
    );
    const surface = screen.getByRole('img', { name: /Diente 11/ }).querySelector(
      '[aria-label="Oclusal"]'
    );
    expect(surface).toHaveAttribute('aria-pressed', 'true');
  });
});
