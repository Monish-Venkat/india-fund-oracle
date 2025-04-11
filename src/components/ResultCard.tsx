
import React from 'react';
import { SearchResult } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleHelp, ChevronRight, Landmark } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResultCardProps {
  result: SearchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { name, type, metadata, explanation } = result;

  const formatMoney = (value: number | undefined) => {
    if (!value) return 'N/A';
    return value >= 1000 
      ? `₹${(value / 1000).toFixed(1)}K Cr` 
      : `₹${value} Cr`;
  };
  
  const getReturnsDisplay = () => {
    const returns = metadata.returns;
    if (!returns) return null;
    
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {returns.oneYear !== undefined && (
          <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">1Y Return</div>
            <div className={`font-semibold text-lg ${returns.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.oneYear >= 0 ? '+' : ''}{returns.oneYear.toFixed(1)}%
            </div>
          </div>
        )}
        
        {returns.threeYear !== undefined && (
          <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">3Y Return</div>
            <div className={`font-semibold text-lg ${returns.threeYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.threeYear >= 0 ? '+' : ''}{returns.threeYear.toFixed(1)}%
            </div>
          </div>
        )}
        
        {returns.fiveYear !== undefined && (
          <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">5Y Return</div>
            <div className={`font-semibold text-lg ${returns.fiveYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.fiveYear >= 0 ? '+' : ''}{returns.fiveYear.toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200 rounded-xl">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-3 pt-4 px-4 flex flex-row items-center justify-between">
        <div>
          <Badge variant={type === 'mutual_fund' ? 'default' : 'outline'} 
                 className={`mb-2 ${type === 'mutual_fund' ? 'bg-blue-600' : 'border-blue-600 text-blue-600'}`}>
            {type === 'mutual_fund' ? 'Mutual Fund' : 'Stock'}
          </Badge>
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
          {metadata.fundHouse && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Landmark className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              {metadata.fundHouse}
            </div>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full bg-blue-50 p-2 hover:bg-blue-100 transition-colors cursor-help">
                <CircleHelp className="h-4 w-4 text-blue-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80 text-sm">{explanation}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="grid grid-cols-2 gap-4">
          {metadata.category && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">{metadata.category}</p>
              {metadata.subCategory && (
                <p className="text-xs text-gray-500 mt-1">{metadata.subCategory}</p>
              )}
            </div>
          )}
          
          {metadata.aum && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">AUM</p>
              <p className="font-medium text-gray-800">{formatMoney(metadata.aum)}</p>
            </div>
          )}
          
          {metadata.taxSaving && (
            <div className="col-span-2 flex items-center mt-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Tax Saving
              </Badge>
            </div>
          )}
          
          {metadata.symbol && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Symbol</p>
              <p className="font-medium text-gray-800">{metadata.symbol}</p>
            </div>
          )}
          
          {metadata.sector && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Sector</p>
              <p className="font-medium text-gray-800">{metadata.sector}</p>
              {metadata.industry && (
                <p className="text-xs text-gray-500 mt-1">{metadata.industry}</p>
              )}
            </div>
          )}
          
          {metadata.holding && (
            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Key Holding</p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  {metadata.holding.stock}
                </p>
                <span className="text-blue-600 font-medium">
                  {metadata.holding.percentage}%
                </span>
              </div>
            </div>
          )}
          
          {metadata.sectorExposure && (
            <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Sector Exposure</p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  {metadata.sectorExposure.sector}
                  <span className="text-gray-500 ml-2 text-sm">
                    via {metadata.sectorExposure.stock}
                  </span>
                </p>
                <span className="text-blue-600 font-medium">
                  {metadata.sectorExposure.percentage}%
                </span>
              </div>
            </div>
          )}
          
          {type === 'mutual_fund' && getReturnsDisplay()}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            View Details <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
