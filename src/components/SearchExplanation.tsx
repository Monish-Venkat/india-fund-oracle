
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Lightbulb, SearchX, BookOpen } from 'lucide-react';

interface SearchExplanationProps {
  query: string;
  resultsCount: number;
}

const SearchExplanation: React.FC<SearchExplanationProps> = ({ query, resultsCount }) => {
  if (!query) return null;

  // Determine if the query is a more complex question
  const isComplexQuery = query.toLowerCase().includes('which') || 
                        query.toLowerCase().includes('how') || 
                        query.toLowerCase().includes('why') ||
                        query.toLowerCase().includes('compare') ||
                        query.toLowerCase().includes('suitable') ||
                        query.toLowerCase().includes('best');

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-md">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
            {isComplexQuery ? (
              <BookOpen className="text-white h-6 w-6" />
            ) : (
              <BrainCircuit className="text-white h-6 w-6" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <h3 className="font-semibold text-blue-800 text-lg">
                {isComplexQuery ? 'Question Analysis' : 'Search Analysis'}
              </h3>
              <Badge variant="outline" className="bg-blue-100/70 text-blue-700 border-blue-200 ml-2">
                AI Powered
              </Badge>
              {isComplexQuery && (
                <Badge variant="outline" className="bg-purple-100/70 text-purple-700 border-purple-200">
                  Financial Advisor
                </Badge>
              )}
            </div>
            
            <p className="text-blue-700 mb-4 font-medium">
              {isComplexQuery ? 
                'Our AI analyzed your financial question:' : 
                'Our LLM-powered search analyzed your query:'} 
              <span className="bg-white/50 px-2 py-1 rounded-md font-semibold">"{query}"</span>
            </p>
            
            {resultsCount > 0 ? (
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Lightbulb className="text-amber-500 h-5 w-5" />
                  </div>
                  <span className="text-blue-800 font-medium">
                    {isComplexQuery ? 
                      `Found ${resultsCount} financial instruments relevant to your question` : 
                      `Found ${resultsCount} relevant results based on semantic understanding`}
                  </span>
                </div>
                
                <p className="text-sm text-blue-600 pl-9">
                  {isComplexQuery ? 
                    'The AI analyzed your question to understand your financial goals, risk tolerance, and preferences before matching against our comprehensive database of securities.' :
                    'The model processed your query by understanding intent, handling typos, and matching against our database of securities, considering metadata like fund house, category, returns, and holdings.'}
                </p>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-100 flex items-center gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <SearchX className="text-blue-500 h-5 w-5" />
                </div>
                <span className="text-blue-800">No matches found. Try refining your query.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchExplanation;
