// src/components/TechnicalPanel.jsx
"use client";

import React, { useMemo, useState } from "react";
import useTechnical from "../hooks/useTechnical";
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
  A: "bg-green-100 text-green-800 border-green-300",
  B: "bg-emerald-100 text-emerald-800 border-emerald-300",
  C: "bg-yellow-100 text-yellow-800 border-yellow-300",
  D: "bg-orange-100 text-orange-800 border-orange-300",
  E: "bg-red-100 text-red-800 border-red-300",
  F: "bg-red-100 text-red-800 border-red-300",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

const fullDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

function Skel({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
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

function Card({ label, value, sub }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ---------------- main ---------------- */
export default function TechnicalPanel({
  apiBase = process.env.NEXT_PUBLIC_TECH_API_BASE ||
    "http://10.125.9.225:5000",
  defaultTicker = "AAVE",
  tickers = [
    "AAVE",
    "WBTC",
    "LINK",
    "MATIC",
    "COMP",
    "SUSHI",
    "UNI",
    "BTC",
    "USDC",
    "DAI",
  ],
  minHeight = 520,
}) {
  const [ticker, setTicker] = useState(defaultTicker);

  // Always use fixed values for days & alpha
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
    return dates.map((d, i) => ({
      x: fullDate(d),
      y: Number(vals[i]) || 0,
    }));
  }, [data]);

  const avgScore = useMemo(() => {
    if (!series.length) return null;
    return series.reduce((s, p) => s + (Number(p.y) || 0), 0) / series.length;
  }, [series]);

  const grade = overall?.grade ?? "-";
  const gradeTone = badgeTone[grade] || badgeTone.default;

  const initialLoading = loading && !data;

  return (
    <section className="panel relative" style={{ minHeight }}>
      {initialLoading && <Skeleton />}

      {!initialLoading && loading && (
        <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!initialLoading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Technical — {ticker}</h2>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${gradeTone}`}
            >
              Grade {grade} · {Math.round(overall?.score ?? 0)}
            </span>
          </div>

          {/* Controls */}
          <div className="mb-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Ticker</span>
              <select
                className="border rounded px-2 py-1 w-40"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              >
                {tickers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600">
              Failed to load technicals: {error}
            </div>
          )}

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card
              label="Overall score"
              value={Math.round(overall?.score ?? 0)}
              sub={`trend: ${trend?.trend_strength ?? "-"}`}
            />
            <Card
              label="Volatility health"
              value={Math.round(vol?.score ?? 0)}
              sub={`risk: ${vol?.risk_level ?? "-"}`}
            />
            <Card
              label="Consensus"
              value={Math.round(cons?.score ?? 0)}
              sub={`agreement: ${cons?.agreement_level ?? "-"}`}
            />
            <Card
              label="Momentum"
              value={Math.round(momentum ?? 0)}
              sub={`bullish MACD: ${Math.round(
                (hm?.momentum_health?.bullish_macd_ratio ?? 0) * 100
              )}%`}
            />
          </div>

          {/* More metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Card
              label="RSI"
              value={`${(rsi?.mean ?? 0).toFixed(1)}`}
              sub={`overbought: ${Math.round(
                (rsi?.overbought_ratio ?? 0) * 100
              )}% · oversold: ${Math.round((rsi?.oversold_ratio ?? 0) * 100)}%`}
            />
            <Card
              label="MACD histogram"
              value={(macd?.histogram_mean ?? 0).toFixed(4)}
              sub={`bullish: ${Math.round(
                (macd?.bullish_ratio ?? 0) * 100
              )}% · σ: ${(macd?.histogram_std ?? 0).toFixed(3)}`}
            />
            <Card
              label="Bollinger position"
              value={(bb?.position_mean ?? 0).toFixed(2)}
              sub={`σ: ${(bb?.position_std ?? 0).toFixed(2)} · extremes: ${
                bb?.extremes_ratio ?? 0
              }`}
            />
          </div>

          {/* Chart */}
          <div className="h-64 w-full rounded-lg border bg-white p-2">
            {series.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No time-series available.
              </div>
            ) : (
              <ResponsiveContainer>
                <AreaChart
                  data={series}
                  margin={{ top: 10, right: 50, bottom: 20, left: 10 }} // more left for label + ticks
                >
                  <defs>
                    <linearGradient id="tArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#4f46e5"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0.06}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="x"
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#374151" }}
                    tickMargin={8}
                    interval="preserveStartEnd"
                    minTickGap={32}
                    label={{
                      value: "Date",
                      position: "insideBottom",
                      offset: -20,
                      style: { fontSize: 14, fontWeight: 500, fill: "#111827" },
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    width={56}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "#374151" }}
                    tickMargin={8}
                    label={{
                      value: "Overall Health",
                      angle: -90,
                      position: "insideLeft", 
                      offset: 20,
                      style: {
                        fontSize: 14,
                        fontWeight: 500,
                        fill: "#111827",
                        textAnchor: "middle",
                      },
                    }}
                  />

                  <Tooltip
                    formatter={(v) => [Number(v).toFixed(2), "Overall score"]}
                    labelFormatter={(l) => `Date: ${l}`}
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: "#e5e7eb",
                      boxShadow: "0 3px 12px rgba(0,0,0,.06)",
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
                        fill: "#64748b",
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
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </section>
  );
}
