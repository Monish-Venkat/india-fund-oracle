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
  
  // Handle financial advice questions
  if (lowerQuery.includes('retirement') || lowerQuery.includes('pension')) {
    return searchRetirementFunds();
  }

  if (lowerQuery.includes('dividend') || lowerQuery.includes('yield')) {
    return searchDividendStocks();
  }

  if (lowerQuery.includes('expense ratio') || lowerQuery.includes('fee') || lowerQuery.includes('cheap')) {
    return searchLowExpenseFunds();
  }

  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
    return compareFunds(query);
  }
  
  // Existing patterns
  if (lowerQuery.includes('tax') || lowerQuery.includes('elss')) {
    return searchTaxSavingFunds();
  }
  
  if (lowerQuery.includes('high return') || lowerQuery.includes('best performing')) {
    return searchHighReturnFunds();
  }

  if (lowerQuery.includes('safe') || lowerQuery.includes('low risk') || lowerQuery.includes('stable')) {
    return searchLowRiskFunds();
  }

  if (lowerQuery.includes('large cap') || lowerQuery.includes('largecap')) {
    return searchFundsByCategory('Large Cap');
  }

  if (lowerQuery.includes('mid cap') || lowerQuery.includes('midcap')) {
    return searchFundsByCategory('Mid Cap');
  }

  if (lowerQuery.includes('small cap') || lowerQuery.includes('smallcap')) {
    return searchFundsByCategory('Small Cap');
  }

  if (lowerQuery.includes('debt') || lowerQuery.includes('bond')) {
    return searchFundsByCategory('Debt');
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
    const sectors = ['technology', 'tech', 'financial', 'banking', 'infrastructure', 'infra', 
                     'pharmaceutical', 'pharma', 'healthcare', 'consumer', 'energy', 'it', 'auto'];
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
    'infra': ['Infrastructure'],
    'pharmaceutical': ['Pharmaceutical', 'Healthcare'],
    'pharma': ['Pharmaceutical', 'Healthcare'],
    'healthcare': ['Pharmaceutical', 'Healthcare'],
    'consumer': ['Consumer'],
    'energy': ['Energy'],
    'it': ['Information Technology'],
    'auto': ['Automobile']
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

function searchRetirementFunds(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Find funds suitable for retirement (typically debt funds, balanced funds, and some equity funds)
  const retirementCategories = ['Debt', 'Hybrid', 'Conservative Hybrid', 'Balanced Advantage'];
  
  for (const fund of mutualFunds) {
    let isMatch = false;
    
    // Check if the fund category is suitable for retirement
    if (retirementCategories.some(category => fund.category?.includes(category) || fund.subCategory?.includes(category))) {
      isMatch = true;
    }
    
    // Check for funds with retirement or pension in their name
    if (fund.name.toLowerCase().includes('pension') || fund.name.toLowerCase().includes('retirement')) {
      isMatch = true;
    }
    
    if (isMatch) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          returns: fund.returns
        },
        matchScore: 0.9,
        explanation: 'Suggested for retirement planning based on fund category and risk profile'
      });
    }
  }
  
  return results.length > 0 ? results : generateNoResultsResponse("retirement funds");
}

function searchDividendStocks(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // In a real implementation, we would filter stocks with dividend yields
  // For this mock, we'll select a few stocks that typically pay dividends
  for (const stock of stocks) {
    // Simulate checking for dividend-paying stocks (in financial services, energy, utilities)
    if (stock.sector === 'Financial Services' || stock.sector === 'Energy' || stock.industry === 'Utilities') {
      results.push({
        id: stock.id,
        name: stock.name,
        type: 'stock',
        metadata: {
          symbol: stock.symbol,
          sector: stock.sector,
          industry: stock.industry,
          dividendYield: Math.random() * 5 + 1 // Mock dividend yield between 1% and 6%
        },
        matchScore: 0.85,
        explanation: `Dividend-paying stock in the ${stock.sector} sector`
      });
    }
  }
  
  return results.length > 0 ? results.sort((a, b) => (b.metadata.dividendYield || 0) - (a.metadata.dividendYield || 0)) : generateNoResultsResponse("dividend stocks");
}

function searchLowExpenseFunds(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Simulate funds with low expense ratios
  for (const fund of mutualFunds) {
    // Generate a mock expense ratio between 0.1% and 2.5%
    const expenseRatio = fund.category?.includes('Index') ? 
                        Math.random() * 0.5 + 0.1 : 
                        Math.random() * 1.5 + 0.5;
    
    if (expenseRatio < 1.2) { // Consider funds with expense ratio < 1.2% as low expense
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          expenseRatio: parseFloat(expenseRatio.toFixed(2)),
          returns: fund.returns
        },
        matchScore: 1 - (expenseRatio / 2.5), // Higher score for lower expense ratio
        explanation: `Low expense ratio of ${expenseRatio.toFixed(2)}%`
      });
    }
  }
  
  return results.length > 0 ? 
    results.sort((a, b) => (a.metadata.expenseRatio || 0) - (b.metadata.expenseRatio || 0)) : 
    generateNoResultsResponse("low expense funds");
}

function compareFunds(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Extract fund houses to compare
  const fundHouses: string[] = [];
  
  // Check for major fund houses
  const majorFundHouses = ['hdfc', 'sbi', 'icici', 'axis', 'kotak', 'reliance', 'nippon', 'tata', 'aditya birla', 'dsp', 'uti', 'idfc'];
  
  for (const house of majorFundHouses) {
    if (lowerQuery.includes(house)) {
      fundHouses.push(house);
    }
  }
  
  // If we found at least two fund houses to compare
  if (fundHouses.length >= 2) {
    // Get top funds from each fund house
    for (const house of fundHouses) {
      const houseFunds = mutualFunds
        .filter(fund => fund.fundHouse.toLowerCase().includes(house))
        .sort((a, b) => (b.returns?.threeYear || 0) - (a.returns?.threeYear || 0))
        .slice(0, 3); // Get top 3 funds
        
      for (const fund of houseFunds) {
        results.push({
          id: fund.id,
          name: fund.name,
          type: 'mutual_fund',
          metadata: {
            fundHouse: fund.fundHouse,
            category: fund.category,
            returns: fund.returns,
            forComparison: true
          },
          matchScore: 0.9,
          explanation: `Top performing fund from ${fund.fundHouse} for comparison`
        });
      }
    }
  }
  
  return results.length > 0 ? results : generateNoResultsResponse(`comparing funds`);
}

function searchFundsByCategory(category: string): SearchResult[] {
  const results: SearchResult[] = [];
  
  for (const fund of mutualFunds) {
    if (fund.category?.includes(category) || fund.subCategory?.includes(category)) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          subCategory: fund.subCategory,
          returns: fund.returns
        },
        matchScore: 0.9,
        explanation: `${category} fund matching your criteria`
      });
    }
  }
  
  return results.length > 0 ? 
    results.sort((a, b) => (b.metadata.returns?.threeYear || 0) - (a.metadata.returns?.threeYear || 0)) : 
    generateNoResultsResponse(category + " funds");
}

function searchLowRiskFunds(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Low risk typically includes debt funds, liquid funds, and some hybrid funds
  const lowRiskCategories = ['Debt', 'Liquid', 'Ultra Short Duration', 'Low Duration', 'Money Market', 'Overnight'];
  
  for (const fund of mutualFunds) {
    if (
      lowRiskCategories.some(category => 
        fund.category?.includes(category) || 
        fund.subCategory?.includes(category)
      )
    ) {
      results.push({
        id: fund.id,
        name: fund.name,
        type: 'mutual_fund',
        metadata: {
          fundHouse: fund.fundHouse,
          category: fund.category,
          riskRating: 'Low',
          returns: fund.returns
        },
        matchScore: 0.9,
        explanation: 'Low-risk fund suitable for capital preservation'
      });
    }
  }
  
  return results.length > 0 ? results : generateNoResultsResponse("low risk funds");
}

export async function integrateSLM(query: string): Promise<string> {
  // This would be replaced with actual SLM integration
  return `This is where we would integrate with a compact language model (≤7B params) to process the query: "${query}"`;
}
