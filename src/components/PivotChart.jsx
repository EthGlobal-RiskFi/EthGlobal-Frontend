// src/components/PivotChart.jsx
"use client";

import React, { useMemo, useState } from "react";
import useCsv from "../hooks/useCsv";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Formatters
const formatDate = (v) => {
  if (!v) return "";
  const n = Number(v);
  let d;
  if (Number.isFinite(n)) {
    const ms = n < 1e12 ? n * 1000 : n;
    d = new Date(ms);
  } else {
    d = new Date(v);
  }
  if (!d || isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatUSD = (n) => {
  if (n == null || isNaN(n)) return "—";
  return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
};

export default function PivotChart({
  csvPath = "/data/crypto_prices_pivot.csv",
  height = 300,
}) {
  const { data: rows, loading, error } = useCsv(csvPath);

  // Column names
  const columns = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);
  const dateKey = columns[0]; // first column assumed to be date
  const tokenKeys = columns.slice(1);

  const [token, setToken] = useState(tokenKeys[0]);

  // Build series for the selected token
  const series = useMemo(() => {
    if (!rows?.length || !token || !dateKey) return [];
    return rows.map((r) => ({
      x: formatDate(r[dateKey]),
      price: Number(r[token]),
    }));
  }, [rows, token, dateKey]);

  return (
    <section className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Token Price Over Time</h2>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Token:</label>
          <select
            value={token || ""}
            onChange={(e) => setToken(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {tokenKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-500 mb-2">Error: {error}</div>}

      {loading ? (
        <div className="h-72 bg-gray-50 animate-pulse rounded" />
      ) : !token || series.length === 0 ? (
        <div className="text-sm text-gray-500">No pivot data.</div>
      ) : (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={formatUSD}
                width={90}
                tick={{ fontSize: 12 }}
                label={{
                  value: "Price (USD)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                formatter={(value) => [formatUSD(value), "Price"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
