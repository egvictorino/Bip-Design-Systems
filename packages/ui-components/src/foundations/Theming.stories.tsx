import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import type { BipTheme, BipColorScheme, BipTokenOverrides } from '../components/ThemeProvider';
import { contrastRatio } from '../lib/contrast';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Alert } from '../components/Alert';
import { Tabs, TabList, Tab, TabPanel } from '../components/Tabs';
import { Pagination } from '../components/Pagination';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Theming',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Semillas editables ─────────────────────────────────────────────────────
// Solo las 6 semillas de relleno (con contraparte --color-txt-on-*) importan
// para el canario de contraste; el resto de BipTokenOverrides se deja fuera
// del playground para no diluir el punto — ver ThemeProvider.tsx ON_TEXT_VAR_MAP.

const FILL_SEEDS: { key: keyof BipTokenOverrides; label: string; default: string }[] = [
  { key: 'colorPrimary', label: 'Primary', default: '#3347ff' },
  { key: 'colorDanger', label: 'Danger', default: '#ef4444' },
  { key: 'colorSuccess', label: 'Success', default: '#22c55e' },
  { key: 'colorWarning', label: 'Warning', default: '#eab308' },
  { key: 'colorInfo', label: 'Info', default: '#3347ff' },
  { key: 'colorUnique', label: 'Unique', default: '#a855f7' },
];

const ON_TXT_VAR: Record<string, string> = {
  colorPrimary: '--color-txt-on-primary',
  colorDanger: '--color-txt-on-danger',
  colorSuccess: '--color-txt-on-success',
  colorWarning: '--color-txt-on-warning',
  colorInfo: '--color-txt-on-info',
  colorUnique: '--color-txt-on-unique',
};

// ─── Galería — componentes que pintan texto sobre un fill de marca ─────────

const Gallery = () => {
  const [page, setPage] = useState(3);
  return (
    <div className={styles.themingGallery}>
      <div className={styles.themingGalleryRow}>
        <Button variant="primary">Primary</Button>
        <Button variant="danger">Danger</Button>
        <Avatar name="Ada Lovelace" />
      </div>
      <Tabs defaultValue="a" variant="boxed">
        <TabList>
          <Tab value="a">Tab A</Tab>
          <Tab value="b">Tab B</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
      </Tabs>
      <Pagination page={page} totalPages={8} onPageChange={setPage} />
      <Alert variant="info">Alert informativo — no pinta sobre fill sólido, referencia de control.</Alert>
    </div>
  );
};

// ─── Panel de contraste — muestra el --color-txt-on-* calculado y su ratio ─

const ContrastRow = ({ seedKey, hex }: { seedKey: string; hex: string }) => {
  const onWhite = contrastRatio(hex, '#ffffff');
  const onDark = contrastRatio(hex, '#191919');
  const picked = onWhite >= onDark ? '#ffffff' : '#191919';
  const ratio = Math.max(onWhite, onDark);
  const passesAA = ratio >= 4.5;
  return (
    <div className={styles.contrastRow}>
      <span
        className={styles.contrastSwatch}
        style={{ backgroundColor: hex, color: picked }}
      >
        Aa
      </span>
      <code>{ON_TXT_VAR[seedKey]}</code>
      <span>{picked === '#ffffff' ? 'blanco' : 'oscuro'}</span>
      <span className={passesAA ? styles.contrastPass : styles.contrastFail}>
        {ratio.toFixed(2)}:1 {passesAA ? '✓ AA' : '✗ AA'}
      </span>
    </div>
  );
};

// ─── Playground ─────────────────────────────────────────────────────────────

const Playground = () => {
  const [theme, setTheme] = useState<BipTheme>('square');
  const [colorScheme, setColorScheme] = useState<BipColorScheme>('light');
  const [seeds, setSeeds] = useState<Record<string, string>>(
    Object.fromEntries(FILL_SEEDS.map((s) => [s.key, s.default]))
  );
  const [copied, setCopied] = useState(false);

  const tokens: BipTokenOverrides = Object.fromEntries(
    FILL_SEEDS.map((s) => [s.key, seeds[s.key]])
  );

  const snippet = `<ThemeProvider\n  theme="${theme}"\n  colorScheme="${colorScheme}"\n  tokens={${JSON.stringify(tokens, null, 2).replace(/\n/g, '\n  ')}}\n>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API no disponible — el snippet ya se ve en pantalla
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Theming playground</h1>
      <p className={styles.lead}>
        Pega un hex en cualquier semilla de relleno y observa cómo <code>ThemeProvider</code>{' '}
        recalcula automáticamente el <code>--color-txt-on-*</code> correspondiente (
        <code>src/lib/contrast.ts</code>) y lo propaga a los componentes de la galería. Prueba con
        un amarillo claro en <strong>Primary</strong> — es el caso que expone cualquier lugar de la
        librería que siga pintando texto blanco fijo en vez de consumir el token calculado.
      </p>

      <div className={styles.themingControls}>
        <label className={styles.themingControlGroup}>
          Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value as BipTheme)}>
            <option value="square">square</option>
            <option value="rounded">rounded</option>
          </select>
        </label>
        <label className={styles.themingControlGroup}>
          Color scheme
          <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value as BipColorScheme)}>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </div>

      <div className={styles.themingSeeds}>
        {FILL_SEEDS.map((seed) => (
          <label key={seed.key} className={styles.themingSeedRow}>
            <input
              type="color"
              value={seeds[seed.key]}
              onChange={(e) => setSeeds((prev) => ({ ...prev, [seed.key]: e.target.value }))}
            />
            <span>{seed.label}</span>
            <code>{seeds[seed.key]}</code>
          </label>
        ))}
      </div>

      <div className={styles.themingContrastPanel}>
        <h3 className={styles.groupTitle}>Contraste calculado</h3>
        {FILL_SEEDS.map((seed) => (
          <ContrastRow key={seed.key} seedKey={seed.key} hex={seeds[seed.key]} />
        ))}
      </div>

      <div className={styles.themingSnippet}>
        <button type="button" onClick={handleCopy} className={styles.themingCopyButton}>
          {copied ? '¡Copiado!' : 'Copiar <ThemeProvider>'}
        </button>
        <pre>{snippet}</pre>
      </div>

      <ThemeProvider theme={theme} colorScheme={colorScheme} tokens={tokens}>
        <div className={styles.themingGalleryWrapper} data-color-scheme={colorScheme}>
          <Gallery />
        </div>
      </ThemeProvider>
    </div>
  );
};

export const Overview: Story = {
  render: () => <Playground />,
};
