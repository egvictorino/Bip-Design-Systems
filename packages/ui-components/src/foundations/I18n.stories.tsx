import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { esMX, enUS } from '../i18n';
import type { BipLocale } from '../i18n';
import { DatePicker } from '../components/DatePicker';
import { MultiSelect } from '../components/MultiSelect';
import type { MultiSelectOption } from '../components/MultiSelect';
import { Pagination } from '../components/Pagination';
import { DataTable } from '../components/DataTable';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/I18n',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sample data ────────────────────────────────────────────────────────────

const FRUIT_OPTIONS: MultiSelectOption[] = [
  { value: 'apple', label: 'Manzana' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cereza' },
  { value: 'mango', label: 'Mango' },
];

interface Patient extends Record<string, unknown> {
  id: number;
  name: string;
  lastVisit: string;
}

const PATIENTS: Patient[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  name: ['María González', 'Juan Pérez', 'Ana López'][i],
  lastVisit: `${String(i + 10).padStart(2, '0')}/03/2026`,
}));

const COLUMNS = [
  { key: 'id', header: '#', width: '60px' },
  { key: 'name', header: 'Nombre' },
  { key: 'lastVisit', header: 'Última visita' },
];

// ─── Gallery — the components with the most locale-driven text ────────────

const Gallery = () => {
  const [date, setDate] = useState<Date | null>(new Date(2026, 5, 15));
  const [selected, setSelected] = useState<string[]>(['apple']);
  const [page, setPage] = useState(2);

  return (
    <div className={styles.themingGallery}>
      <div className={styles.themingGalleryRow}>
        <DatePicker label="Fecha" value={date} onChange={setDate} />
        <MultiSelect
          label="Frutas"
          options={FRUIT_OPTIONS}
          value={selected}
          onChange={setSelected}
        />
      </div>
      <Pagination page={page} totalPages={6} onPageChange={setPage} />
      <DataTable data={PATIENTS} columns={COLUMNS} />
    </div>
  );
};

// ─── Playground ─────────────────────────────────────────────────────────────

const LOCALES: { key: string; label: string; locale: BipLocale }[] = [
  { key: 'es-MX', label: 'es-MX (default)', locale: esMX },
  { key: 'en-US', label: 'en-US', locale: enUS },
];

const Playground = () => {
  const [localeKey, setLocaleKey] = useState('es-MX');
  const active = LOCALES.find((l) => l.key === localeKey) ?? LOCALES[0];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>i18n playground</h1>
      <p className={styles.lead}>
        Cambia el <code>locale</code> del <code>ThemeProvider</code> y observa cómo se
        recorren todos los <code>aria-label</code>, placeholders y formatos de fecha de la
        librería — sin ninguno quemado en español sin forma de sobreescribirlo. El default sin
        configurar (<code>esMX</code>) es idéntico al comportamiento previo a este sistema.
      </p>

      <div className={styles.themingControls}>
        <label className={styles.themingControlGroup}>
          Locale
          <select value={localeKey} onChange={(e) => setLocaleKey(e.target.value)}>
            {LOCALES.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ThemeProvider locale={active.locale}>
        <div className={styles.themingGalleryWrapper}>
          <Gallery />
        </div>
      </ThemeProvider>
    </div>
  );
};

export const Overview: Story = {
  render: () => <Playground />,
};

export const PartialOverride: Story = {
  render: () => (
    <ThemeProvider locale={{ alert: { close: 'Dismiss' }, pagination: { page: (n) => `p. ${n}` } }}>
      <div className={styles.themingGalleryWrapper}>
        <p className={styles.lead}>
          Override parcial — solo <code>alert.close</code> y <code>pagination.page</code>{' '}
          cambian, el resto del diccionario sigue en <code>es-MX</code>.
        </p>
        <Gallery />
      </div>
    </ThemeProvider>
  ),
};
