"use client";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: "buy" | "sell" | "target" | "neutral";
  subtitle?: string;
}

export default function MetricCard({
  label,
  value,
  trend = "neutral",
  subtitle,
}: MetricCardProps) {
  const trendColors = {
    buy: "border-green-500/30 bg-green-500/5",
    sell: "border-red-500/30 bg-red-500/5",
    target: "border-blue-500/30 bg-blue-500/5",
    neutral: "border-slate-700 bg-slate-800/50",
  };

  const labelColors = {
    buy: "text-green-400",
    sell: "text-red-400",
    target: "text-blue-400",
    neutral: "text-slate-400",
  };

  const valueColors = {
    buy: "text-green-300",
    sell: "text-red-300",
    target: "text-blue-300",
    neutral: "text-white",
  };

  const icons = {
    buy: "📈",
    sell: "🛡️",
    target: "🎯",
    neutral: "💰",
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:scale-105 ${trendColors[trend]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm font-medium ${labelColors[trend]}`}>{label}</p>
        <span className="text-xl">{icons[trend]}</span>
      </div>
      <p className={`text-2xl font-bold ${valueColors[trend]}`}>{value}</p>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
