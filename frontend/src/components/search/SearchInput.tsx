'use client';

import { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isProcessing: boolean;
}

export function SearchInput({ onSearch, isProcessing }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your research query..."
          disabled={isProcessing}
          className="w-full px-6 py-5 text-lg rounded-md border-2 border-gray-700 bg-black focus:outline-none focus:border-[#ffe600] text-white transition-all duration-200"
        />
        <button
          type="submit"
          disabled={!query.trim() || isProcessing}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#ffe600] text-black font-bold rounded-md hover:bg-[#ffd700] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Research'
          )}
        </button>
      </div>
    </form>
  );
} 