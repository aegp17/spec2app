import { useState } from 'react';

interface SpecificationInputProps {
  onAnalyze: (specification: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  'Create a task manager app with User and Task entities',
  'Create an e-commerce store with Product and Order entities',
  'Create a blog platform with Post, Author and Comment entities',
  'Create a social network with User, Post, and Comment entities',
  'Create a healthcare app with Patient and Appointment entities',
];

export function SpecificationInput({ onAnalyze, isLoading }: SpecificationInputProps) {
  const [specification, setSpecification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (specification.trim()) {
      onAnalyze(specification);
    }
  };

  const handleExampleClick = (example: string) => {
    setSpecification(example);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Enter Your Specification
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
          placeholder="Describe your application in natural language..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading || !specification.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Specification'
            )}
          </button>

          <button
            type="button"
            onClick={() => setSpecification('')}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Try these examples:
        </h3>
        <div className="space-y-2">
          {EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

