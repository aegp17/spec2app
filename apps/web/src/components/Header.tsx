import { useState, useEffect } from 'react';
import { api } from '../api';

export function Header() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.getHealth();
        setIsHealthy(true);
      } catch {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Spec2App</h1>
            <p className="text-blue-100 text-sm mt-1">
              Transform natural language into Design Contracts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isHealthy === null
                  ? 'bg-gray-400'
                  : isHealthy
                  ? 'bg-green-400'
                  : 'bg-red-400'
              } animate-pulse`}
            />
            <span className="text-sm">
              {isHealthy === null
                ? 'Checking...'
                : isHealthy
                ? 'API Online'
                : 'API Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

