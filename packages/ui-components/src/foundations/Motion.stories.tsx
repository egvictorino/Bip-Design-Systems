import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DURATIONS = ['--duration-instant', '--duration-fast', '--duration-normal', '--duration-slow'];

const EASES = ['--ease-standard', '--ease-out', '--ease-in'];

// ─── DurationDemo ───────────────────────────────────────────────────────────

const DurationDemo = ({ token }: { token: string }) => {
  const [active, setActive] = useState(false);
  return (
    <div className={styles.swatchButton} style={{ cursor: 'default', width: '100%' }}>
      <div
        role="presentation"
        style={{
          width: '100%',
          height: '2rem',
          borderRadius: 'var(--radius-control)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-edge)',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div
          style={{
            width: active ? '100%' : '0%',
            height: '100%',
            backgroundColor: 'var(--color-primary)',
            transition: `width var(${token}) var(--ease-standard)`,
          }}
        />
      </div>
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{token}</p>
        <p className={styles.swatchValue}>hover para animar</p>
      </div>
    </div>
  );
};

// ─── EaseDemo ───────────────────────────────────────────────────────────────

const EaseDemo = ({ token }: { token: string }) => {
  const [active, setActive] = useState(false);
  return (
    <div className={styles.swatchButton} style={{ cursor: 'default', width: '100%' }}>
      <div
        role="presentation"
        style={{
          position: 'relative',
          width: '100%',
          height: '2rem',
          borderRadius: 'var(--radius-control)',
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-edge)',
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div
          style={{
            position: 'absolute',
            top: '0.25rem',
            insetInlineStart: active ? 'calc(100% - 1.5rem - 0.25rem)' : '0.25rem',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: 'var(--radius-circle)',
            backgroundColor: 'var(--color-primary)',
            transition: `inset-inline-start var(--duration-slow) var(${token})`,
          }}
        />
      </div>
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{token}</p>
        <p className={styles.swatchValue}>hover para animar</p>
      </div>
    </div>
  );
};

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Motion</h1>
      <p className={styles.lead}>
        Tokens de duración y easing de <code>primitives.css</code>, overrideables vía la prop{' '}
        <code>motion</code> de <code>ThemeProvider</code>.
      </p>
      <p className={styles.hint}>
        <code>prefers-reduced-motion: reduce</code> colapsa las cuatro duraciones a 0ms
        globalmente (ver <code>index.css</code>) — los componentes no necesitan su propia media
        query mientras usen <code>var(--duration-*)</code>.
      </p>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Duration — --duration-*</h3>
        <div className={styles.grid}>
          {DURATIONS.map((token) => (
            <DurationDemo key={token} token={token} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Easing — --ease-*</h3>
        <div className={styles.grid}>
          {EASES.map((token) => (
            <EaseDemo key={token} token={token} />
          ))}
        </div>
      </div>
    </div>
  ),
};
