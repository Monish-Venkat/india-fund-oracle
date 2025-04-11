
import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchBox from '@/components/SearchBox';
import ResultCard from '@/components/ResultCard';
import SearchExplanation from '@/components/SearchExplanation';
import { processQuery } from '@/lib/searchUtils';
import { SearchResult } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      setQuery(searchQuery);
      
      // Process the search query
      const searchResults = await processQuery(searchQuery);
      setResults(searchResults);
      
      // Show a toast notification with the count of results
      const resultCount = searchResults.length;
      if (searchResults[0]?.id === 'no-result') {
        toast({
          title: "No matches found",
          description: "Try changing your search terms or using one of the example queries.",
          variant: "destructive"
        });
      } else {
        toast({
          title: `Found ${resultCount} matching securities`,
          description: `Based on your query: "${searchQuery}"`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Something went wrong while processing your search. Please try again.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Indian Securities Oracle
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through mutual funds and stocks using natural language - powered by AI
          </p>
        </div>
        
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        
        {query && (
          <div className="mt-8 mb-6">
            <SearchExplanation query={query} resultsCount={results.length} />
          </div>
        )}
        
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">Searching securities database...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">No results found. Try a different search term.</p>
            </div>
          ) : null}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 IndiaFund Oracle - AI-Powered Financial Search</p>
          <p className="mt-2">This application uses a compact language model for intelligent financial security matching.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
