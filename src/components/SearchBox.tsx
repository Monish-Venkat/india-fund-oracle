
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
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
    "Find me large-cap funds",
    "Which funds have low expense ratio?",
    "Show dividend yield stocks",
    "Compare HDFC and SBI mutual funds",
    "Which debt funds are safe?",
    "Funds suitable for retirement",
    "Best performing IT sector funds"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-800">Ask Any Financial Question</h3>
            </div>
            
            <div className="flex w-full items-center space-x-2 mt-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Ask about funds, stocks, market trends, or financial advice..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-4 py-7 text-lg rounded-lg border-2 border-gray-200 focus:border-blue-500 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 py-7 px-8 text-lg shadow-md transition-all ease-in-out duration-200 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          <span className="text-sm text-gray-500 font-medium">Try asking about:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(example);
                  onSearch(example);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition-colors duration-200 border border-blue-100"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
