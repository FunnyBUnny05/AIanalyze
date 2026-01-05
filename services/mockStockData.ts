export interface StockDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface StockAnalysis {
  ticker: string;
  currentPrice: number;
  entryPoint: number;
  stopLoss: number;
  targetPrice: number;
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

  // Generate mock price data for the last 30 days
  const historicalData: StockDataPoint[] = [];
  const basePrice = Math.random() * 200 + 50; // Random base price between 50-250

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const volatility = Math.random() * 10 - 5; // +/- 5%
    const price = basePrice + volatility;
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    historicalData.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume,
    });
  }

  const currentPrice = historicalData[historicalData.length - 1].price;

  return {
    ticker: ticker.toUpperCase(),
    currentPrice,
    entryPoint: parseFloat((currentPrice * 0.97).toFixed(2)), // 3% below current
    stopLoss: parseFloat((currentPrice * 0.92).toFixed(2)), // 8% below current
    targetPrice: parseFloat((currentPrice * 1.15).toFixed(2)), // 15% above current
    analysis: `
**Technical Analysis for ${ticker.toUpperCase()}**

Based on the current market data and technical indicators, here's my comprehensive analysis:

**Price Action:**
The stock is currently trading at $${currentPrice}, showing a consolidation pattern near recent highs. The price has been respecting key support and resistance levels, indicating strong institutional interest.

**Key Indicators:**
• RSI (14): Currently at 58, indicating neutral to slightly bullish momentum
• MACD: Showing a bullish crossover on the daily chart
• Volume Profile: Above-average volume on recent green candles suggests accumulation
• Moving Averages: Price trading above 20-day and 50-day EMAs (bullish signal)

**Support & Resistance:**
• Primary Support: $${(currentPrice * 0.95).toFixed(2)}
• Secondary Support: $${(currentPrice * 0.92).toFixed(2)}
• Primary Resistance: $${(currentPrice * 1.08).toFixed(2)}
• Secondary Resistance: $${(currentPrice * 1.15).toFixed(2)}

**Trade Setup:**
This presents a favorable risk/reward setup with a potential 15%+ upside. The consolidation pattern suggests we're building a base for the next leg up.

**Risk Management:**
Always use proper position sizing and never risk more than 2% of your portfolio on a single trade. Market conditions can change rapidly.
    `.trim(),
    historicalData,
  };
}
