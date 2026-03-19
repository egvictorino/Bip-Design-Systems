import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawerPanel } from './DrawerPanel';

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Detalle del paciente',
  children: <p>Contenido del panel</p>,
};

describe('DrawerPanel', () => {
  it('renders content when open', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByText('Detalle del paciente')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DrawerPanel {...defaultProps} open={false} />);
    expect(screen.queryByText('Contenido del panel')).not.toBeInTheDocument();
  });

  it('has dialog role with aria-modal', () => {
    render(<DrawerPanel {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-label from title prop', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Detalle del paciente');
  });

  it('renders close button', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByLabelText('Cerrar panel')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Cerrar panel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(<DrawerPanel {...defaultProps} onClose={onClose} />);
    // Click the backdrop (role="presentation" outer div)
    const backdrop = document.querySelector('[role="presentation"]') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render header when no title', () => {
    render(<DrawerPanel open={true} onClose={vi.fn()}>Content</DrawerPanel>);
    expect(screen.queryByLabelText('Cerrar panel')).not.toBeInTheDocument();
  });

  it('applies right placement by default', () => {
    render(<DrawerPanel {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveClass('right-0');
  });

  it('applies left placement', () => {
    render(<DrawerPanel {...defaultProps} placement="left" />);
    expect(screen.getByRole('dialog')).toHaveClass('left-0');
  });

  it('applies sm size class', () => {
    render(<DrawerPanel {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass('w-80');
  });

  it('applies lg size class', () => {
    render(<DrawerPanel {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toHaveClass('w-[640px]');
  });
});
