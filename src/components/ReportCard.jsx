// src/components/ReportCard.jsx
"use client";

import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReport, publishReport } from "../lib/api";
import { useAccount, useSignMessage } from "wagmi";
import clsx from "clsx";
import React from "react";

/* lazy-load VaRChart so initial report route stays fast */
const VaRChart = dynamic(() => import("./VaRChart"), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded" />,
});

/* --- small helpers --- */
function Progress({ value = 0 }) {
  const pct = Math.max(2, Math.min(100, Math.round(value || 0)));
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-2 rounded bg-gray-100 overflow-hidden">
          <div className={`${color} h-2`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="w-10 text-right text-xs text-gray-500">{pct}%</div>
    </div>
  );
}

function RiskCard({ r }) {
  const color = r.severity === "high" ? "text-red-600" : r.severity === "medium" ? "text-yellow-700" : "text-green-600";
  return (
    <div className="p-3 border rounded bg-white shadow-sm flex items-start gap-3">
      <div className="flex-1">
        <div className="font-medium text-sm">{r.title}</div>
        {r.detail && <div className="text-xs text-gray-500 mt-1">{r.detail}</div>}
      </div>
      <div className={`text-xs font-semibold ${color}`}>{(r.severity || "").toUpperCase()}</div>
    </div>
  );
}

/* --- main component --- */
export default function ReportCard({ cid }) {
  const qc = useQueryClient();
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage();

  const { data: report, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["report", cid],
    queryFn: async () => await getReport(cid),
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
    retry: false,
  });

  async function handlePublish() {
    if (!report) return;
    if (!isConnected) {
      alert("Connect wallet to publish.");
      return;
    }

    try {
      const message = `Publish report ${cid} - attestation: ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });

      // optimistic update
      qc.setQueryData({ queryKey: ["report", cid], updater: (old) => ({ ...(old || {}), published: true }) });

      const res = await publishReport({ cid, address, signature });

      qc.setQueryData({
        queryKey: ["report", cid],
        updater: (old) => ({ ...(old || {}), published: true, publishedTx: res.txHash ?? res.tx }),
      });

      alert("Published ✓" + (res.txHash ? ` tx: ${res.txHash}` : ""));
    } catch (err) {
      qc.invalidateQueries({ queryKey: ["report", cid] });
      alert("Publish failed: " + (err?.message ?? String(err)));
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg border bg-white shadow-sm animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-gray-100 rounded" />
          <div className="h-36 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 rounded-lg border bg-white shadow-sm">
        <div className="text-red-600 font-semibold">Error loading report</div>
        <div className="text-sm text-gray-600 mt-2">{error?.message ?? String(error)}</div>
        <div className="mt-3">
          <button onClick={() => refetch()} className="px-3 py-1 border rounded text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pillars = report?.pillars || {};
  const topRisks = report?.topRisks || [];

  return (
    <div className="p-6 rounded-lg border bg-white shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs text-gray-400">Report ID</div>
          <div className="text-lg font-semibold tracking-tight break-all">{cid}</div>
          <div className="text-xs text-gray-400 mt-1">
            Generated: {new Date(report?.generatedAt ?? report?.timestamp ?? Date.now()).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-extrabold">{report?.score ?? "-"}</div>
            <div className="text-xs text-gray-500">Overall</div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <button onClick={() => navigator.clipboard.writeText(cid)} className="px-3 py-1 border rounded text-sm bg-white">
              Copy ID
            </button>

            <button
              onClick={handlePublish}
              disabled={report?.published || signLoading || isFetching}
              className={clsx(
                "px-3 py-1 rounded text-sm",
                report?.published ? "bg-gray-200 text-gray-600" : "bg-indigo-600 text-white"
              )}
            >
              {report?.published ? "Published" : signLoading || isFetching ? "Processing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700">{report?.label ?? ""}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="font-semibold mb-3">Pillars</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Fundamentals</div>
                <div className="text-xs text-gray-500">{pillars.fundamentals ?? 0}%</div>
              </div>
              <Progress value={pillars.fundamentals} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Microstructure</div>
                <div className="text-xs text-gray-500">{pillars.microstructure ?? 0}%</div>
              </div>
              <Progress value={pillars.microstructure} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Sentiment</div>
                <div className="text-xs text-gray-500">{pillars.sentiment ?? 0}%</div>
              </div>
              <Progress value={pillars.sentiment} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <div>Technical</div>
                <div className="text-xs text-gray-500">{pillars.technical ?? 0}%</div>
              </div>
              <Progress value={pillars.technical} />
            </div>
          </div>

          {/* lazy-load the VaRChart chunk */}
          {report?.vae ? <div className="mt-4"><VaRChart vae={report.vae} /></div> : null}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Top risks</div>
            <div className="text-xs text-gray-400">Severity</div>
          </div>

          <div className="space-y-3">
            {topRisks.length === 0 ? (
              <div className="text-sm text-gray-500">No risks reported.</div>
            ) : (
              topRisks.map((r) => <RiskCard key={r.id} r={r} />)
            )}
          </div>

          <div className="mt-4">
            <button
              className="px-3 py-1 text-sm border rounded"
              onClick={() => {
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `report-${cid}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
