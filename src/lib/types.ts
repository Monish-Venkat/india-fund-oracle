
export interface MutualFund {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  assetClass?: string;
  aum?: number; // Assets Under Management in crores
  returns?: {
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  isTaxSaving?: boolean;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
}

export interface MutualFundHolding {
  fundId: string;
  stockId: string;
  percentage: number;
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'mutual_fund' | 'stock';
  metadata: Record<string, any>;
  matchScore: number;
  explanation: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}
