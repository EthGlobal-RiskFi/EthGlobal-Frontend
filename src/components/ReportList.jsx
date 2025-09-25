// src/components/ReportList.jsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReportListItem from "./ReportListItem";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

/**
 * Fetch a paginated list of reports from backend, fallback to mock.
 * Backend expected: GET /reports?limit=20&offset=0
 */
async function fetchReports({ limit = 20, offset = 0, q = "" } = {}) {
  const url = `${API_BASE}/reports?limit=${limit}&offset=${offset}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`bad response ${res.status}`);
    return await res.json();
  } catch (err) {
    // fallback mock data
    const total = 37;
    const items = Array.from({ length: Math.min(limit, Math.max(0, total - offset)) }).map((_, i) => {
      const idx = offset + i + 1;
      return {
        cid: `mock-report-${idx}`,
        title: `Mock Report #${idx}`,
        snippet: `Score ${Math.round(Math.random() * 40 + 50)} • ${["Low", "Medium", "High"][Math.floor(Math.random()*3)]} risk`,
      };
    });
    return { total, items };
  }
}

export default function ReportList({ initialLimit = 12 }) {
  const [limit, setLimit] = useState(initialLimit);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");

  const offset = page * limit;

  const queryKey = useMemo(() => ["reports", { limit, offset, q }], [limit, offset, q]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetchReports({ limit, offset, q });
      return res;
    },
    staleTime: 1000 * 60, // 1m
    cacheTime: 1000 * 60 * 5,
    retry: false,
  });

  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reports..."
            className="px-3 py-2 border rounded text-sm w-64"
          />
          <button onClick={() => { setPage(0); refetch(); }} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div>Total: <span className="font-medium text-gray-800 ml-1">{total}</span></div>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(0); }} className="px-2 py-1 border rounded text-sm">
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded divide-y">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-sm text-red-600">Failed to load reports. Try again.</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No reports found.</div>
        ) : (
          <div className="p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((r) => (
                <div key={r.cid} className="p-2">
                  <div className="p-3 rounded border hover:shadow-sm bg-white">
                    <ReportListItem cid={r.cid} title={r.title} />
                    {r.snippet && <div className="text-xs text-gray-500 mt-1">{r.snippet}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
