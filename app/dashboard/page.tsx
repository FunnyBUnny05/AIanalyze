"use client";

import { useState } from "react";
import { getMockStockData, StockAnalysis } from "@/services/mockStockData";
import StockChart from "@/components/StockChart";
import AnalysisCard from "@/components/AnalysisCard";
import MetricCard from "@/components/MetricCard";

export default function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const data = await getMockStockData(ticker);
      setAnalysis(data);
    } catch (err) {
      setError("Failed to fetch stock data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">AI Stock Analyzer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Technical analysis powered by AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter stock ticker (e.g., AAPL, TSLA, NVDA)"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-slate-400">Analyzing {ticker}...</p>
          </div>
        )}

        {/* Results */}
        {!loading && analysis && (
          <div className="space-y-6">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                label="Current Price"
                value={`$${analysis.currentPrice}`}
                trend="neutral"
              />
              <MetricCard
                label="Entry Point"
                value={`$${analysis.entryPoint}`}
                trend="buy"
                subtitle="Recommended entry"
              />
              <MetricCard
                label="Stop Loss"
                value={`$${analysis.stopLoss}`}
                trend="sell"
                subtitle="Risk management"
              />
              <MetricCard
                label="Target Price"
                value={`$${analysis.targetPrice}`}
                trend="target"
                subtitle={`+${(((analysis.targetPrice - analysis.currentPrice) / analysis.currentPrice) * 100).toFixed(1)}% upside`}
              />
            </div>

            {/* Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Price Chart - {analysis.ticker}
              </h2>
              <StockChart data={analysis.historicalData} />
            </div>

            {/* AI Analysis */}
            <AnalysisCard analysis={analysis.analysis} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysis && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start Your Analysis
            </h2>
            <p className="text-slate-400">
              Enter a stock ticker above to begin technical analysis
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
