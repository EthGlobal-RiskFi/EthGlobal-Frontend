// src/components/RiskMetricsHexagon.jsx
"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RiskMetricsHexagon({ data }) {
  // -------- formatters --------
  const formatPercent = (n) => `${(Number(n) || 0).toFixed(2)}%`;
  const formatUSD = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  // -------- chart data (0–100) --------
  const chartData = [
    {
      metric: "Portfolio VaR",
      value: clamp01(data?.portfolio_var_99_percent),
      tooltip: `99% Value at Risk: ${formatPercent(data?.portfolio_var_99_percent)}`,
    },
    {
      metric: "Sharpe Ratio",
      // crude scale: 0–2 → 0–100 (cap)
      value: clamp01((Number(data?.sharpe_ratio) || 0) * 50),
      tooltip: `Risk-adjusted return: ${(Number(data?.sharpe_ratio) || 0).toFixed(2)}`,
    },
    {
      metric: "Volatility",
      value: clamp01((Number(data?.volatility) || 0) * 100),
      tooltip: `30-day volatility: ${formatPercent((Number(data?.volatility) || 0) * 100)}`,
    },
    {
      metric: "PnL %",
      value: clamp01(Number(data?.pnl_percent) || 0),
      tooltip: `Profit/Loss: ${formatPercent(Number(data?.pnl_percent) || 0)}`,
    },
    {
      metric: "Concentration",
      value: clamp01((Number(data?.concentration_hhi) || 0) * 100),
      tooltip: `Portfolio concentration: ${formatPercent((Number(data?.concentration_hhi) || 0) * 100)}`,
    },
    {
      metric: "Value USD",
      // relative scale to 2M just to visualize (cap)
      value: clamp01(((Number(data?.total_value_usd) || 0) / 2_000_000) * 100),
      tooltip: `Total value: ${formatUSD(Number(data?.total_value_usd) || 0)}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.002 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full h-[400px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-text-100)]">
          Risk Metrics
        </h3>
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-400)]">
          <LegendDot color="#22c55e" label="Low" />
          <LegendDot color="#eab308" label="Medium" />
          <LegendDot color="#ef4444" label="High" />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 6, right: 24, bottom: 6, left: 24 }}>
          {/* gradient fill to match theme */}
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-grad-2)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-grad-1)" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* softer polygon grid + rings */}
          <PolarGrid
            gridType="polygon"
            stroke="rgba(255,255,255,0.16)"
            radialLines={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            stroke="rgba(255,255,255,0.12)"
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "white", fontSize: 12, fontWeight: 600 }}
          />

          <Radar
            name="Risk Metrics"
            dataKey="value"
            stroke="var(--color-grad-2)"
            strokeWidth={2}
            fill="url(#riskFill)"
            isAnimationActive
            dot={{ r: 2 }}
            activeDot={{ r: 3 }}
          />

          {/* glassy tooltip */}
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.25)", strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-[rgba(17,24,39,0.9)] text-white border border-white/10 rounded-lg shadow-lg p-2 text-xs">
                    <div className="font-semibold">{d.metric}</div>
                    <div className="opacity-90">{d.tooltip}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ---------- utils ---------- */
function clamp01(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-white">{label}</span>
    </span>
  );
}
