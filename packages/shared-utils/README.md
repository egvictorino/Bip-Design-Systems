# @bip-design-systems/shared-utils

Pure TypeScript utilities (formatting, validation) used across Bip Design Systems projects. No
runtime dependencies, no React — safe to use in any JS/TS project (Node or browser).

## Installation

```bash
npm install @bip-design-systems/shared-utils
# or
pnpm add @bip-design-systems/shared-utils
```

Requires Node >=20. The package is ESM-only (`"type": "module"`).

## Usage

```ts
import { formatCurrency, formatDate, validateRFC } from '@bip-design-systems/shared-utils';

formatCurrency(1234.5); // "$1,234.50" (es-MX locale, MXN currency)
formatCurrency(1234.5, { locale: 'en-US', currency: 'USD' }); // "$1,234.50"

formatDate(new Date()); // formatted using es-MX locale
formatDate(new Date(), { locale: 'en-US', dateStyle: 'long' });

validateRFC('AAAA010101AAA'); // true — Mexican RFC format (uppercase only, no normalization)
```

## API

### `formatCurrency(amount: number, options?: FormatCurrencyOptions): string`

Formats a number as currency via `Intl.NumberFormat`.

- `options.locale` — defaults to `'es-MX'`
- `options.currency` — defaults to `'MXN'`

### `formatDate(date: Date, options?: FormatDateOptions): string`

Formats a `Date` via `Intl.DateTimeFormat`. `FormatDateOptions` extends
`Intl.DateTimeFormatOptions`.

- `options.locale` — defaults to `'es-MX'`
- any other `Intl.DateTimeFormatOptions` field (`dateStyle`, `timeStyle`, etc.)

### `validateRFC(rfc: string): boolean`

Validates a Mexican RFC (Registro Federal de Contribuyentes) format. Uppercase only, no
normalization is applied — pass an already-uppercased string.

Pattern: `/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/`

## License

MIT
