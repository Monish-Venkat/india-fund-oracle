
import React from 'react';
import { SearchResult } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleHelp } from 'lucide-react';
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
      <div className="grid grid-cols-3 gap-2 mt-3">
        {returns.oneYear !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">1Y Return</div>
            <div className={`font-semibold ${returns.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.oneYear >= 0 ? '+' : ''}{returns.oneYear.toFixed(1)}%
            </div>
          </div>
        )}
        
        {returns.threeYear !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">3Y Return</div>
            <div className={`font-semibold ${returns.threeYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.threeYear >= 0 ? '+' : ''}{returns.threeYear.toFixed(1)}%
            </div>
          </div>
        )}
        
        {returns.fiveYear !== undefined && (
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">5Y Return</div>
            <div className={`font-semibold ${returns.fiveYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returns.fiveYear >= 0 ? '+' : ''}{returns.fiveYear.toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gray-50 pb-2 pt-4 px-4 flex flex-row items-center justify-between">
        <div>
          <Badge variant={type === 'mutual_fund' ? 'default' : 'outline'} className="mb-2">
            {type === 'mutual_fund' ? 'Mutual Fund' : 'Stock'}
          </Badge>
          <h3 className="font-semibold text-lg">{name}</h3>
          {metadata.fundHouse && (
            <p className="text-sm text-gray-600">{metadata.fundHouse}</p>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full bg-blue-50 p-2">
                <CircleHelp className="h-4 w-4 text-blue-600" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80 text-sm">{explanation}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {metadata.category && (
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{metadata.category}</p>
              {metadata.subCategory && (
                <p className="text-xs text-gray-500">{metadata.subCategory}</p>
              )}
            </div>
          )}
          
          {metadata.aum && (
            <div>
              <p className="text-sm text-gray-500">AUM</p>
              <p className="font-medium">{formatMoney(metadata.aum)}</p>
            </div>
          )}
          
          {metadata.taxSaving && (
            <div className="col-span-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Tax Saving
              </Badge>
            </div>
          )}
          
          {metadata.symbol && (
            <div>
              <p className="text-sm text-gray-500">Symbol</p>
              <p className="font-medium">{metadata.symbol}</p>
            </div>
          )}
          
          {metadata.sector && (
            <div>
              <p className="text-sm text-gray-500">Sector</p>
              <p className="font-medium">{metadata.sector}</p>
              {metadata.industry && (
                <p className="text-xs text-gray-500">{metadata.industry}</p>
              )}
            </div>
          )}
          
          {metadata.holding && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Key Holding</p>
              <p className="font-medium">
                {metadata.holding.stock} 
                <span className="text-gray-500 ml-2 text-sm">
                  ({metadata.holding.percentage}%)
                </span>
              </p>
            </div>
          )}
          
          {metadata.sectorExposure && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Sector Exposure</p>
              <p className="font-medium">
                {metadata.sectorExposure.sector}
                <span className="text-gray-500 ml-2 text-sm">
                  via {metadata.sectorExposure.stock} ({metadata.sectorExposure.percentage}%)
                </span>
              </p>
            </div>
          )}
          
          {type === 'mutual_fund' && getReturnsDisplay()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
