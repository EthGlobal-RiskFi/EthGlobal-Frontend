// src/components/TechnicalPanel.jsx
"use client";

import React, { useMemo, useState } from "react";
import useTechnical from "../hooks/useTechnical";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

/* ---------------- helpers ---------------- */
const badgeTone = {
  A: "bg-[var(--color-success)]/20 text-[var(--color-success)] border-[var(--color-success)]/40",
  B: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  C: "bg-[var(--color-warn)]/20 text-[var(--color-warn)] border-[var(--color-warn)]/40",
  D: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  E: "bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)]/40",
  F: "bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)]/40",
  default: "bg-white/10 text-[var(--color-text-400)] border-white/20",
};

const fullDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

function Skel({ className = "" }) {
  return <div className={`animate-pulse bg-white/10 rounded ${className}`} />;
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skel className="h-6 w-40" />
        <Skel className="h-8 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skel key={i} className="h-20" />
        ))}
      </div>
      <Skel className="h-64" />
    </div>
  );
}

/* motion variants */
const containerV = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.06 },
  },
};
const itemV = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

function StatCard({ label, value, sub }) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="p-3 rounded-xl border border-white/10 bg-white/5 shadow-sm hover:shadow-md"
    >
      <div className="text-xs text-[var(--color-text-400)]">{label}</div>
      <div className="text-lg font-semibold text-[var(--color-text-100)]">
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-[var(--color-text-400)] mt-0.5">
          {sub}
        </div>
      )}
    </motion.div>
  );
}

/* ---------------- main ---------------- */
export default function TechnicalPanel({
  apiBase = process.env.NEXT_PUBLIC_TECH_API_BASE || "http://10.125.9.225:5000",
  defaultTicker = "AAVE",
  tickers = ["AAVE", "WBTC", "LINK", "MATIC", "COMP", "SUSHI", "UNI", "BTC", "USDC", "DAI"],
  minHeight = 520,
}) {
  const [ticker, setTicker] = useState(defaultTicker);

  // Fixed params
  const days = 10;
  const alpha = 0.5;

  const { data, loading, error } = useTechnical({
    baseUrl: apiBase,
    ticker,
    days,
    alpha,
  });

  const hm = data?.health_metrics;
  const overall = hm?.overall_health;
  const trend = hm?.trend_health;
  const vol = hm?.volatility_health;
  const cons = hm?.consensus_health;
  const momentum = hm?.momentum_health?.score;
  const bb = hm?.ensemble_stats?.bollinger_bands;
  const macd = hm?.ensemble_stats?.macd;
  const rsi = hm?.ensemble_stats?.rsi;

  const series = useMemo(() => {
    const dates = data?.time_series?.dates || [];
    const vals = data?.time_series?.overall_health_scores || [];
    if (!dates.length || !vals.length) return [];
    return dates.map((d, i) => ({ x: fullDate(d), y: Number(vals[i]) || 0 }));
  }, [data]);

  const avgScore = useMemo(() => {
    if (!series.length) return null;
    return series.reduce((s, p) => s + (Number(p.y) || 0), 0) / series.length;
  }, [series]);

  const grade = overall?.grade ?? "-";
  const gradeClass = badgeTone[grade] || badgeTone.default;

  const initialLoading = loading && !data;

  return (
    <motion.section
      variants={containerV}
      initial="hidden"
      animate="show"
      className="relative rounded-2xl p-5 border border-white/10 bg-white/5 shadow-sm hover:shadow-md hover:border-white/20"
      style={{ minHeight }}
    >
      {initialLoading && <Skeleton />}

      {!initialLoading && loading && (
        <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-[var(--color-grad-1)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!initialLoading && (
        <>
          {/* Header */}
          <motion.div variants={itemV} className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--color-text-100)]">
              Technical — {ticker}
            </h2>
            <span
              title="Composite technical grade"
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${gradeClass} hover:ring-2 hover:ring-white/20 transition`}
            >
              Grade {grade} · {Math.round(overall?.score ?? 0)}
            </span>
          </motion.div>

          {/* Controls */}
          <motion.div variants={itemV} className="mb-4">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-400)]">
              <span>Ticker</span>
              <div className="relative w-44">
                <select
                  className="appearance-none w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-[var(--color-text-100)]
                             shadow-sm focus:outline-hidden focus:ring-3 focus:ring-white/20 focus:border-white/30 pr-9
                             hover:border-white/30 transition"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                >
                  {tickers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-400)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>
          </motion.div>

          {error && (
            <motion.div variants={itemV} className="mt-3 text-sm text-[var(--color-danger)]">
              Failed to load technicals: {error}
            </motion.div>
          )}

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatCard
              label="Overall score"
              value={Math.round(overall?.score ?? 0)}
              sub={`trend: ${trend?.trend_strength ?? "-"}`}
            />
            <StatCard
              label="Volatility health"
              value={Math.round(vol?.score ?? 0)}
              sub={`risk: ${vol?.risk_level ?? "-"}`}
            />
            <StatCard
              label="Consensus"
              value={Math.round(cons?.score ?? 0)}
              sub={`agreement: ${cons?.agreement_level ?? "-"}`}
            />
            <StatCard
              label="Momentum"
              value={Math.round(momentum ?? 0)}
              sub={`bullish MACD: ${Math.round(
                (hm?.momentum_health?.bullish_macd_ratio ?? 0) * 100
              )}%`}
            />
          </div>

          {/* More metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <StatCard
              label="RSI"
              value={`${(rsi?.mean ?? 0).toFixed(1)}`}
              sub={`overbought: ${Math.round(
                (rsi?.overbought_ratio ?? 0) * 100
              )}% · oversold: ${Math.round(
                (rsi?.oversold_ratio ?? 0) * 100
              )}%`}
            />
            <StatCard
              label="MACD histogram"
              value={(macd?.histogram_mean ?? 0).toFixed(4)}
              sub={`bullish: ${Math.round(
                (macd?.bullish_ratio ?? 0) * 100
              )}% · σ: ${(macd?.histogram_std ?? 0).toFixed(3)}`}
            />
            <StatCard
              label="Bollinger position"
              value={(bb?.position_mean ?? 0).toFixed(2)}
              sub={`σ: ${(bb?.position_std ?? 0).toFixed(2)} · extremes: ${
                bb?.extremes_ratio ?? 0
              }`}
            />
          </div>

          {/* Chart */}
          <motion.div
            variants={itemV}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 250, damping: 24 }}
            className="h-64 w-full rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm hover:shadow-md"
          >
            {series.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-400)]">
                No time-series available.
              </div>
            ) : (
              <ResponsiveContainer>
                <AreaChart
                  data={series}
                  margin={{ top: 10, right: 40, bottom: 20, left: 10 }}
                >
                  <defs>
                    <linearGradient id="tArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.06} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />

                  <XAxis
                    dataKey="x"
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#93A4B8" }}
                    tickMargin={8}
                    interval="preserveStartEnd"
                    minTickGap={32}
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    width={56}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#93A4B8" }}
                    tickMargin={8}
                  />

                  <Tooltip
                    formatter={(v) => [Number(v).toFixed(2), "Overall score"]}
                    labelFormatter={(l) => `Date: ${l}`}
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "rgba(255,255,255,0.12)",
                      background: "rgba(17, 24, 39, 0.9)",
                      color: "white",
                      boxShadow: "0 8px 24px rgba(2,6,23,0.18)",
                    }}
                  />

                  {avgScore != null && (
                    <ReferenceLine
                      y={avgScore}
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      label={{
                        value: "Avg",
                        position: "right",
                        fill: "#93A4B8",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Area
                    dataKey="y"
                    name="Overall score"
                    type="monotone"
                    fill="url(#tArea)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </>
      )}
    </motion.section>
  );
}
