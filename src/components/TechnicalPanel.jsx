// src/components/TechnicalPanel.jsx
"use client";

import React, { useMemo, useState } from "react";
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

/* ---------------- hard-coded data ---------------- */
const HARD_TECH_DATA = {
  health_metrics: {
    consensus_health: {
      agreement_level: "medium",
      macd_std: 0.016274741434653,
      rsi_std: 5.31108277728999,
      score: 100,
    },
    ensemble_stats: {
      bollinger_bands: {
        extremes_ratio: 0,
        position_mean: 0.48946515700871,
        position_std: 0.37469196700948,
      },
      macd: {
        bullish_ratio: 0.5,
        histogram_mean: -0.00326017151875704,
        histogram_std: 0.016274741434653,
      },
      rsi: {
        bullish_ratio: 1,
        mean: 49.8504211400114,
        overbought_ratio: 0,
        oversold_ratio: 0,
        std: 5.31108277728999,
      },
    },
    momentum_health: {
      bullish_macd_ratio: 0.5,
      macd_histogram_mean: -0.00326017151875704,
      rsi_mean: 49.8504211400114,
      rsi_overbought_ratio: 0,
      rsi_oversold_ratio: 0,
      score: 70,
    },
    overall_health: {
      grade: "D",
      score: 58.234613668258,
    },
    overview: {
      analysis_period_days: 390,
      latest_date: "2025-09-26",
      total_recreations: 50,
    },
    timestamp: "2025-09-26T00:00:00",
    trend_health: {
      bullish_momentum_ratio: 0.5,
      momentum_20_mean: -0.0834301332624,
      score: 0,
      trend_strength: "bearish",
    },
    volatility_health: {
      risk_level: "medium",
      score: 86.17306834129,
      volatility_mean: 2.76538633174201,
      volatility_std: 2.26415313613885,
    },
  },
  metadata: {
    first_date: "2024-09-02T00:00:00",
    last_date: "2025-09-26T00:00:00",
    total_data_points: 390,
  },
  status: "success",
  ticker: "AAVE",
  time_series: {
    bullish_consensus: new Array(30).fill(1),
    dates: [
      "2025-08-28T00:00:00",
      "2025-08-29T00:00:00",
      "2025-08-30T00:00:00",
      "2025-08-31T00:00:00",
      "2025-09-01T00:00:00",
      "2025-09-02T00:00:00",
      "2025-09-03T00:00:00",
      "2025-09-04T00:00:00",
      "2025-09-05T00:00:00",
      "2025-09-06T00:00:00",
      "2025-09-07T00:00:00",
      "2025-09-08T00:00:00",
      "2025-09-09T00:00:00",
      "2025-09-10T00:00:00",
      "2025-09-11T00:00:00",
      "2025-09-12T00:00:00",
      "2025-09-13T00:00:00",
      "2025-09-14T00:00:00",
      "2025-09-15T00:00:00",
      "2025-09-16T00:00:00",
      "2025-09-17T00:00:00",
      "2025-09-18T00:00:00",
      "2025-09-19T00:00:00",
      "2025-09-20T00:00:00",
      "2025-09-21T00:00:00",
      "2025-09-22T00:00:00",
      "2025-09-23T00:00:00",
      "2025-09-24T00:00:00",
      "2025-09-25T00:00:00",
      "2025-09-26T00:00:00",
    ],
    overall_health_scores: [
      82.8293827156439, 82.82641560481, 82.7333519336944, 82.8817966396883,
      82.8484379328591, 82.7127555741456, 82.8757313576844, 83.0133869173553,
      83.0227193715474, 83.06013722052, 83.0770261360699, 83.0410124396564,
      74.0091262340336, 74.0150032026117, 74.0499273366636, 74.0296370547893,
      74.1245614728657, 73.9286669684183, 73.9003418943054, 73.9930924684764,
      74.0091158633606, 73.9228785913937, 73.9497415515382, 73.9157473885828,
      73.7576100883228, 73.8370640835796, 58.4585124496267, 58.3320761781618,
      58.3076022011541, 58.234613668258,
    ],
    rsi_mean: [
      50.5298849564867, 49.4905106900258, 50.1589770782415, 51.8760137920566,
      50.2268312917128, 48.5513989479083, 49.7973051461301, 51.2745639764948,
      50.940454916492, 49.8165251868263, 49.7833355853465, 48.6140503405772,
      49.7627312184514, 49.5814690184126, 49.7573866140958, 49.332745731971,
      49.3430338266172, 48.8140681827715, 49.2408674656812, 51.0895062780953,
      51.1305474544943, 48.2567446117648, 50.0854149222539, 50.0126298063255,
      49.7723427596433, 51.3494479803583, 47.7258188217229, 50.4301229343446,
      49.4299284331802, 49.8504211400114,
    ],
    rsi_std: [
      4.54568283733682, 3.55807422762479, 5.29879112608036, 6.79072903690654,
      4.52802263004404, 6.74071579738349, 7.04577721857281, 6.12373685228179,
      4.98674779690644, 5.04230651179954, 5.11577028257038, 6.43572586447985,
      5.49896911448614, 7.22665106746693, 4.04140397116439, 4.31241559206578,
      6.85987400124588, 7.67474224189706, 5.54209212699432, 7.2581634033345,
      5.05613860112298, 5.13933655945798, 5.3855613953804, 5.12246209026994,
      5.69193028008257, 5.52923132390803, 8.33844917368231, 8.44010288434825,
      4.85598926074211, 5.31108277728999,
    ],
    volatility_mean: [
      2.18190812412256, 2.18488826734959, 2.28141739116471, 2.13273977351562,
      2.17267259607586, 2.30217392055654, 2.13744154255955, 2.0011107380262,
      1.99136911814041, 1.96112565147529, 1.94305270506872, 1.97153226885048,
      2.00886324076848, 2.0023961699151, 1.9694327066906, 1.98853287049084,
      1.8910301719002, 2.0802680067414, 2.1061432481415, 2.01598569630128,
      2.00164989432736, 2.08456989767697, 2.06023644350491, 2.09447931012151,
      2.24648657142756, 2.17283223020479, 2.54148755037329, 2.6679238218382,
      2.69239779884594, 2.76538633174201,
    ],
  },
  timestamp: "2025-09-26T21:32:06.729504",
};

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
  apiBase = process.env.NEXT_PUBLIC_TECH_API_BASE || "http://127.0.0.1:5000",
  defaultTicker = "AAVE",
  tickers = ["AAVE", "WBTC", "LINK", "MATIC", "COMP", "SUSHI", "UNI", "BTC", "USDC", "DAI"],
  minHeight = 520,
}) {
  const [ticker, setTicker] = useState(defaultTicker);

  // 🔒 Use hard-coded data always
  const data = HARD_TECH_DATA;
  const loading = false;
  const error = null;

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

          {/* Controls (ticker changes header only; data is fixed) */}
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
                (HARD_TECH_DATA.health_metrics.momentum_health.bullish_macd_ratio ?? 0) * 100
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
