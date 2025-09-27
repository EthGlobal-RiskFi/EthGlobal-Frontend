// src/components/ReportCard.jsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { getReport, publishReport } from "../lib/api";
import { useWallet } from "../providers/WalletProvider";

/* lazy-load VaRChart so initial report route stays fast */
const VaRChart = dynamic(() => import("./VaRChart"), {
  ssr: false,
  loading: () => (
    <div className="h-40 rounded-lg bg-white/10 animate-pulse" />
  ),
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
        await connectWallet();
        setPublishing(false);
        return;
      }

      const message = `Publish report ${cid}`;
      const signature = await signer.signMessage(message);

      await publishReport(cid, { signature });

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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="report-card p-5 rounded-2xl border border-white/10 bg-white/5 shadow-sm hover:-translate-y-0.5 transition-transform"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-100)]">
          Report {cid}
        </h3>
        <div className="text-sm text-[var(--color-text-400)]">
          {report?.status ?? "Unknown status"}
        </div>
      </div>

      <div className="mt-4">
        {loadingReport ? (
          <div className="h-40 rounded-lg bg-white/10 animate-pulse" />
        ) : error ? (
          <div className="text-sm text-[var(--color-danger)]">{error}</div>
        ) : report ? (
          <VaRChart data={report.chartData} />
        ) : (
          <div className="text-sm text-[var(--color-text-400)]">
            No report data available.
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignAndPublish}
            disabled={publishing}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] text-white text-sm font-medium shadow-sm disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Sign & Publish"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={connectWallet}
            className="px-4 py-2 rounded-lg bg-[var(--color-success)] text-black text-sm font-medium shadow-sm"
          >
            Connect Wallet to Publish
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
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
          className="px-4 py-2 rounded-lg border border-white/10 bg-white/10 text-sm text-[var(--color-text-100)] hover:bg-white/20 transition"
        >
          Refresh
        </motion.button>
      </div>
    </motion.div>
  );
}
