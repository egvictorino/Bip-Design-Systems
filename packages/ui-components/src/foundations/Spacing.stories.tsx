import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import type { BipDensity } from '../components/ThemeProvider';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Spacing',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RAW_SCALE = [
  '0',
  'px',
  '0-5',
  '1',
  '1-5',
  '2',
  '2-5',
  '3',
  '3-5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '12',
  '14',
  '16',
  '18',
  '22',
];

const CONTROL_TOKENS: { name: string; token: string }[] = [
  { name: 'Control X · sm', token: '--space-control-x-sm' },
  { name: 'Control Y · sm', token: '--space-control-y-sm' },
  { name: 'Control X · md', token: '--space-control-x-md' },
  { name: 'Control Y · md', token: '--space-control-y-md' },
  { name: 'Control X · lg', token: '--space-control-x-lg' },
  { name: 'Control Y · lg', token: '--space-control-y-lg' },
];

// ─── RawSwatch ──────────────────────────────────────────────────────────────

const RawSwatch = ({ name }: { name: string }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState('');
  const token = `--space-${name}`;

  useEffect(() => {
    if (boxRef.current) {
      setResolved(getComputedStyle(boxRef.current).width);
    }
  }, []);

  return (
    <div className={styles.swatchButton} style={{ cursor: 'default' }}>
      <div
        ref={boxRef}
        style={{
          height: '0.75rem',
          width: `var(${token})`,
          minWidth: '2px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: 'var(--radius-xs)',
        }}
      />
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{token}</p>
        <p className={styles.swatchValue}>{resolved || '…'}</p>
      </div>
    </div>
  );
};

// ─── DensityPanel ───────────────────────────────────────────────────────────

const DensityPanel = ({ density }: { density: BipDensity }) => (
  <ThemeProvider theme="square" density={density}>
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>{density === 'compact' ? 'Compact' : 'Comfortable (default)'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button size="sm">sm</Button>
          <Button size="md">md</Button>
          <Button size="lg">lg</Button>
        </div>
        <Input size="md" placeholder="Input md" style={{ width: '16rem' }} />
      </div>
      <div className={styles.grid} style={{ marginTop: '1.5rem' }}>
        {CONTROL_TOKENS.map((t) => (
          <div key={t.token} className={styles.swatchButton} style={{ cursor: 'default' }}>
            <div
              style={{
                height: '0.75rem',
                width: `var(${t.token})`,
                minWidth: '2px',
                backgroundColor: 'var(--color-secondary)',
                borderRadius: 'var(--radius-xs)',
              }}
            />
            <div className={styles.swatchLabel}>
              <p className={styles.swatchName}>{t.name}</p>
              <p className={styles.swatchValue}>{t.token}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </ThemeProvider>
);

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Spacing</h1>
      <p className={styles.lead}>
        Escala cruda --space-* (grilla de 0.125rem) y la capa semántica de densidad
        (--space-control-x/-y-*) que Button/Input/Textarea/Select consumen para su padding.
      </p>
      <p className={styles.hint}>
        El resto de --space-* (gaps, padding de superficies) es invariante a densidad — solo
        la horquilla de controles cambia entre comfortable y compact.
      </p>
      <div className={styles.grid} style={{ marginBottom: '2rem' }}>
        {RAW_SCALE.map((name) => (
          <RawSwatch key={name} name={name} />
        ))}
      </div>
      <div className={styles.panels}>
        <DensityPanel density="comfortable" />
        <DensityPanel density="compact" />
      </div>
    </div>
  ),
};
