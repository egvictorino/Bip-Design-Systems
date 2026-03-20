import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput placeholder="Buscar..." />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('has type search', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
  });

  it('renders label', () => {
    render(<SearchInput label="Buscar paciente" />);
    expect(screen.getByLabelText('Buscar paciente')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<SearchInput helperText="Mínimo 3 caracteres" />);
    expect(screen.getByText('Mínimo 3 caracteres')).toBeInTheDocument();
  });

  it('renders error message with role alert', () => {
    render(<SearchInput error errorMessage="Sin resultados" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Sin resultados');
  });

  it('renders clear button when controlled with value', () => {
    render(<SearchInput value="texto" onChange={() => {}} onClear={() => {}} />);
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} onClear={() => {}} />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('hides clear button when uncontrolled', () => {
    render(<SearchInput />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<SearchInput value="texto" onChange={() => {}} onClear={onClear} />);
    await userEvent.click(screen.getByLabelText('Limpiar búsqueda'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onChange on input', async () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'hola');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSearch immediately when debounceMs is 0', async () => {
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} debounceMs={0} />);
    await userEvent.type(screen.getByRole('searchbox'), 'a');
    expect(onSearch).toHaveBeenCalledWith('a');
  });

  it('is disabled when disabled prop is true', () => {
    render(<SearchInput disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('applies aria-invalid when error is true', () => {
    render(<SearchInput error />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid');
  });
});
