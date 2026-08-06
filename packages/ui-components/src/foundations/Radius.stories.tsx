import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import type { BipTheme } from '../components/ThemeProvider';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Radius',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SEMANTIC_RADII: { name: string; token: string; invariant?: boolean }[] = [
  { name: 'None', token: '--radius-none', invariant: true },
  { name: 'Marker', token: '--radius-marker' },
  { name: 'Field', token: '--radius-field' },
  { name: 'Control', token: '--radius-control' },
  { name: 'Surface', token: '--radius-surface' },
  { name: 'Container', token: '--radius-container' },
  { name: 'Container LG', token: '--radius-container-lg' },
  { name: 'Pill', token: '--radius-pill', invariant: true },
  { name: 'Circle', token: '--radius-circle', invariant: true },
];

// ─── RadiusSwatch ───────────────────────────────────────────────────────────

const RadiusSwatch = ({
  name,
  token,
  invariant,
}: {
  name: string;
  token: string;
  invariant?: boolean;
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState('');

  useEffect(() => {
    if (boxRef.current) {
      setResolved(getComputedStyle(boxRef.current).borderRadius);
    }
  }, []);

  return (
    <div className={styles.swatchButton} style={{ cursor: 'default' }}>
      <div
        ref={boxRef}
        className={styles.swatchBox}
        style={{ backgroundColor: 'var(--color-primary)', borderRadius: `var(${token})` }}
      />
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{name}</p>
        <p className={styles.swatchValue}>{resolved || '…'}</p>
        {invariant && <p className={styles.invariantNote}>invariante entre temas</p>}
      </div>
    </div>
  );
};

// ─── RadiusPanel ────────────────────────────────────────────────────────────

const RadiusPanel = ({ theme }: { theme: BipTheme }) => (
  <ThemeProvider theme={theme} colorScheme="light">
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>{theme === 'square' ? 'Square' : 'Rounded'}</h2>
      <div className={styles.grid}>
        {SEMANTIC_RADII.map((r) => (
          <RadiusSwatch key={r.token} {...r} />
        ))}
      </div>
    </div>
  </ThemeProvider>
);

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Radius</h1>
      <p className={styles.lead}>
        Capa semántica de radius. Los componentes consumen estos tokens, nunca la escala cruda
        (--radius-xs...--radius-2xl).
      </p>
      <p className={styles.hint}>
        Square y Rounded lado a lado — los marcados &ldquo;invariante&rdquo; deben verse
        idénticos en ambos.
      </p>
      <div className={styles.panels}>
        <RadiusPanel theme="square" />
        <RadiusPanel theme="rounded" />
      </div>
    </div>
  ),
};
