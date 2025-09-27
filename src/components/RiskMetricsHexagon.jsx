"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RiskMetricsHexagon({ data }) {
  // Format functions
  const formatPercent = (n) => `${n.toFixed(2)}%`;
  const formatUSD = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  // Risk level colors
  const getRiskColor = (value) => {
    if (value <= 30) return "#22c55e"; // Low risk - green
    if (value <= 70) return "#eab308"; // Medium risk - yellow
    return "#ef4444"; // High risk - red
  };

  // Transform the data into the format needed for the radar chart
  const chartData = [
    {
      metric: "Portfolio VaR",
      value: Math.min(100, Math.max(0, data.portfolio_var_99_percent)),
      fullMark: 100,
      rawValue: data.portfolio_var_99_percent,
      tooltip: `99% Value at Risk: ${formatPercent(
        data.portfolio_var_99_percent
      )}`,
    },
    {
      metric: "Sharpe Ratio",
      value: Math.min(100, Math.max(0, data.sharpe_ratio * 50)), // Scale to 0-100
      fullMark: 100,
      rawValue: data.sharpe_ratio,
      tooltip: `Risk-adjusted return: ${data.sharpe_ratio.toFixed(2)}`,
    },
    {
      metric: "Volatility",
      value: Math.min(100, Math.max(0, data.volatility * 100)),
      fullMark: 100,
      rawValue: data.volatility,
      tooltip: `30-day volatility: ${formatPercent(data.volatility * 100)}`,
    },
    {
      metric: "PnL %",
      value: Math.min(100, Math.max(0, data.pnl_percent)),
      fullMark: 100,
      rawValue: data.pnl_percent,
      tooltip: `Profit/Loss: ${formatPercent(data.pnl_percent)}`,
    },
    {
      metric: "Concentration",
      value: Math.min(100, Math.max(0, data.concentration_hhi * 100)),
      fullMark: 100,
      rawValue: data.concentration_hhi,
      tooltip: `Portfolio concentration: ${formatPercent(
        data.concentration_hhi * 100
      )}`,
    },
    {
      metric: "Value USD",
      value: Math.min(100, Math.max(0, (data.total_value_usd / 2000000) * 100)), // Scale to 0-100 (2M max)
      fullMark: 100,
      rawValue: data.total_value_usd,
      tooltip: `Total value: ${formatUSD(data.total_value_usd)}`,
    },
  ];

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Risk Metrics</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#eab308]" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span>High</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: "#4b5563",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{
              fill: "#6b7280",
              fontSize: 10,
            }}
          />
          <Radar
            name="Risk Metrics"
            dataKey="value"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.4}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded-lg shadow-lg text-sm">
                    <p className="font-medium text-gray-900">{data.metric}</p>
                    <p className="text-gray-600">{data.tooltip}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
