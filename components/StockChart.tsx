"use client";

import { useEffect, useRef, useState } from "react";
import { StockDataPoint } from "@/services/mockStockData";

interface StockChartProps {
  data: StockDataPoint[];
  entryPoint?: number;
  stopLoss?: number;
  targetPrice?: number;
  primarySupport?: number;
  primaryResistance?: number;
}

export default function StockChart({
  data,
  entryPoint,
  stopLoss,
  targetPrice,
  primarySupport,
  primaryResistance,
}: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !chartContainerRef.current || typeof window === 'undefined') return;
    if (data.length === 0) return;

    // Wait for container to have dimensions
    const container = chartContainerRef.current;
    if (container.clientWidth === 0) {
      console.log('Container has no width, waiting...');
      setTimeout(() => setChartReady(true), 100);
      return;
    }

    // Dynamically import lightweight-charts only on client
    import('lightweight-charts')
      .then(({ createChart, ColorType, CrosshairMode }) => {
        if (!chartContainerRef.current) return;

        // Clean up existing chart
        if (chartInstanceRef.current) {
          chartInstanceRef.current.remove();
          chartInstanceRef.current = null;
        }

        console.log('Creating chart with', data.length, 'data points');

        // Create chart
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: "#0f172a" },
            textColor: "#94a3b8",
          },
          grid: {
            vertLines: { color: "#1e293b" },
            horzLines: { color: "#1e293b" },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: "#475569",
              width: 1,
              style: 1,
              labelBackgroundColor: "#3b82f6",
            },
            horzLine: {
              color: "#475569",
              width: 1,
              style: 1,
              labelBackgroundColor: "#3b82f6",
            },
          },
          rightPriceScale: {
            borderColor: "#334155",
            scaleMargins: {
              top: 0.1,
              bottom: 0.2,
            },
          },
          timeScale: {
            borderColor: "#334155",
            timeVisible: true,
            secondsVisible: false,
          },
          width: chartContainerRef.current.clientWidth,
          height: 500,
        });

        chartInstanceRef.current = chart;

        // Add candlestick series
        const candlestickSeries = (chart as any).addCandlestickSeries({
          upColor: "#10b981",
          downColor: "#ef4444",
          borderUpColor: "#10b981",
          borderDownColor: "#ef4444",
          wickUpColor: "#10b981",
          wickDownColor: "#ef4444",
        });

        // Format data for lightweight-charts
        const formattedData = data.map((point) => ({
          time: point.date,
          open: point.open,
          high: point.high,
          low: point.low,
          close: point.close,
        }));

        console.log('Setting chart data:', formattedData.length, 'candles');
        console.log('First data point:', formattedData[0]);
        console.log('Last data point:', formattedData[formattedData.length - 1]);

        candlestickSeries.setData(formattedData);

        // Add price lines for technical analysis
        if (targetPrice) {
          candlestickSeries.createPriceLine({
            price: targetPrice,
            color: "#10b981",
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "🎯 Target",
          });
        }

        if (primaryResistance) {
          candlestickSeries.createPriceLine({
            price: primaryResistance,
            color: "#f59e0b",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "Resistance",
          });
        }

        if (entryPoint) {
          candlestickSeries.createPriceLine({
            price: entryPoint,
            color: "#3b82f6",
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "📈 Entry",
          });
        }

        if (primarySupport) {
          candlestickSeries.createPriceLine({
            price: primarySupport,
            color: "#f59e0b",
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "Support",
          });
        }

        if (stopLoss) {
          candlestickSeries.createPriceLine({
            price: stopLoss,
            color: "#ef4444",
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "🛡️ Stop Loss",
          });
        }

        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current && chartInstanceRef.current) {
            chartInstanceRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener("resize", handleResize);

        // Fit content
        chart.timeScale().fitContent();

        console.log('Chart created successfully');
        setChartReady(true);
      })
      .catch((error) => {
        console.error('Failed to load chart:', error);
      });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [isMounted, data, entryPoint, stopLoss, targetPrice, primarySupport, primaryResistance]);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-slate-800 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={chartContainerRef}
        className="w-full rounded-lg overflow-hidden bg-slate-800"
        style={{ height: '500px', minHeight: '500px' }}
      />

      {/* Debug info */}
      <div className="text-xs text-slate-600 mt-2">
        Data points: {data.length} | Chart ready: {chartReady ? 'Yes' : 'No'}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>Bullish Candle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span>Bearish Candle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-500"></div>
          <span>Entry Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-amber-500"></div>
          <span>Support/Resistance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-green-500"></div>
          <span>Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-500"></div>
          <span>Stop Loss</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-slate-500 mt-3">
        💡 Hover over candles for details • Drag to pan • Scroll to zoom • Double-click to reset
      </p>
    </div>
  );
}
