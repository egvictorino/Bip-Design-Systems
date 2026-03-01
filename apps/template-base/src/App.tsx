import { Button } from '@bip/ui-components';
import { formatCurrency } from '@bip/shared-utils';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Template Base — BipUI</h1>
        <Button variant="primary" onClick={() => alert('¡Funciona!')}>
          Botón de tu Librería
        </Button>
        <p className="text-text-secondary">Precio: {formatCurrency(1500)}</p>
      </div>
    </div>
  );
}

export default App;
