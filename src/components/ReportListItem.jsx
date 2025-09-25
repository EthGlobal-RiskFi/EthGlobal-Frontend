// src/components/ReportListItem.jsx
"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getReport } from "../lib/api";
import { useRouter } from "next/navigation";

/**
 * ReportListItem
 * - Prefetches on hover and pointerdown (fast).
 * - Navigates immediately on click.
 *
 * Props:
 *  - cid: string
 *  - title: string (optional)
 */
export default function ReportListItem({ cid, title }) {
  const qc = useQueryClient();
  const router = useRouter();

  const prefetch = useCallback(() => {
    qc.prefetchQuery({
      queryKey: ["report", cid],
      queryFn: async () => {
        return await getReport(cid);
      },
      staleTime: 1000 * 60 * 2,
      cacheTime: 1000 * 60 * 10,
    });
  }, [qc, cid]);

  const handlePointerDown = useCallback(() => {
    prefetch();
  }, [prefetch]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      router.push(`/report/${cid}`);
    },
    [router, cid]
  );

  return (
    <a
      href={`/report/${cid}`}
      onMouseEnter={() => prefetch()}
      onFocus={() => prefetch()}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="block p-3 rounded hover:bg-gray-50 transition"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-indigo-700">{title ?? cid}</div>
        <div className="text-xs text-gray-400">Open →</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">Click to view report</div>
    </a>
  );
}
