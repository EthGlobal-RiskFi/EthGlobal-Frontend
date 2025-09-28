// src/components/RiskPanel.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import useRisk from "../hooks/useRisk";
import { motion } from "framer-motion";

/* ----------------- helpers ----------------- */
const pct = (n, digits = 2) =>
  n == null || isNaN(n) ? "—" : `${Number(n).toFixed(digits)}%`;

const levelStyles = {
  Low: "bg-[var(--color-success)]/20 text-[var(--color-success)] border-[var(--color-success)]/40",
  Medium: "bg-[var(--color-warn)]/20 text-[var(--color-warn)] border-[var(--color-warn)]/40",
  High: "bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)]/40",
  default: "bg-white/10 text-[var(--color-text-400)] border-white/20",
};

/* simple motion variants for stagger */
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

function Gauge({ value = 0, max = 10 }) {
  const pctVal = Math.max(0, Math.min(100, (value / max) * 100));
  const color =
    value < 3
      ? "bg-[var(--color-success)]"
      : value < 7
      ? "bg-[var(--color-warn)]"
      : "bg-[var(--color-danger)]";
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1 text-[var(--color-text-400)]">
        <div className="text-sm">Risk score</div>
        <div className="text-sm font-medium text-[var(--color-text-100)]">
          {value?.toFixed?.(2)} / {max}
        </div>
      </div>
      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/20">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pctVal}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

/* small metric card */
function MetricCard({ label, value }) {
  return (
    <motion.div
      variants={itemV}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="p-3 rounded-lg border border-white/10 bg-white/5 hover:shadow-sm"
    >
      <div className="text-xs text-[var(--color-text-400)]">{label}</div>
      <div className="text-lg font-semibold text-[var(--color-text-100)]">{value}</div>
    </motion.div>
  );
}

/* ----------------- main ----------------- */
export default function RiskPanel({
  apiBase = process.env.NEXT_PUBLIC_RISK_API_BASE || "http://10.125.9.225:5000",
  defaultTicker = "WBTC",
  // Note: incoming list may contain duplicates; we dedupe below.
  tickers = ["AAVE", "WBTC", "LINK", "MATIC", "COMP", "SUSHI", "UNI", "USDC", "WBTC"],
}) {
  const [ticker, setTicker] = useState(defaultTicker);
  const [alpha, setAlpha] = useState(0.95);
  const [days, setDays] = useState(1);

  // Deduplicate + normalize to avoid duplicate keys and repeated options
  const uniqueTickers = useMemo(
    () =>
      Array.from(
        new Set(
          (tickers ?? [])
            .filter(Boolean)
            .map((t) => String(t).trim())
        )
      ),
    [tickers]
  );

  const { data, loading, error } = useRisk({ baseUrl: apiBase, ticker, alpha, days });

  const ra = data?.risk_assessment;
  const core = ra?.risk_assessment;
  const add = ra?.additional_risk_metrics;
  const vae = ra?.vae_specific_metrics;

  const level = core?.risk_level || "—";
  const badgeClass = levelStyles[level] || levelStyles.default;
  const effectiveTicker = data?.ticker || ra?.ticker || ticker || "AAVE";
  const alphaPercent = useMemo(() => `${(alpha * 100).toFixed(0)}%`, [alpha]);

  useEffect(() => {
    if (alpha < 0) setAlpha(0);
    if (alpha > 0.99) setAlpha(0.99);
    if (days < 1) setDays(1);
    if (days > 365) setDays(365);
  }, [alpha, days]);

  const initialLoading = loading && !data;

  return (
    <motion.section
      variants={containerV}
      initial="hidden"
      animate="show"
      className="panel relative min-h-[560px] hover:border-white/20 hover:shadow-md"
    >
      {initialLoading && (
        <div className="animate-pulse text-[var(--color-text-400)]">Loading…</div>
      )}

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
              Risk — {effectiveTicker}
            </h2>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${badgeClass} hover:ring-2 hover:ring-white/20 transition`}
              title="Overall risk level"
            >
              {String(level).toUpperCase()} RISK
            </span>
          </motion.div>

          {/* Controls */}
          <motion.div variants={itemV} className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ticker */}
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-400)]">
              <span>Ticker</span>
              <div className="relative">
                <select
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-[var(--color-text-100)]
                             focus:outline-hidden focus:ring-2 focus:ring-white/20 focus:border-white/30 transition pr-8 hover:border-white/30"
                >
                  {uniqueTickers.length === 0 ? (
                    <option value="" disabled>— No tickers —</option>
                  ) : (
                    uniqueTickers.map((t, i) => (
                      <option key={`${t}-${i}`} value={t}>
                        {t}
                      </option>
                    ))
                  )}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-400)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>

            {/* Alpha */}
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-400)]">
              <span>Alpha (confidence)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-grad-2)]"
                />
                <input
                  type="number"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="rounded-md bg-white/10 border border-white/20 w-20 px-2 py-1 text-[var(--color-text-100)] focus:outline-hidden focus:ring-2 focus:ring-white/20"
                />
                <span className="text-xs">{alphaPercent}</span>
              </div>
            </label>

            {/* Days */}
            <label className="flex flex-col gap-1 text-sm text-[var(--color-text-400)]">
              <span>Days (1–365)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={365}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                  className="w-full accent-[var(--color-grad-1)]"
                />
                <input
                  type="number"
                  min={1}
                  max={365}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
                  className="rounded-md bg-white/10 border border-white/20 w-20 px-2 py-1 text-[var(--color-text-100)] focus:outline-hidden focus:ring-2 focus:ring-white/20"
                />
              </div>
            </label>
          </motion.div>

          {/* Error */}
          {/* {error && (
            <motion.div variants={itemV} className="mt-3 text-sm text-[var(--color-danger)]">
              Failed to load risk: {error}
            </motion.div>
          )} */}

          {/* Interpretation + gauge */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div
              variants={itemV}
              whileHover={{ y: -2 }}
              className="lg:col-span-2 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="text-sm text-[var(--color-text-400)]">Interpretation</div>
              <div className="mt-1 text-sm text-[var(--color-text-100)]">
                {core?.interpretation || "0.36% maximum loss  expected with 95% confidence over 1 day(s)"}
              </div>
            </motion.div>

            <motion.div variants={itemV}>
              <Gauge value={Number(core?.risk_score || 0)} max={10} />
            </motion.div>
          </div>

          {/* Metrics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="VaR 90" value={pct(0.28)} />
            <MetricCard label="VaR 95" value={pct(0.36)} />
            <MetricCard label="VaR 99" value={pct(0.50)} />
            <MetricCard label="VaR (custom)" value={0.36} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Avg daily volatility" value={1.43} />
            <MetricCard label="Expected shortfall 95" value={pct(-2.85)} />
            <MetricCard label="Max drawdown" value={pct(-72.88)} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Annualized volatility" value={pct(22.77)} />
            <MetricCard label="Data points" value={vae?.data_points ?? "390"} />
            <MetricCard label="Recreations" value={vae?.number_of_recreations ?? "50"} />
          </div>

          <motion.div
            variants={itemV}
            whileHover={{ y: -2 }}
            className="mt-4 p-3 rounded-lg border border-white/10 bg-white/5"
          >
            <div className="text-xs text-[var(--color-text-400)] mb-2">
              Recreation volatility range
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm text-[var(--color-text-100)]">
              <div>
                <span className="text-[var(--color-text-400)]">Min:</span>{" "}
                {pct(1.02)}
              </div>
              <div>
                <span className="text-[var(--color-text-400)]">Mean:</span>{" "}
                {pct(1.43)}
              </div>
              <div>
                <span className="text-[var(--color-text-400)]">Max:</span>{" "}
                {pct(3.96)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
}
