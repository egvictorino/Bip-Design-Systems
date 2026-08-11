import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a range input', () => {
    render(<Slider label="Volume" defaultValue={40} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('sets displayName', () => {
    expect(Slider.displayName).toBe('Slider');
  });

  it('links the label via htmlFor/id', () => {
    render(<Slider label="Volume" defaultValue={40} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Slider label="Volume" defaultValue={40} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('range');
  });

  it('respects min/max/step', () => {
    render(<Slider label="Volume" min={0} max={10} step={2} defaultValue={4} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.min).toBe('0');
    expect(slider.max).toBe('10');
    expect(slider.step).toBe('2');
  });

  it('shows the current value when showValue is set', () => {
    render(<Slider label="Brightness" showValue defaultValue={65} />);
    expect(screen.getByText('65')).toBeInTheDocument();
  });

  describe('error state', () => {
    it('sets aria-invalid and links the error message via aria-describedby', () => {
      render(
        <Slider label="Budget" error errorMessage="Out of range" defaultValue={10} />
      );
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-invalid', 'true');
      expect(slider).toHaveAttribute('aria-describedby');
      expect(screen.getByRole('alert')).toHaveTextContent('Out of range');
    });
  });

  it('does not set aria-invalid when there is no error', () => {
    render(<Slider label="Volume" defaultValue={40} />);
    expect(screen.getByRole('slider')).not.toHaveAttribute('aria-invalid');
  });

  it('disables the input when disabled', () => {
    render(<Slider label="Volume" disabled defaultValue={30} />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('calls onChange when the value changes', async () => {
    const handleChange = vi.fn();
    render(
      <Slider label="Volume" defaultValue={40} min={0} max={100} step={1} onChange={handleChange} />
    );
    const slider = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '70' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(slider.value).toBe('70');
  });

  it('shows a required asterisk next to the label when required is true', () => {
    render(<Slider label="Volume" required defaultValue={30} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show a required asterisk when required is not set', () => {
    render(<Slider label="Volume" defaultValue={30} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('sets required on the underlying input when required is true', () => {
    render(<Slider label="Volume" required defaultValue={30} />);
    // type="range" is not in jest-dom's toBeRequired() supported list, so assert the attribute directly.
    expect(screen.getByRole('slider')).toHaveAttribute('required');
  });
});
