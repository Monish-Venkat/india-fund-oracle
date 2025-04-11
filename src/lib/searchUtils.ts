
import { MutualFund, Stock, MutualFundHolding, SearchResult } from './types';
import { mutualFunds, stocks, mutualFundHoldings } from './mockData';

// Simple fuzzy matching function
function fuzzyMatch(query: string, text: string): number {
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  if (text.includes(query)) return 1.0;
  
  const words = query.split(/\s+/);
  let matchCount = 0;
  
  for (const word of words) {
    if (word.length > 2 && text.includes(word)) {
      matchCount++;
    }
  }
  
  return matchCount / words.length;
}

// Process natural language query function
export async function processQuery(query: string): Promise<SearchResult[]> {
  // Simulate a delay for API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Check for special query patterns
  if (lowerQuery.includes('tax') || lowerQuery.includes('elss')) {
    return searchTaxSavingFunds();
  }
  
  if (lowerQuery.includes('high return')) {
    return searchHighReturnFunds();
  }
  
  if (lowerQuery.includes('aum') && (lowerQuery.includes('greater') || lowerQuery.includes('>'))) {
    const aumMatch = query.match(/(\d+)(?:\s*cr)/i);
    if (aumMatch) {
      const aumValue = parseInt(aumMatch[1], 10);
      return searchFundsByAUM(aumValue);
    }
  }
  
  if (lowerQuery.includes('holdings') || lowerQuery.includes('holding')) {
    // Extract stock name from query
    for (const stock of stocks) {
      if (lowerQuery.includes(stock.name.toLowerCase()) || 
          lowerQuery.includes(stock.symbol.toLowerCase())) {
        return searchFundsByHolding(stock.id);
      }
    }
  }
  
  if (lowerQuery.includes('sector') || lowerQuery.includes('industry')) {
    // Extract sector name from query
    const sectors = ['technology', 'tech', 'financial', 'banking', 'infrastructure', 'infra'];
    for (const sector of sectors) {
      if (lowerQuery.includes(sector)) {
        return searchFundsBySector(sector);
      }
    }
  }
  
  // General search across funds and stocks
  for (const fund of mutualFunds) {
    const score = fuzzyMatch(query, fund.name) * 0.6 + 
                  fuzzyMatch(query, fund.fundHouse) * 0.3 +
                  fuzzyMatch(query, fund.category) * 0.1;
    
    if (score > 0.2) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          returns: fund.returns,
          aum: fund.aum
        },
        matchScore: score,
        explanation: `Matched based on fund name and ${fund.fundHouse} fund house`
      });
    }
  }
  
  for (const stock of stocks) {
    const score = fuzzyMatch(query, stock.name) * 0.7 + 
                  fuzzyMatch(query, stock.symbol) * 0.3;
    
    if (score > 0.2) {
      results.push({
        id: stock.id,
        name: stock.name,
        type: 'stock',
        metadata: {
          symbol: stock.symbol,
          sector: stock.sector,
          industry: stock.industry
        },
        matchScore: score,
        explanation: `Matched based on stock name and ${stock.symbol} symbol`
      });
    }
  }
  
  // Sort by match score
  results.sort((a, b) => b.matchScore - a.matchScore);
  
  return results.length > 0 ? results : generateNoResultsResponse(query);
}

function searchTaxSavingFunds(): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const fund of mutualFunds) {
    if (fund.isTaxSaving || (fund.subCategory === 'ELSS')) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          returns: fund.returns,
          taxSaving: true
        },
        matchScore: 0.9,
        explanation: 'Matched as this is a tax-saving ELSS fund'
      });
    }
  }
  
  return results;
}

function searchHighReturnFunds(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Sort funds by 3-year returns
  const sortedFunds = [...mutualFunds]
    .filter(fund => fund.returns && fund.returns.threeYear)
    .sort((a, b) => {
      return (b.returns?.threeYear || 0) - (a.returns?.threeYear || 0);
    });
  
  // Take top 5 funds
  const topFunds = sortedFunds.slice(0, 5);
  
  for (const fund of topFunds) {
    results.push({
      id: fund.id,
      name: fund.name,
      type: 'mutual_fund',
      metadata: {
        fundHouse: fund.fundHouse,
        category: fund.category,
        returns: fund.returns
      },
      matchScore: 0.8,
      explanation: `High-performing fund with ${fund.returns?.threeYear}% 3-year returns`
    });
  }
  
  return results;
}

function searchFundsByAUM(minAum: number): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const fund of mutualFunds) {
    if (fund.aum && fund.aum > minAum) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          aum: fund.aum
        },
        matchScore: 0.85,
        explanation: `Fund with AUM of ₹${fund.aum} crores, exceeding your criteria of ₹${minAum} crores`
      });
    }
  }
  
  return results.sort((a, b) => {
    const aumA = a.metadata.aum || 0;
    const aumB = b.metadata.aum || 0;
    return aumB - aumA;
  });
}

function searchFundsByHolding(stockId: string): SearchResult[] {
  const results: SearchResult[] = [];
  const stock = stocks.find(s => s.id === stockId);
  
  if (!stock) return [];
  
  // Find all fund holdings for this stock
  const relevantHoldings = mutualFundHoldings.filter(h => h.stockId === stockId);
  
  for (const holding of relevantHoldings) {
    const fund = mutualFunds.find(f => f.id === holding.fundId);
    
    if (fund) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          holding: {
            stock: stock.name,
            percentage: holding.percentage
          }
        },
        matchScore: holding.percentage / 10, // Higher percentage = higher score
        explanation: `This fund holds ${holding.percentage}% in ${stock.name}`
      });
    }
  }
  
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

function searchFundsBySector(sector: string): SearchResult[] {
  const results: SearchResult[] = [];
  const sectorMap: Record<string, string[]> = {
    'tech': ['Technology', 'Information Technology'],
    'technology': ['Technology', 'Information Technology'],
    'financial': ['Financial Services'],
    'banking': ['Financial Services'],
    'infrastructure': ['Infrastructure'],
    'infra': ['Infrastructure']
  };
  
  const sectorTerms = sectorMap[sector] || [sector];
  
  // Match funds by their category/subcategory
  for (const fund of mutualFunds) {
    let isMatch = false;
    for (const term of sectorTerms) {
      if (
        (fund.category && fund.category.toLowerCase().includes(term.toLowerCase())) ||
        (fund.subCategory && fund.subCategory.toLowerCase().includes(term.toLowerCase()))
      ) {
        isMatch = true;
        break;
      }
    }
    
    if (isMatch) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          subCategory: fund.subCategory
        },
        matchScore: 0.85,
        explanation: `Fund focused on the ${fund.subCategory || fund.category} sector`
      });
    }
  }
  
  // Also look for funds that have holdings in stocks of that sector
  const sectorStocks = stocks.filter(stock => {
    return sectorTerms.some(term => 
      (stock.sector && stock.sector.toLowerCase().includes(term.toLowerCase())) ||
      (stock.industry && stock.industry.toLowerCase().includes(term.toLowerCase()))
    );
  });
  
  if (sectorStocks.length > 0) {
    const stockIds = sectorStocks.map(stock => stock.id);
    const relevantHoldings = mutualFundHoldings.filter(h => stockIds.includes(h.stockId));
    
    for (const holding of relevantHoldings) {
      const fund = mutualFunds.find(f => f.id === holding.fundId);
      const stock = stocks.find(s => s.id === holding.stockId);
      
      if (fund && stock && !results.some(r => r.id === fund.id)) {
        results.push({
          id: fund.id,
          name: fund.name,
          type: 'mutual_fund',
          metadata: {
            fundHouse: fund.fundHouse,
            category: fund.category,
            sectorExposure: {
              stock: stock.name,
              sector: stock.sector,
              percentage: holding.percentage
            }
          },
          matchScore: 0.7,
          explanation: `Fund has ${holding.percentage}% exposure to ${stock.sector} sector through ${stock.name}`
        });
      }
    }
  }
  
  return results;
}

function generateNoResultsResponse(query: string): SearchResult[] {
  return [{
    id: 'no-result',
    name: 'No matching funds or stocks found',
    type: 'mutual_fund',
    metadata: {},
    matchScore: 0,
    explanation: `We couldn't find any securities matching "${query}". Try a different search term.`
  }];
}

// Future integration with actual small language model
export async function integrateSLM(query: string): Promise<string> {
  // This would be replaced with actual SLM integration
  return `This is where we would integrate with a compact language model (≤7B params) to process the query: "${query}"`;
}
