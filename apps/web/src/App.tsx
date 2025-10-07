import { useState } from 'react';
import { Header } from './components/Header';
import { SpecificationInput } from './components/SpecificationInput';
import { ContractDisplay } from './components/ContractDisplay';
import { api } from './api';
import type { DesignContract } from './types';

function App() {
  const [contract, setContract] = useState<DesignContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (specification: string) => {
    setIsLoading(true);
    setError(null);
    setContract(null);

    try {
      const response = await api.analyze(specification);
      if (response.success && response.contract) {
        setContract(response.contract);
      } else {
        setError(response.errors?.join(', ') || 'Failed to analyze specification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SpecificationInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>

            <div>
              <ContractDisplay contract={contract} error={error} />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>
              Built with React + Vite + TypeScript + Tailwind CSS
            </p>
            <p className="mt-1">
              API: {import.meta.env.VITE_API_URL || 'http://localhost:3000'}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
