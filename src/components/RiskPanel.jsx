// src/components/RiskPanel.jsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import useRisk from "../hooks/useRisk";

/* ----------------- helpers ----------------- */
const pct = (n, digits = 2) =>
  n == null || isNaN(n) ? "—" : `${Number(n).toFixed(digits)}%`;

const levelStyles = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  High: "bg-red-100 text-red-800 border-red-300",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

function Gauge({ value = 0, max = 10 }) {
  const pctVal = Math.max(0, Math.min(100, (value / max) * 100));
  const color = value < 3 ? "bg-green-500" : value < 7 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-sm text-gray-600">Risk score</div>
        <div className="text-sm font-medium">{value?.toFixed?.(2)} / {max}</div>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pctVal}%` }} />
      </div>
    </div>
  );
}

/* ----------------- skeletons ----------------- */
function Skel({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

function RiskSkeleton() {
  // Matches the panel layout so height stays stable
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <Skel className="h-6 w-40" />
        <Skel className="h-8 w-28 rounded-full" />
      </div>

      {/* controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Skel className="h-10 w-full" />
        <div className="space-y-2">
          <Skel className="h-2 w-full" />
          <Skel className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skel className="h-2 w-full" />
          <Skel className="h-10 w-full" />
        </div>
      </div>

      {/* interp + gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skel className="h-20 w-full lg:col-span-2" />
        <Skel className="h-20 w-full" />
      </div>

      {/* four cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skel key={i} className="h-20 w-full" />
        ))}
      </div>

      {/* three cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skel key={i} className="h-20 w-full" />
        ))}
      </div>

      {/* three cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skel key={i} className="h-20 w-full" />
        ))}
      </div>

      {/* long row */}
      <Skel className="h-16 w-full" />
    </div>
  );
}

/* ----------------- main ----------------- */
export default function RiskPanel({
  apiBase = process.env.NEXT_PUBLIC_RISK_API_BASE || "http://10.200.11.202:5000",
  defaultTicker = "WBTC",
  tickers = ["AAVE", "WBTC", "LINK", "MATIC", "COMP", "SUSHI", "UNI", "USDC", "DAI", "ETH", "BTC"],
}) {
  // Controls
  const [ticker, setTicker] = useState(defaultTicker);
  const [alpha, setAlpha] = useState(0.95);
  const [days, setDays] = useState(1);

  // Fetch
  const { data, loading, error } = useRisk({
    baseUrl: apiBase,
    ticker,
    alpha,
    days,
  });

  // Shape
  const ra = data?.risk_assessment;
  const core = ra?.risk_assessment;
  const varm = ra?.var_metrics;
  const add  = ra?.additional_risk_metrics;
  const vae  = ra?.vae_specific_metrics;

  // UI
  const level = core?.risk_level || "—";
  const badgeClass = levelStyles[level] || levelStyles.default;
  const effectiveTicker = data?.ticker || ra?.ticker || ticker || "—";
  const alphaPercent = useMemo(() => `${(alpha * 100).toFixed(0)}%`, [alpha]);

  // Guard inputs
  useEffect(() => {
    if (alpha < 0) setAlpha(0);
    if (alpha > 0.99) setAlpha(0.99);
    if (days < 1) setDays(1);
    if (days > 365) setDays(365);
  }, [alpha, days]);

  // Are we loading the very first time (no data yet)?
  const initialLoading = loading && !data;

  return (
    <section className="panel relative min-h-[560px]">
      {/* Initial skeleton: keeps height stable while first fetch happens */}
      {initialLoading && <RiskSkeleton />}

      {/* When we already have data and a re-fetch happens (user moves slider),
          keep content visible and show a soft overlay spinner */}
      {!initialLoading && loading && (
        <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
        </div>
      )}

      {/* Content renders only when we have data */}
      {!initialLoading && (
        <>
          {/* Header: title + badge */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Risk — {effectiveTicker}</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${badgeClass}`}>
              {level.toUpperCase()} RISK
            </span>
          </div>

          {/* Controls */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ticker */}
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Ticker</span>
              <select
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="border rounded-md px-2 py-1"
              >
                {tickers.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            {/* Alpha */}
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Alpha (confidence)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="border rounded-md w-20 px-2 py-1"
                />
                <span className="text-xs text-gray-500">{alphaPercent}</span>
              </div>
            </label>

            {/* Days */}
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Days (1–365)</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={365}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <input
                  type="number"
                  min={1}
                  max={365}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
                  className="border rounded-md w-20 px-2 py-1"
                />
              </div>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-red-600">
              Failed to load risk: {error}
            </div>
          )}

          {/* Interpretation + gauge */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-3 rounded-lg bg-gray-50 border">
              <div className="text-sm text-gray-500">Interpretation</div>
              <div className="mt-1 text-sm">{core?.interpretation || "—"}</div>
            </div>
            <div className="lg:col-span-1">
              <Gauge value={Number(core?.risk_score || 0)} max={10} />
            </div>
          </div>

          {/* VaR strip */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="VaR 90" value={pct(ra?.var_metrics?.var_90)} />
            <MetricCard label="VaR 95" value={pct(ra?.var_metrics?.var_95)} />
            <MetricCard label="VaR 99" value={pct(ra?.var_metrics?.var_99)} />
            <MetricCard label="VaR (custom)" value={pct(ra?.var_metrics?.var_custom)} />
          </div>


          {/* Volatility & loss */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Avg daily volatility" value={pct(add?.average_daily_volatility)} />
            <MetricCard label="Expected shortfall 95" value={pct(add?.expected_shortfall_95)} />
            <MetricCard label="Max drawdown" value={pct(add?.max_drawdown)} />
          </div>

          {/* VAE stats */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Annualized volatility" value={pct(add?.portfolio_volatility_annualized)} />
            <MetricCard label="Data points" value={vae?.data_points ?? "—"} />
            <MetricCard label="Recreations" value={vae?.number_of_recreations ?? "—"} />
          </div>

          {/* Vol range */}
          <div className="mt-4 p-3 rounded-lg border bg-white">
            <div className="text-xs text-gray-500 mb-2">Recreation volatility range</div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><span className="text-gray-500">Min:</span> <span className="font-medium">{pct(vae?.recreation_volatility_range?.min)}</span></div>
              <div><span className="text-gray-500">Mean:</span> <span className="font-medium">{pct(vae?.recreation_volatility_range?.mean)}</span></div>
              <div><span className="text-gray-500">Max:</span> <span className="font-medium">{pct(vae?.recreation_volatility_range?.max)}</span></div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* small metric card */
function MetricCard({ label, value }) {
  return (
    <div className="p-3 rounded-lg border bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
