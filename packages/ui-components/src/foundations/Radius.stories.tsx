import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Foundations/Radius',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── RadiusSwatch ───────────────────────────────────────────────────────────

const RadiusSwatch = ({
  name,
  token,
  invariant,
}: {
  name: string;
  token: string;
  invariant?: boolean;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-24 h-24 bg-primary border border-gray-300 shadow-sm"
      style={{ borderRadius: `var(${token})` }}
    />
    <div className="text-center">
      <p className="text-sm font-semibold text-txt">{name}</p>
      <p className="text-xs text-txt-secondary">{token}</p>
      {invariant && <p className="text-xs text-txt-utility">invariante</p>}
    </div>
  </div>
);

// ─── Story ──────────────────────────────────────────────────────────────────

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

export const Overview: Story = {
  render: () => (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Radius</h1>
      <p className="text-lg text-gray-900 mb-4">
        Capa semántica de radius. Los componentes consumen estos tokens, nunca la
        escala cruda (--radius-xs...--radius-2xl). Usa el selector de tema en la
        toolbar de Storybook (Square / Rounded) para ver cómo cambia cada uno —
        los marcados como &ldquo;invariante&rdquo; deben verse idénticos en ambos temas.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {SEMANTIC_RADII.map((r) => (
          <RadiusSwatch key={r.token} {...r} />
        ))}
      </div>
    </div>
  ),
};
