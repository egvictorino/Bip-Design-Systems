import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, ThemeProvider } from '@bip-design-systems/ui-components';
import '@bip-design-systems/ui-components/style.css';

/**
 * Smoke app for e2e/consumer.spec.ts — verifies the PUBLISHED tarball, not the workspace
 * source. Renders one Button under the default theme and one under theme="rounded" so the
 * Playwright test can assert on real computed styles (background-color from tokens.css,
 * border-radius from the theme axis) pulled through dist/style.css as an actual consumer
 * would get it, not through the monorepo's live source.
 */
function App() {
  return (
    <div>
      <ThemeProvider theme="square">
        <Button data-testid="button-square" variant="primary">
          Square
        </Button>
      </ThemeProvider>
      <ThemeProvider theme="rounded">
        <Button data-testid="button-rounded" variant="primary">
          Rounded
        </Button>
      </ThemeProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
