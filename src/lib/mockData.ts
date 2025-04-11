
import { MutualFund, Stock, MutualFundHolding } from './types';

export const mutualFunds: MutualFund[] = [
  {
    id: "mf1",
    name: "ICICI Prudential Infrastructure Fund",
    fundHouse: "ICICI Prudential",
    category: "Equity",
    subCategory: "Infrastructure",
    assetClass: "Equity",
    aum: 1500,
    returns: {
      oneYear: 12.5,
      threeYear: 15.3,
      fiveYear: 10.8
    }
  },
  {
    id: "mf2",
    name: "SBI Technology Opportunities Fund",
    fundHouse: "SBI Mutual Fund",
    category: "Equity",
    subCategory: "Technology",
    assetClass: "Equity",
    aum: 850,
    returns: {
      oneYear: 18.7,
      threeYear: 22.1,
      fiveYear: 19.3
    }
  },
  {
    id: "mf3",
    name: "HDFC Tax Saver Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subCategory: "ELSS",
    assetClass: "Equity",
    aum: 2200,
    isTaxSaving: true,
    returns: {
      oneYear: 14.2,
      threeYear: 16.8,
      fiveYear: 12.5
    }
  },
  {
    id: "mf4",
    name: "Axis Long Term Equity Fund",
    fundHouse: "Axis Mutual Fund",
    category: "Equity",
    subCategory: "ELSS",
    assetClass: "Equity",
    aum: 2800,
    isTaxSaving: true,
    returns: {
      oneYear: 15.7,
      threeYear: 17.2,
      fiveYear: 13.1
    }
  },
  {
    id: "mf5",
    name: "Aditya Birla Sun Life Digital India Fund",
    fundHouse: "Aditya Birla Sun Life",
    category: "Equity",
    subCategory: "Technology",
    assetClass: "Equity",
    aum: 1200,
    returns: {
      oneYear: 17.9,
      threeYear: 23.5,
      fiveYear: 21.2
    }
  },
  {
    id: "mf6",
    name: "Mirae Asset Large Cap Fund",
    fundHouse: "Mirae Asset",
    category: "Equity",
    subCategory: "Large Cap",
    assetClass: "Equity",
    aum: 3100,
    returns: {
      oneYear: 13.1,
      threeYear: 15.9,
      fiveYear: 12.8
    }
  },
  {
    id: "mf7",
    name: "Nippon India Small Cap Fund",
    fundHouse: "Nippon India",
    category: "Equity",
    subCategory: "Small Cap",
    assetClass: "Equity",
    aum: 2400,
    returns: {
      oneYear: 19.8,
      threeYear: 24.7,
      fiveYear: 18.3
    }
  },
  {
    id: "mf8",
    name: "Franklin India Technology Fund",
    fundHouse: "Franklin Templeton",
    category: "Equity",
    subCategory: "Technology",
    assetClass: "Equity",
    aum: 780,
    returns: {
      oneYear: 16.5,
      threeYear: 21.8,
      fiveYear: 18.7
    }
  },
  {
    id: "mf9",
    name: "HDFC Mid-Cap Opportunities Fund",
    fundHouse: "HDFC Mutual Fund",
    category: "Equity",
    subCategory: "Mid Cap",
    assetClass: "Equity",
    aum: 2900,
    returns: {
      oneYear: 17.2,
      threeYear: 19.5,
      fiveYear: 14.8
    }
  },
  {
    id: "mf10",
    name: "DSP Tax Saver Fund",
    fundHouse: "DSP Mutual Fund",
    category: "Equity",
    subCategory: "ELSS",
    assetClass: "Equity",
    aum: 1800,
    isTaxSaving: true,
    returns: {
      oneYear: 15.1,
      threeYear: 17.4,
      fiveYear: 12.9
    }
  }
];

export const stocks: Stock[] = [
  {
    id: "s1",
    name: "HDFC Bank Ltd",
    symbol: "HDFCBANK",
    sector: "Financial Services",
    industry: "Banking",
    marketCap: 850000
  },
  {
    id: "s2",
    name: "Tata Consultancy Services Ltd",
    symbol: "TCS",
    sector: "Information Technology",
    industry: "IT Services",
    marketCap: 1200000
  },
  {
    id: "s3",
    name: "Reliance Industries Ltd",
    symbol: "RELIANCE",
    sector: "Oil & Gas",
    industry: "Refineries",
    marketCap: 1500000
  },
  {
    id: "s4",
    name: "Infosys Ltd",
    symbol: "INFY",
    sector: "Information Technology",
    industry: "IT Services",
    marketCap: 650000
  },
  {
    id: "s5",
    name: "ICICI Bank Ltd",
    symbol: "ICICIBANK",
    sector: "Financial Services",
    industry: "Banking",
    marketCap: 550000
  }
];

export const mutualFundHoldings: MutualFundHolding[] = [
  { fundId: "mf1", stockId: "s3", percentage: 8.5 },
  { fundId: "mf1", stockId: "s5", percentage: 7.2 },
  { fundId: "mf2", stockId: "s2", percentage: 12.3 },
  { fundId: "mf2", stockId: "s4", percentage: 10.8 },
  { fundId: "mf3", stockId: "s1", percentage: 9.5 },
  { fundId: "mf3", stockId: "s3", percentage: 7.8 },
  { fundId: "mf4", stockId: "s1", percentage: 8.7 },
  { fundId: "mf4", stockId: "s5", percentage: 7.1 },
  { fundId: "mf5", stockId: "s2", percentage: 14.2 },
  { fundId: "mf5", stockId: "s4", percentage: 12.5 },
  { fundId: "mf6", stockId: "s1", percentage: 11.3 },
  { fundId: "mf6", stockId: "s3", percentage: 8.9 },
  { fundId: "mf7", stockId: "s5", percentage: 5.2 },
  { fundId: "mf8", stockId: "s2", percentage: 15.7 },
  { fundId: "mf8", stockId: "s4", percentage: 13.8 },
  { fundId: "mf9", stockId: "s1", percentage: 8.3 },
  { fundId: "mf9", stockId: "s3", percentage: 6.9 },
  { fundId: "mf10", stockId: "s5", percentage: 7.5 }
];
