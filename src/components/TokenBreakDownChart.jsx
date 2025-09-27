"use client";

import { motion } from "framer-motion";

export default function TokenBreakdownChart({ data }) {
  if (!data || !data.allocation_percent || !data.var_99_per_ticker) return null;

  const chartData = Object.keys(data.allocation_percent).map((token) => ({
    token,
    allocation: data.allocation_percent[token],
    var99: data.var_99_per_ticker[token],
  }));

  const COLOR_PALETTE = [
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#3b82f6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#10b981",
  ];

  const getTokenColor = (token, index) => {
    const hash = token.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full space-y-8 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-100)] mb-2">
          Portfolio Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-400)]">
          Token allocation and risk metrics overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
        >
          <h3 className="text-sm text-[var(--color-text-400)] mb-1">
            Total Tokens
          </h3>
          <p className="text-2xl font-bold text-[var(--color-text-100)]">
            {chartData.length}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
        >
          <h3 className="text-sm text-[var(--color-text-400)] mb-1">
            Largest Holding
          </h3>
          <p className="text-2xl font-bold text-[var(--color-text-100)]">
            {
              chartData.reduce(
                (max, token) =>
                  token.allocation > max.allocation ? token : max,
                chartData[0]
              )?.token
            }
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
        >
          <h3 className="text-sm text-[var(--color-text-400)] mb-1">
            Highest VaR
          </h3>
          <p className="text-2xl font-bold text-red-500">
            {Math.max(...chartData.map((d) => d.var99)).toFixed(1)}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
        >
          <h3 className="text-sm text-[var(--color-text-400)] mb-1">
            Avg VaR
          </h3>
          <p className="text-2xl font-bold text-orange-400">
            {(
              chartData.reduce((sum, d) => sum + d.var99, 0) /
              chartData.length
            ).toFixed(1)}
          </p>
        </motion.div>
      </div>

      {/* Token Details Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-[var(--color-text-100)]">
            Token Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-[var(--color-text-400)] uppercase tracking-wider text-xs">
                  Token
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--color-text-400)] uppercase tracking-wider text-xs">
                  Allocation
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--color-text-400)] uppercase tracking-wider text-xs">
                  VaR 99%
                </th>
                <th className="px-6 py-3 text-left font-medium text-[var(--color-text-400)] uppercase tracking-wider text-xs">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {chartData
                .sort((a, b) => b.allocation - a.allocation)
                .map((token, index) => (
                  <motion.tr
                    key={token.token}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded mr-3"
                          style={{
                            backgroundColor: getTokenColor(
                              token.token,
                              index
                            ),
                          }}
                        />
                        <span className="font-medium text-[var(--color-text-100)]">
                          {token.token}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-white/10 rounded-full h-2 mr-3">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (token.allocation /
                                  Math.max(
                                    ...chartData.map((d) => d.allocation)
                                  )) *
                                100
                              }%`,
                              backgroundColor: getTokenColor(
                                token.token,
                                index
                              ),
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-300)]">
                          {token.allocation.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-text-100)]">
                      {token.var99.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          token.var99 > 6
                            ? "bg-red-500/20 text-red-400"
                            : token.var99 > 4
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {token.var99 > 6
                          ? "High"
                          : token.var99 > 4
                          ? "Medium"
                          : "Low"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
