"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import useCsv from "../hooks/useCsv";
import { motion } from "framer-motion";

/* ---------- helpers ---------- */
function toMs(v) {
  if (v == null || v === "") return -Infinity;
  const n = Number(v);
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n;
  const d = Date.parse(String(v));
  return Number.isFinite(d) ? d : -Infinity;
}
function latestByToken(rows) {
  const map = new Map();
  for (const r of rows || []) {
    const token = (r.token ?? r.symbol ?? "").toString().trim();
    if (!token) continue;
    const t = Math.max(toMs(r.timestamp), toMs(r.datetime), toMs(r.time));
    const prev = map.get(token);
    if (!prev || t > prev._ts) map.set(token, { ...r, _ts: t, _token: token });
  }
  return Array.from(map.values());
}
function formatNumber(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  const num = Number(n);
  if (Math.abs(num) >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(digits) + "B";
  if (Math.abs(num) >= 1_000_000)
    return (num / 1_000_000).toFixed(digits) + "M";
  if (Math.abs(num) >= 1_000) return (num / 1_000).toFixed(digits) + "K";
  return num.toLocaleString(undefined, { maximumFractionDigits: digits });
}
function formatUSD(n, digits = 2) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return (
    "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: digits })
  );
}
function fmtTime(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------- card ---------- */
function TokenCard({ item, highlighted }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={[
        "snap-center shrink-0",
        "min-w-[240px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[320px] xl:min-w-[340px] max-w-[360px]",
        "h-56 md:h-60 overflow-hidden",
        "rounded-2xl p-4 border border-white/10 bg-white/5 shadow-sm",
        highlighted
          ? "ring-2 ring-indigo-500 shadow-md animate-pulse"
          : "hover:-translate-y-1 hover:shadow-lg transition-transform",
        "flex flex-col justify-between scroll-mx-4",
      ].join(" ")}
      role="group"
      aria-label={`${item._token ?? "Token"} card`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold tracking-wide whitespace-nowrap text-[var(--color-text-100)]">
          {item._token ?? "—"}
        </div>
        <div className="text-[10px] text-[var(--color-text-400)] whitespace-nowrap max-w-[55%] overflow-hidden text-ellipsis">
          {fmtTime(item._ts)}
        </div>
      </div>

      {/* Price */}
      <div className="mt-1 text-2xl md:text-3xl font-bold leading-tight break-words text-white">
        {formatUSD(item.priceUSD ?? item.price)}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-white/10 p-2 min-w-0">
          <div className="text-[10px] uppercase text-[var(--color-text-400)]">
            Volume
          </div>
          <div className="font-semibold text-[var(--color-text-100)] whitespace-nowrap overflow-hidden text-ellipsis">
            {formatNumber(item.volumeUSD)}
          </div>
        </div>
        <div className="rounded-lg bg-white/10 p-2 min-w-0">
          <div className="text-[10px] uppercase text-[var(--color-text-400)]">
            TVL
          </div>
          <div className="font-semibold text-[var(--color-text-100)] whitespace-nowrap overflow-hidden text-ellipsis">
            {formatNumber(item.totalValueLockedUSD)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 text-[11px] text-[var(--color-text-400)] whitespace-nowrap overflow-hidden text-ellipsis">
        Updated • {fmtTime(item._ts)}
      </div>
    </motion.div>
  );
}

/* ---------- main ---------- */
export default function MarketInsights({
  csvPath = "/data/crypto_data.csv",
  maxCards = 15,
}) {
  const { data: rows, loading, error } = useCsv(csvPath);

  const items = useMemo(() => {
    const latest = latestByToken(rows);
    return latest
      .sort((a, b) => {
        const va = Number(a.volumeUSD) || 0;
        const vb = Number(b.volumeUSD) || 0;
        if (vb !== va) return vb - va;
        const pa = Number(a.priceUSD ?? a.price) || 0;
        const pb = Number(b.priceUSD ?? b.price) || 0;
        return pb - pa;
      })
      .slice(0, maxCards);
  }, [rows, maxCards]);

  const tokenOptions = useMemo(
    () =>
      items
        .map((i) => i._token)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [items]
  );

  const [selectedToken, setSelectedToken] = useState(tokenOptions[0] || "");
  const [highlightToken, setHighlightToken] = useState("");

  const scrollerRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!selectedToken && tokenOptions.length) {
      setSelectedToken(tokenOptions[0]);
    }
  }, [tokenOptions, selectedToken]);

  function scrollToToken(tok) {
    const el = cardRefs.current[tok];
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function handleSelect(e) {
    const tok = e.target.value;
    setSelectedToken(tok);
    setHighlightToken(tok);
    requestAnimationFrame(() => scrollToToken(tok));
    setTimeout(() => setHighlightToken(""), 2000);
  }

  function scrollByCards(dir = 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * dir, behavior: "smooth" });
  }

  const showArrows = !loading && items.length > 3;

  return (
    <section className="relative p-5 rounded-2xl border border-white/10 bg-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="text-xl font-bold text-[var(--color-text-100)]">
          Market Analysis
        </h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-[var(--color-text-400)] hidden sm:block">
            {loading ? "Loading…" : `${items.length} tokens`}
          </div>
          <select
            value={selectedToken}
            onChange={handleSelect}
            className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-[var(--color-text-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grad-1)] focus:border-transparent transition"
            disabled={loading || tokenOptions.length === 0}
          >
            {tokenOptions.map((tok) => (
              <option key={tok} value={tok}>
                {tok}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="text-sm text-[var(--color-danger)] mb-2">
          Error loading CSV: {String(error)}
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 min-w-[300px] h-56 bg-white/10 animate-pulse rounded-2xl scroll-mx-4"
                />
              ))
            : items.map((item) => (
                <div
                  key={item._token}
                  ref={(el) => (cardRefs.current[item._token] = el)}
                >
                  <TokenCard
                    item={item}
                    highlighted={item._token === highlightToken}
                  />
                </div>
              ))}
        </div>

        {showArrows && (
          <>
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByCards(-1)}
              className="hidden md:flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2
                         h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-[var(--color-text-100)] z-10"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByCards(1)}
              className="hidden md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2
                         h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-[var(--color-text-100)] z-10"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}
