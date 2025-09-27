"use client";

import React, { useMemo, useState, useEffect } from "react";
import useCsv from "../hooks/useCsv";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Helpers
const formatDate = (v) => {
  if (!v) return "";
  const n = Number(v);
  const d = Number.isFinite(n)
    ? new Date(n < 1e12 ? n * 1000 : n)
    : new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const formatUSD = (n) =>
  n == null || isNaN(n)
    ? "—"
    : "$" +
      Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function PivotChart({
  csvPath = "/data/crypto_prices_pivot.csv",
  height = 300,
}) {
  const { data: rows, loading, error } = useCsv(csvPath);

  // Extract columns
  const columns = useMemo(
    () => (rows[0] ? Object.keys(rows[0]) : []),
    [rows]
  );
  const dateKey = columns[0] || "";
  const tokenKeys = columns.slice(1);

  // Default to the first token if available
  const [token, setToken] = useState("");
  useEffect(() => {
    if (tokenKeys.length > 0 && !token) {
      setToken(tokenKeys[0]);
    }
  }, [tokenKeys, token]);

  // Build chart data
  const series = useMemo(() => {
    if (!rows?.length || !token || !dateKey) return [];
    return rows.map((r) => ({
      x: formatDate(r[dateKey]),
      price: Number(r[token]),
    }));
  }, [rows, token, dateKey]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold text-[var(--color-text-100)]">
          Token Price Over Time
        </h2>

        <div className="flex items-center gap-2">
          <label
            className="text-sm text-[var(--color-text-400)]"
            htmlFor="pivot-token"
          >
            Token:
          </label>
          <select
            id="pivot-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-white/10 bg-white/10 text-[var(--color-text-100)] focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm"
            disabled={loading || tokenKeys.length === 0}
          >
            {tokenKeys.map((k) => (
              <option key={k} value={k} className="bg-gray-900">
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 mb-2">Error: {String(error)}</div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="h-72 bg-white/10 animate-pulse rounded-2xl" />
      ) : series.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-[var(--color-text-400)] text-sm rounded-2xl border border-dashed border-white/10">
          No data for the selected token.
        </div>
      ) : (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <LineChart
              data={series}
              margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
              <XAxis dataKey="x" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis
                tickFormatter={formatUSD}
                width={90}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                label={{
                  value: "Price (USD)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#9ca3af" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.85)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}
                formatter={(value) => [formatUSD(value), "Price"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.section>
  );
}
