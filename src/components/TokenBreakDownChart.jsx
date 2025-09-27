"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TokenBreakdownChart({ data }) {
  if (!data || !data.allocation_percent || !data.var_99_per_ticker) return null;

  // Transform into array of objects for Recharts
  const chartData = Object.keys(data.allocation_percent).map((token) => ({
    token,
    allocation: data.allocation_percent[token],
    var99: data.var_99_per_ticker[token],
  }));

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Per-Token Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="token" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="allocation" fill="#4f46e5" name="Allocation %" />
          <Bar dataKey="var99" fill="#ef4444" name="VaR 99%" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
