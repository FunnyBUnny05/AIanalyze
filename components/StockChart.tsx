"use client";

import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
} from "recharts";
import { StockDataPoint } from "@/services/mockStockData";

interface StockChartProps {
  data: StockDataPoint[];
  entryPoint?: number;
  stopLoss?: number;
  targetPrice?: number;
  primarySupport?: number;
  primaryResistance?: number;
}

// Custom Candlestick component
const Candlestick = (props: any) => {
  const { x, y, width, height, open, close, high, low, index } = props;

  const isGreen = close > open;
  const color = isGreen ? "#10b981" : "#ef4444";
  const wickX = x + width / 2;

  // Calculate candlestick body
  const bodyHeight = Math.abs(y - (y + height));
  const bodyY = isGreen ? y : y;

  return (
    <g>
      {/* Wick (high-low line) */}
      <line
        x1={wickX}
        y1={props.payload.highY}
        x2={wickX}
        y2={props.payload.lowY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Candle body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight || 1}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export default function StockChart({
  data,
  entryPoint,
  stopLoss,
  targetPrice,
  primarySupport,
  primaryResistance,
}: StockChartProps) {
  // Sample every nth point for better performance with 1 year of data
  const sampleRate = Math.ceil(data.length / 100); // Show ~100 candles
  const sampledData = data.filter((_, index) => index % sampleRate === 0);

  // Format data for recharts with calculated Y positions
  const chartData = sampledData.map((point) => {
    const body = Math.abs(point.close - point.open);

    return {
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
      // For candlestick rendering
      wickTop: point.high,
      wickBottom: point.low,
      bodyTop: Math.max(point.open, point.close),
      bodyBottom: Math.min(point.open, point.close),
    };
  });

  // Calculate price range for Y-axis
  const allPrices = data.flatMap((d) => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isGreen = data.close > data.open;

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
          <p className="text-slate-400 mb-2">{data.date}</p>
          <div className="space-y-1">
            <p className="text-slate-300">
              <span className="text-slate-500">Open:</span> ${data.open.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">High:</span> ${data.high.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">Low:</span> ${data.low.toFixed(2)}
            </p>
            <p className={isGreen ? "text-green-400" : "text-red-400"}>
              <span className="text-slate-500">Close:</span> ${data.close.toFixed(2)}
            </p>
            <p className="text-slate-300 text-[10px] pt-1 border-t border-slate-700">
              Vol: {(data.volume / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 60, bottom: 20, left: 10 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />

          <XAxis
            dataKey="date"
            stroke="#64748b"
            style={{ fontSize: "11px" }}
            interval="preserveStartEnd"
            minTickGap={50}
          />

          <YAxis
            stroke="#64748b"
            style={{ fontSize: "11px" }}
            domain={[minPrice - padding, maxPrice + padding]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            orientation="right"
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Technical Analysis Lines */}
          {targetPrice && (
            <ReferenceLine
              y={targetPrice}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `🎯 Target: $${targetPrice.toFixed(2)}`,
                position: "right",
                fill: "#10b981",
                fontSize: 12,
              }}
            />
          )}

          {primaryResistance && (
            <ReferenceLine
              y={primaryResistance}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: `Resistance: $${primaryResistance.toFixed(2)}`,
                position: "right",
                fill: "#f59e0b",
                fontSize: 11,
              }}
            />
          )}

          {entryPoint && (
            <ReferenceLine
              y={entryPoint}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `📈 Entry: $${entryPoint.toFixed(2)}`,
                position: "right",
                fill: "#3b82f6",
                fontSize: 12,
              }}
            />
          )}

          {primarySupport && (
            <ReferenceLine
              y={primarySupport}
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: `Support: $${primarySupport.toFixed(2)}`,
                position: "right",
                fill: "#f59e0b",
                fontSize: 11,
              }}
            />
          )}

          {stopLoss && (
            <ReferenceLine
              y={stopLoss}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `🛡️ Stop Loss: $${stopLoss.toFixed(2)}`,
                position: "right",
                fill: "#ef4444",
                fontSize: 12,
              }}
            />
          )}

          {/* Render candlesticks using Bar chart */}
          <Bar
            dataKey="bodyTop"
            fill="#10b981"
            shape={(props: any) => {
              const { x, y, width, payload, index } = props;
              const { open, close, high, low, bodyTop, bodyBottom } = payload;
              const isGreen = close > open;
              const color = isGreen ? "#10b981" : "#ef4444";

              // Calculate positions
              const wickX = x + width / 2;

              // Get Y scale from chart
              const yScale = props.yAxis?.scale;
              if (!yScale) return <g />;

              const highY = yScale(high);
              const lowY = yScale(low);
              const topY = yScale(bodyTop);
              const bottomY = yScale(bodyBottom);

              return (
                <g key={`candle-${index}`}>
                  {/* High-Low wick */}
                  <line
                    x1={wickX}
                    y1={highY}
                    x2={wickX}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={1}
                  />
                  {/* Open-Close body */}
                  <rect
                    x={x + width * 0.2}
                    y={topY}
                    width={width * 0.6}
                    height={Math.max(Math.abs(bottomY - topY), 1)}
                    fill={color}
                    stroke={color}
                    strokeWidth={1}
                  />
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

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
    </div>
  );
}
