import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import { TOKEN_GROUPS, SHADOW_TOKENS } from './tokens.data';
import type { TokenEntry } from './tokens.data';
import pkg from '../../package.json';
import styles from './Foundations.module.css';

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── ColorSwatch ────────────────────────────────────────────────────────────
// Los datos de tokens.data.ts vienen del parseo estático de tokens.css — no
// pueden desincronizarse porque leen el archivo real (`?raw`), no una copia
// mantenida a mano. El hex resuelto en runtime (para mostrar/copiar) sale de
// getComputedStyle, ya que la variable puede depender del esquema activo.

const ColorSwatch = ({ token, scheme }: { token: TokenEntry; scheme: 'light' | 'dark' }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (boxRef.current) {
      setResolved(getComputedStyle(boxRef.current).backgroundColor);
    }
  }, []);

  const formula = scheme === 'dark' ? (token.dark ?? token.light) : token.light;
  const isInvariant = scheme === 'dark' && token.dark === null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolved);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API not available (HTTP context or permission denied)
    }
  };

  return (
    <button
      type="button"
      className={styles.swatchButton}
      onClick={handleCopy}
      aria-label={`Copiar ${token.name}: ${resolved}`}
    >
      <div ref={boxRef} className={styles.swatchBox} style={{ backgroundColor: `var(--${token.name})` }} />
      <div className={styles.swatchLabel}>
        <p className={styles.swatchName}>{token.name}</p>
        <p className={styles.swatchValue}>{copied ? '¡Copiado!' : resolved || '…'}</p>
        <span className={`${styles.kindBadge} ${token.kind === 'seed' ? styles.kindSeed : styles.kindDerived}`}>
          {token.kind === 'seed' ? 'Semilla' : 'Derivado'}
        </span>
        {token.kind === 'derived' && <p className={styles.formula}>{formula}</p>}
        {isInvariant && <p className={styles.invariantNote}>invariante entre esquemas</p>}
      </div>
    </button>
  );
};

// ─── ShadowSwatch ───────────────────────────────────────────────────────────

const ShadowSwatch = ({ name }: { name: string }) => (
  <div className={styles.swatchButton} style={{ cursor: 'default' }}>
    <div
      className={styles.swatchBox}
      style={{ backgroundColor: 'var(--color-surface-1)', boxShadow: `var(--${name})` }}
    />
    <div className={styles.swatchLabel}>
      <p className={styles.swatchName}>{name}</p>
    </div>
  </div>
);

// ─── ColorPanel ─────────────────────────────────────────────────────────────

const ColorPanel = ({ scheme }: { scheme: 'light' | 'dark' }) => (
  <ThemeProvider theme="square" colorScheme={scheme}>
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>{scheme === 'light' ? 'Light' : 'Dark'}</h2>
      {TOKEN_GROUPS.map(({ title, tokens }) => (
        <div key={title} className={styles.group}>
          <h3 className={styles.groupTitle}>{title}</h3>
          <div className={styles.grid}>
            {tokens.map((token) => (
              <ColorSwatch key={token.name} token={token} scheme={scheme} />
            ))}
          </div>
        </div>
      ))}
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Shadows</h3>
        <div className={styles.grid}>
          {SHADOW_TOKENS.map((shadow) => (
            <ShadowSwatch key={shadow.name} name={shadow.name} />
          ))}
        </div>
      </div>
    </div>
  </ThemeProvider>
);

// ─── Story ──────────────────────────────────────────────────────────────────

export const Overview: Story = {
  render: () => (
    <div className={styles.page}>
      <h1 className={styles.title}>Color Palette</h1>
      <p className={styles.version}>Versión {pkg.version}</p>
      <p className={styles.lead}>
        Los siguientes colores son los colores base del design system. Sigue las guías de uso
        para mantener consistencia en todo el producto.
      </p>
      <p className={styles.hint}>
        Haz clic en cualquier muestra para copiar el hex resuelto al portapapeles.{' '}
        <strong>Semilla</strong> — hex editable vía <code>ThemeProvider tokens</code>.{' '}
        <strong>Derivado</strong> — calculado desde una semilla con <code>color-mix()</code>;
        recolorea automáticamente al sobrescribir la semilla. Ver ambos esquemas lado a lado, sin
        depender del toolbar.
      </p>
      <div className={styles.panels}>
        <ColorPanel scheme="light" />
        <ColorPanel scheme="dark" />
      </div>
    </div>
  ),
};
