import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT_SCALE = ['3xs', '2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl'];
const LEADING_SCALE = ['tight', 'normal', 'relaxed'];
const WEIGHT_SCALE = ['normal', 'medium', 'semibold', 'bold'];

// ─── TextScaleRow ───────────────────────────────────────────────────────────

const TextScaleRow = ({ name }: { name: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [resolved, setResolved] = useState('');
  const token = `--text-${name}`;

  useEffect(() => {
    if (ref.current) setResolved(getComputedStyle(ref.current).fontSize);
  }, []);

  return (
    <div className={styles.contrastRow}>
      <p
        ref={ref}
        style={{ fontSize: `var(${token})`, color: 'var(--color-txt)', margin: 0, flex: 1 }}
      >
        The quick brown fox — {token}
      </p>
      <code>{resolved || '…'}</code>
    </div>
  );
};

// ─── LeadingRow ─────────────────────────────────────────────────────────────

const LeadingRow = ({ name }: { name: string }) => {
  const token = `--leading-${name}`;
  return (
    <div className={styles.swatchButton} style={{ cursor: 'default', alignItems: 'stretch' }}>
      <p
        style={{
          lineHeight: `var(${token})`,
          color: 'var(--color-txt)',
          margin: 0,
          fontSize: 'var(--text-sm)',
        }}
      >
        Multi-line text sets the rhythm between lines, which is what leading controls in a
        paragraph like this one.
      </p>
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{token}</p>
      </div>
    </div>
  );
};

// ─── WeightRow ──────────────────────────────────────────────────────────────

const WeightRow = ({ name }: { name: string }) => {
  const token = `--font-${name}`;
  return (
    <div className={styles.contrastRow}>
      <p style={{ fontWeight: `var(${token})`, color: 'var(--color-txt)', margin: 0, flex: 1 }}>
        Aa Bb Cc — {token}
      </p>
    </div>
  );
};

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Typography</h1>
      <p className={styles.lead}>
        Escala tipográfica cruda de <code>primitives.css</code> — invariante a theme/color
        scheme. Los componentes consumen estos tokens directamente (no hay una capa semántica
        intermedia como en radius/color).
      </p>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Font size — --text-*</h3>
        {TEXT_SCALE.map((name) => (
          <TextScaleRow key={name} name={name} />
        ))}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Line height — --leading-*</h3>
        <div className={styles.grid}>
          {LEADING_SCALE.map((name) => (
            <LeadingRow key={name} name={name} />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Font weight — --font-*</h3>
        {WEIGHT_SCALE.map((name) => (
          <WeightRow key={name} name={name} />
        ))}
      </div>
    </div>
  ),
};
