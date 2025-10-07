import type { DesignContract } from '../types';

interface ContractDisplayProps {
  contract: DesignContract | null;
  error: string | null;
}

export function ContractDisplay({ contract, error }: ContractDisplayProps) {
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium">No contract generated yet</h3>
          <p className="mt-1 text-sm">
            Enter a specification above to generate a Design Contract
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Generated Design Contract
      </h2>

      {/* Metadata */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
          Metadata
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Name:</span>
            <span className="text-gray-800">{contract.metadata.name}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Domain:</span>
            <span className="text-gray-800">{contract.metadata.domain}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-600 w-32">Locale:</span>
            <span className="text-gray-800">{contract.metadata.locale}</span>
          </div>
          {contract.metadata.version && (
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">Version:</span>
              <span className="text-gray-800">{contract.metadata.version}</span>
            </div>
          )}
          {contract.metadata.description && (
            <div className="flex">
              <span className="font-medium text-gray-600 w-32">Description:</span>
              <span className="text-gray-800">{contract.metadata.description}</span>
            </div>
          )}
        </div>
      </section>

      {/* Entities */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Entities ({contract.entities.length})
        </h3>
        <div className="space-y-4">
          {contract.entities.map((entity, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{entity.name}</h4>
              <div className="space-y-1">
                {entity.attributes.map((attr, attrIdx) => (
                  <div key={attrIdx} className="flex items-center text-sm">
                    <span className="font-mono text-gray-600">{attr.name}</span>
                    <span className="mx-2 text-gray-400">:</span>
                    <span className="text-blue-600">{attr.type}</span>
                    {attr.required && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                        required
                      </span>
                    )}
                    {attr.unique && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">
                        unique
                      </span>
                    )}
                    {attr.enum && (
                      <span className="ml-2 text-xs text-gray-500">
                        [{attr.enum.join(', ')}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
          Services ({contract.services.length})
        </h3>
        <div className="space-y-4">
          {contract.services.map((service, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{service.name}</h4>
              <div className="space-y-1">
                {service.operations.map((op, opIdx) => (
                  <div key={opIdx} className="flex items-center text-sm">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">
                      {op.method}
                    </span>
                    <span className="ml-2 font-mono text-gray-700">{op.name}</span>
                    <span className="mx-2 text-gray-400">:</span>
                    <span className="text-gray-600">
                      {op.input} → {op.output}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UI */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
          User Interface
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="mb-3">
            <h4 className="font-medium text-gray-700 mb-2">
              Routes ({contract.ui.routes.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {contract.ui.routes.map((route, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-mono"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Components ({contract.ui.components.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {contract.ui.components.map((component, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm"
                >
                  {component}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JSON Export */}
      <section className="mt-6">
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(contract, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${contract.metadata.name}-contract.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Download JSON
        </button>
      </section>
    </div>
  );
}

