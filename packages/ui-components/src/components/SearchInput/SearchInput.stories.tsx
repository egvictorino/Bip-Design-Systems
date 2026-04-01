import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Buscar paciente...',
    variant: 'outlined',
    size: 'md',
  },
};

export const Controlado: Story = {
  args: { placeholder: 'Buscar...' },
  render: () => {
    const Story = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Buscar paciente por nombre o RFC..."
          fullWidth
        />
      );
    };
    return (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    );
  },
};

export const ConLabel: Story = {
  args: {
    label: 'Buscar paciente',
    placeholder: 'Nombre, RFC o teléfono...',
    helperText: 'Mínimo 3 caracteres',
    size: 'md',
  },
};

export const ConError: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Buscar...',
    error: true,
    errorMessage: 'No se encontraron resultados',
    value: 'xyz123',
  },
};

export const FilledVariant: Story = {
  args: {
    label: 'Buscar paciente',
    placeholder: 'Nombre o RFC...',
    helperText: 'Resultados en tiempo real',
    variant: 'filled',
    size: 'md',
  },
};

export const BareVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '20rem' }}>
      <SearchInput variant="bare" placeholder="Búsqueda bare normal..." />
      <SearchInput variant="bare" placeholder="Búsqueda bare con error..." error errorMessage="Sin resultados" value="abc" />
    </div>
  ),
  args: {},
};

export const Disabled: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Campo deshabilitado...',
    disabled: true,
    variant: 'outlined',
    size: 'md',
  },
};

export const Tamaños: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
      <SearchInput size="sm" placeholder="Tamaño sm..." />
      <SearchInput size="md" placeholder="Tamaño md..." />
      <SearchInput size="lg" placeholder="Tamaño lg..." />
    </div>
  ),
  args: {},
};

export const ConLoading: Story = {
  render: () => {
    const Story = () => {
      const [loading, setLoading] = useState(false);
      const [value, setValue] = useState('');

      const handleSearch = (v: string) => {
        if (!v) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      };

      return (
        <div style={{ width: '20rem' }}>
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            onSearch={handleSearch}
            loading={loading}
            label="Buscar paciente"
            placeholder="Escribe para buscar..."
          />
        </div>
      );
    };
    return <Story />;
  },
  args: {},
};

export const ConDebounce: Story = {
  render: () => {
    const Story = () => {
      const [value, setValue] = useState('');
      const [callCount, setCallCount] = useState(0);
      const [lastSearch, setLastSearch] = useState('');

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '20rem' }}>
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            onSearch={(v) => {
              setCallCount((c) => c + 1);
              setLastSearch(v);
            }}
            debounceMs={400}
            label="Búsqueda con debounce (400ms)"
            placeholder="Escribe rápido..."
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
            Llamadas a onSearch: <strong>{callCount}</strong>
            {lastSearch && ` — último valor: "${lastSearch}"`}
          </p>
        </div>
      );
    };
    return <Story />;
  },
  args: {},
};

export const BuscarAlEnter: Story = {
  render: () => {
    const Story = () => {
      const [value, setValue] = useState('');
      const [searchedFor, setSearchedFor] = useState('');

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '20rem' }}>
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            onSearch={setSearchedFor}
            searchOnEnter
            label="Buscar al presionar Enter"
            placeholder="Escribe y presiona Enter..."
          />
          {searchedFor && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)' }}>
              Buscando: <strong>&ldquo;{searchedFor}&rdquo;</strong>
            </p>
          )}
        </div>
      );
    };
    return <Story />;
  },
  args: {},
};

export const NoControlado: Story = {
  render: () => (
    <div style={{ width: '20rem' }}>
      <SearchInput
        defaultValue=""
        placeholder="Escribe algo para ver el botón limpiar..."
        label="Búsqueda no controlada"
        helperText="El botón × aparece sin necesidad de controlar el estado"
      />
    </div>
  ),
  args: {},
};
