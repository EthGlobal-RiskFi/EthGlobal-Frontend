// src/hooks/useCsv.js
"use client";

import { useEffect, useState } from "react";

/**
 * Loads and parses a CSV (client-side) using PapaParse.
 * Returns { data: array of rows (objects), loading, error }
 */
export default function useCsv(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const Papa = (await import("papaparse")).default;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        if (!cancelled) setData(parsed.data || []);
        if (parsed.errors?.length) {
          // surface first CSV parse error if any (non-fatal)
          console.warn("CSV parse errors:", parsed.errors);
        }
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
  }, [url]);

  return { data, loading, error };
}
