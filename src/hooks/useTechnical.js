// src/hooks/useTechnical.js
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * useTechnical({ baseUrl, ticker, days, alpha })
 * Returns { data, loading, error, url }
 */
export default function useTechnical({
  baseUrl,
  ticker,
  days = 30,
  alpha = 0.9,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(baseUrl));
  const [error, setError] = useState(null);

  const url = useMemo(() => {
    if (!baseUrl) return null;
    const qs = new URLSearchParams({
      ...(ticker ? { ticker } : {}),
      days: String(days),
      alpha: String(alpha),
    }).toString();
    return `${baseUrl.replace(/\/+$/, "")}/technical?${qs}`;
  }, [baseUrl, ticker, days, alpha]);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error, url };
}
