import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders search input', () => {
    render(<SearchInput placeholder="Buscar..." />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('has type search', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
  });

  it('has role="search" on the wrapper', () => {
    render(<SearchInput />);
    expect(screen.getByRole('search')).toBeInTheDocument();
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

  it('hides clear button when uncontrolled and no defaultValue', () => {
    render(<SearchInput />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('shows clear button in uncontrolled mode after typing', async () => {
    render(<SearchInput />);
    await userEvent.type(screen.getByRole('searchbox'), 'hola');
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
  });

  it('hides clear button in uncontrolled mode after clicking clear', async () => {
    render(<SearchInput />);
    await userEvent.type(screen.getByRole('searchbox'), 'hola');
    await userEvent.click(screen.getByLabelText('Limpiar búsqueda'));
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('shows clear button when uncontrolled with non-empty defaultValue', () => {
    render(<SearchInput defaultValue="inicial" />);
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<SearchInput value="texto" onChange={() => {}} onClear={onClear} />);
    await userEvent.click(screen.getByLabelText('Limpiar búsqueda'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('restores focus to input after clicking clear', async () => {
    render(<SearchInput value="texto" onChange={() => {}} onClear={() => {}} />);
    await userEvent.click(screen.getByLabelText('Limpiar búsqueda'));
    expect(screen.getByRole('searchbox')).toHaveFocus();
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

  it('debounces onSearch calls', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} debounceMs={300} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearch before debounce delay expires', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput onSearch={onSearch} debounceMs={500} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'hi' } });
    vi.advanceTimersByTime(200);
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<SearchInput disabled />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('hides clear button when disabled', () => {
    render(<SearchInput value="texto" onChange={() => {}} disabled />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('applies aria-invalid when error is true', () => {
    render(<SearchInput error />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid');
  });

  describe('searchOnEnter', () => {
    it('fires onSearch on Enter key press', () => {
      const onSearch = vi.fn();
      render(
        <SearchInput value="paciente" onChange={() => {}} onSearch={onSearch} searchOnEnter />
      );
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
      expect(onSearch).toHaveBeenCalledWith('paciente');
    });

    it('does NOT fire onSearch on change when searchOnEnter is true', () => {
      const onSearch = vi.fn();
      render(<SearchInput onSearch={onSearch} searchOnEnter />);
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'abc' } });
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('fires onSearch with current value on Enter', () => {
      const onSearch = vi.fn();
      render(
        <SearchInput value="resultado" onChange={() => {}} onSearch={onSearch} searchOnEnter />
      );
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
      expect(onSearch).toHaveBeenCalledWith('resultado');
    });
  });

  describe('loading', () => {
    it('sets aria-busy on the input when loading is true', () => {
      render(<SearchInput loading />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-busy', 'true');
    });

    it('hides clear button when loading is true', () => {
      render(<SearchInput value="texto" onChange={() => {}} loading />);
      expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
    });

    it('does not set aria-busy when loading is false', () => {
      render(<SearchInput />);
      expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-busy');
    });
  });
});
