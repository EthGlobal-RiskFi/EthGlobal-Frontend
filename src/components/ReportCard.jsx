// src/components/ReportCard.jsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { getReport, publishReport } from "../lib/api";
import { useWallet } from "../providers/WalletProvider";

/* lazy-load VaRChart so initial report route stays fast */
const VaRChart = dynamic(() => import("./VaRChart"), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded" />,
});

export default function ReportCard({ cid }) {
  const { address, getSigner, connectWallet } = useWallet();
  const isConnected = !!address;

  const [report, setReport] = React.useState(null);
  const [loadingReport, setLoadingReport] = React.useState(true);
  const [publishing, setPublishing] = React.useState(false);
  const [error, setError] = React.useState(null);

  // fetch report on mount and when cid changes
  React.useEffect(() => {
    let mounted = true;
    setLoadingReport(true);
    setError(null);

    getReport(cid)
      .then((r) => {
        if (!mounted) return;
        setReport(r);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("getReport error", err);
        setError("Failed to load report.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingReport(false);
      });

    return () => {
      mounted = false;
    };
  }, [cid]);

  async function handleSignAndPublish() {
    setError(null);
    setPublishing(true);
    try {
      const signer = await getSigner();
      if (!signer) {
        // prompt user to connect
        await connectWallet();
        setPublishing(false);
        return;
      }

      // create a message to sign — adapt to your backend expectations
      const message = `Publish report ${cid}`;
      const signature = await signer.signMessage(message);

      // call your backend publish endpoint
      await publishReport(cid, { signature });

      // re-fetch the updated report
      setLoadingReport(true);
      const updated = await getReport(cid);
      setReport(updated);
    } catch (err) {
      console.error("sign/publish error:", err);
      setError(err?.message ? String(err.message) : "Publish failed");
    } finally {
      setPublishing(false);
      setLoadingReport(false);
    }
  }

  return (
    <div className="report-card p-4 border rounded-md bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Report {cid}</h3>
        <div className="text-sm text-gray-500">
          {report?.status ?? "Unknown status"}
        </div>
      </div>

      <div className="mt-4">
        {loadingReport ? (
          <div className="h-40 bg-gray-50 animate-pulse rounded" />
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : report ? (
          <VaRChart data={report.chartData} />
        ) : (
          <div className="text-sm text-gray-600">No report data available.</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <button
            onClick={handleSignAndPublish}
            disabled={publishing}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Sign & Publish"}
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="px-3 py-1 border rounded"
          >
            Connect Wallet to Publish
          </button>
        )}

        <button
          onClick={async () => {
            setLoadingReport(true);
            try {
              const latest = await getReport(cid);
              setReport(latest);
              setError(null);
            } catch (err) {
              console.error("refresh error", err);
              setError("Refresh failed");
            } finally {
              setLoadingReport(false);
            }
          }}
          className="px-3 py-1 border rounded text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
