import type { Meta, StoryObj } from '@storybook/react';
import { BREAKPOINTS, mediaQuery, type BreakpointKey } from '../styles/breakpoints';
import { useMediaQuery } from '../hooks';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Breakpoints',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const KEYS = Object.keys(BREAKPOINTS) as BreakpointKey[];

// ─── LiveIndicator ──────────────────────────────────────────────────────────
// Demuestra useMediaQuery en vivo: redimensiona la ventana del navegador (o el
// panel de Storybook) para ver qué breakpoints están activos ahora mismo.
// Cada breakpoint es su propio componente — no se llama useMediaQuery dentro de un map.

const BreakpointIndicator = ({ breakpointKey }: { breakpointKey: BreakpointKey }) => {
  const matches = useMediaQuery(mediaQuery(breakpointKey));
  return (
    <div className={styles.swatchButton} style={{ cursor: 'default' }}>
      <div
        style={{
          width: '100%',
          height: '2.5rem',
          borderRadius: 'var(--radius-control)',
          backgroundColor: matches ? 'var(--color-primary)' : 'var(--color-surface-2)',
          border: '1px solid var(--color-edge)',
          transition: 'background-color var(--duration-fast)',
        }}
      />
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{breakpointKey}</p>
        <p className={styles.swatchValue}>{matches ? 'activo' : 'inactivo'}</p>
      </div>
    </div>
  );
};

const LiveIndicator = () => (
  <div className={styles.grid}>
    {KEYS.map((key) => (
      <BreakpointIndicator key={key} breakpointKey={key} />
    ))}
  </div>
);

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Breakpoints</h1>
      <p className={styles.lead}>
        Escala de breakpoints (<code>src/styles/breakpoints.ts</code>) — fuente única para{' '}
        <code>@media (min-width: …)</code> en <code>.module.css</code> (CSS no permite{' '}
        <code>var()</code> dentro de una media query) y para <code>useMediaQuery</code> en
        runtime.
      </p>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Escala — BREAKPOINTS</h3>
        <div className={styles.grid}>
          {KEYS.map((key) => (
            <div key={key} className={styles.swatchButton} style={{ cursor: 'default' }}>
              <div
                style={{
                  width: '100%',
                  height: '0.75rem',
                  backgroundColor: 'var(--color-secondary)',
                  borderRadius: 'var(--radius-xs)',
                }}
              />
              <div className={styles.swatchLabel}>
                <p className={styles.swatchName}>{key}</p>
                <p className={styles.swatchValue}>{BREAKPOINTS[key]}px</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>useMediaQuery — en vivo</h3>
        <p className={styles.hint}>
          Redimensiona la ventana para ver qué breakpoints están activos ahora mismo.
        </p>
        <LiveIndicator />
      </div>
    </div>
  ),
};
