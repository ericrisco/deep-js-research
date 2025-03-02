import { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isProcessing: boolean;
}

export const SearchInput = ({ value, onChange, onSearch, isProcessing }: SearchInputProps) => {
  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={isProcessing}
        placeholder="Enter your search query..."
        className="flex-1 px-6 py-4 text-lg rounded-md border border-neutral-800 bg-[#111] text-white focus:border-[#FFE100] focus:outline-none transition-colors disabled:bg-neutral-900 disabled:cursor-not-allowed placeholder-neutral-500"
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <button
        onClick={onSearch}
        disabled={isProcessing || !value.trim()}
        className="px-8 py-4 bg-[#FFE100] text-black font-medium rounded-md hover:bg-[#FFE100]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFE100]"
      >
        Search
      </button>
    </div>
  );
}; 