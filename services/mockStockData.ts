export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockAnalysis {
  ticker: string;
  currentPrice: number;
  entryPoint: number;
  stopLoss: number;
  targetPrice: number;
  primarySupport: number;
  primaryResistance: number;
  analysis: string;
  historicalData: StockDataPoint[];
}

/**
 * Mock stock data service - simulates Perplexity API response
 * This will be replaced with real API calls in Phase 2
 */
export async function getMockStockData(ticker: string): Promise<StockAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock OHLC data for 1 year (365 days)
  const historicalData: StockDataPoint[] = [];
  const basePrice = Math.random() * 200 + 50; // Random base price between 50-250

  let previousClose = basePrice;
  let trend = Math.random() > 0.5 ? 1 : -1; // Start with upward or downward trend

  for (let i = 365; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    // Occasionally reverse trend (every 20-40 days)
    if (Math.random() > 0.95) {
      trend *= -1;
    }

    // Generate OHLC with realistic movement
    const trendMove = trend * (Math.random() * 2); // Trend movement
    const volatility = (Math.random() - 0.5) * 4; // Daily volatility

    const open = previousClose;
    const close = parseFloat((open + trendMove + volatility).toFixed(2));

    // High and Low based on open and close
    const high = parseFloat((Math.max(open, close) * (1 + Math.random() * 0.02)).toFixed(2));
    const low = parseFloat((Math.min(open, close) * (1 - Math.random() * 0.02)).toFixed(2));

    const volume = Math.floor(Math.random() * 15000000) + 5000000;

    historicalData.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });

    previousClose = close;
  }

  const currentPrice = historicalData[historicalData.length - 1].close;

  // Calculate support and resistance from price history
  const prices = historicalData.map(d => d.close);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;

  const primarySupport = parseFloat((currentPrice - priceRange * 0.15).toFixed(2));
  const primaryResistance = parseFloat((currentPrice + priceRange * 0.12).toFixed(2));
  const entryPoint = parseFloat((currentPrice * 0.98).toFixed(2));
  const stopLoss = parseFloat((primarySupport * 0.98).toFixed(2));
  const targetPrice = parseFloat((primaryResistance * 1.02).toFixed(2));

  return {
    ticker: ticker.toUpperCase(),
    currentPrice,
    entryPoint,
    stopLoss,
    targetPrice,
    primarySupport,
    primaryResistance,
    analysis: `
**Technical Analysis for ${ticker.toUpperCase()}**

Based on 1-year market data and technical indicators, here's my comprehensive analysis:

**Price Action:**
The stock is currently trading at $${currentPrice.toFixed(2)}, showing a ${trend > 0 ? 'bullish' : 'consolidation'} pattern. The price has established a clear range between $${minPrice.toFixed(2)} and $${maxPrice.toFixed(2)} over the past year, with strong institutional interest at key levels.

**Key Indicators:**
• RSI (14): Currently at ${Math.floor(45 + Math.random() * 20)}, indicating ${trend > 0 ? 'bullish' : 'neutral'} momentum
• MACD: Showing a ${trend > 0 ? 'bullish' : 'neutral'} signal on the daily chart
• Volume Profile: ${trend > 0 ? 'Above' : 'Normal'}-average volume suggests ${trend > 0 ? 'accumulation' : 'consolidation'}
• Moving Averages: Price ${currentPrice > basePrice ? 'above' : 'testing'} key EMAs

**Support & Resistance:**
• Primary Support: $${primarySupport.toFixed(2)} - Strong buying zone
• Stop Loss Level: $${stopLoss.toFixed(2)} - Risk management point
• Entry Point: $${entryPoint.toFixed(2)} - Optimal entry on pullback
• Primary Resistance: $${primaryResistance.toFixed(2)} - First profit target
• Extended Target: $${targetPrice.toFixed(2)} - Final profit target

**Trade Setup:**
This presents a favorable risk/reward ratio of approximately ${((targetPrice - entryPoint) / (entryPoint - stopLoss)).toFixed(1)}:1. The current price action suggests a ${trend > 0 ? 'continuation pattern' : 'potential reversal setup'}.

**Risk Management:**
Position size should be calculated based on the distance to stop loss. Never risk more than 1-2% of portfolio capital on any single trade. Consider scaling in at entry point and adding on strength above resistance.
    `.trim(),
    historicalData,
  };
}
