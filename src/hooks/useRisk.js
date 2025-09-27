// src/hooks/useRisk.js
"use client";

import { useEffect, useState } from "react";

/**
 * useRisk({ baseUrl, ticker, alpha, days })
 * - baseUrl: e.g. http://10.200.6.32:5000
 * - ticker: e.g. "AAVE"
 * - alpha: float 0..1 (e.g., 0.95)
 * - days: integer (e.g., 1)
 * Returns { data, loading, error, url }
 */
export default function useRisk({
  baseUrl,
  ticker,
  alpha = 0.9,
  days = 1,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(baseUrl));
  const [error, setError] = useState(null);

  const url =
    baseUrl &&
    `${baseUrl.replace(/\/+$/, "")}/risk?` +
      new URLSearchParams({
        ...(ticker ? { ticker } : {}),
        alpha: String(alpha),
        days: String(days),
      }).toString();

  useEffect(() => {
    if (!baseUrl) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [url, baseUrl]);

  return { data, loading, error, url };
}
