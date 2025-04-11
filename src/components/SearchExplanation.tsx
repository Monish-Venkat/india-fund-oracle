
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchX, BrainCircuit, Lightbulb } from 'lucide-react';

interface SearchExplanationProps {
  query: string;
  resultsCount: number;
}

const SearchExplanation: React.FC<SearchExplanationProps> = ({ query, resultsCount }) => {
  if (!query) return null;

  return (
    <Card className="bg-blue-50 border-blue-100">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <BrainCircuit className="text-blue-600 h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
              Search Analysis
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                AI Powered
              </Badge>
            </h3>
            
            <p className="text-blue-700 mb-3">
              Our LLM-powered search analyzed your query: <strong>"{query}"</strong>
            </p>
            
            {resultsCount > 0 ? (
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-amber-500 h-5 w-5" />
                  <span className="text-blue-800">
                    Found {resultsCount} relevant results based on semantic understanding
                  </span>
                </div>
                
                <p className="text-sm text-blue-600">
                  The model processed your query by understanding intent, handling typos, and matching against 
                  our database of securities, considering metadata like fund house, category, returns, and holdings.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-800">
                <SearchX className="text-blue-500 h-5 w-5" />
                <span>No matches found. Try refining your query.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchExplanation;
