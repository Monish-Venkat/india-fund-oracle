
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const exampleQueries = [
    "ICICI infra",
    "SBI tech growth",
    "High return funds",
    "Get tax funds",
    "Funds with HDFC holdings",
    "Get funds from tech sector",
    "Get funds whose AUM is greater than 1000cr"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for funds, stocks, or ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-lg rounded-lg border-2 border-gray-200 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 py-6 px-8 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Try:</span>
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(example);
              onSearch(example);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
