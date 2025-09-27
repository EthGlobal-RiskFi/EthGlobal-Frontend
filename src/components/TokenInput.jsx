// src/components/TokenInput.jsx
"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";

import sampleData from "../../public/sample.json";
import { useAnalyzeToken } from "../hooks/useAnalyzeToken";
import { useTheGraph } from "../lib/theGraph";
import { useWallet } from "../providers/WalletProvider";
import RiskMetricsHexagon from "./RiskMetricsHexagon";
import TokenBreakdownChart from "./TokenBreakDownChart";

export default function TokenInput() {
  // --- config ---
  const POST_URL = "http://10.125.9.225:5000/portfolio_metrics";

  // --- hooks ---
  const { address } = useWallet(); 
  const { getBalances } = useTheGraph();

  // --- local UI state ---
  const [inputState, setInputState] = useState("idle"); // idle|invalid|submitting
  const [message, setMessage] = useState("");
  const [metricsData, setMetricsData] = useState(null);

  function isValidHttpUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function onAnalyze(e) {
    e?.preventDefault();
    setMessage("");
    setMetricsData(null);

    // ---- NEW: Use connected wallet address and gate if missing ----
    if (!address) {
      setInputState("invalid");
      setMessage("Wallet not connected. Please connect your wallet and try again.");
      return;
    }

    // Keep your original flow & messages
    setInputState("submitting");
    setMessage("Submitting job...");

    // 1) Fetch balances from The Graph (unchanged, just no input address)
    try {
      setMessage("Fetching token balances from The Graph...");
      await getBalances({
        startTime: 1262304000,                   // Jan 1, 2010
        endTime: Math.floor(Date.now() / 1000),  // now
        limit: 100,
        page: 1,
        // if your hook accepts owner, you can pass it:
        owner: address,
      });
      // console.log is left as-is per your request to keep behavior
      // console.log("The Graph data:", JSON.stringify(graphData, null, 2));
    } catch (graphErr) {
      console.error("Error fetching token balances from The Graph:", graphErr);
    }

    // 2) POST sample data to your endpoint (unchanged)
    try {
      setMessage("Using sample data for analysis...");

      const urlToUse = POST_URL;
      if (!urlToUse) {
        console.warn("No POST_URL configured; skipping POST of balances.");
        setMessage("No POST endpoint configured; skipping POST.");
      } else if (!isValidHttpUrl(urlToUse)) {
        console.warn("Configured POST_URL is invalid, skipping POST:", urlToUse);
        setMessage("Configured POST endpoint is invalid; skipping POST.");
      } else {
        setMessage(`Posting sample data to ${urlToUse}...`);
        const resp = await fetch(urlToUse, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sampleData),
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(() => "");
          console.error("POST failed:", resp.status, txt);
          setMessage(`Failed to POST balances: HTTP ${resp.status}`);
        } else {
          const responseData = await resp.json();
          console.log("Received response data:", responseData);
          setMetricsData(responseData);
          setMessage("Risk metrics calculated successfully.");
        }
      }
      setInputState("idle");
    } catch (err) {
      console.error("Error using/posting sample data:", err);
      setInputState("idle");
      setMessage("Error using/posting sample data for analysis...");
    }

  }

  return (
    <motion.div initial="init" animate="anim" className="bg-white p-5 rounded shadow-sm">
      {/* Heading */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold">Analyze your portfolio</h3>
        <p className="text-sm text-gray-600">
          One click → instant risk &amp; health snapshot using your wallet address.
        </p>
      </div>

      {/* Single-button form */}
      <form onSubmit={onAnalyze} className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex gap-2">
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={inputState === "submitting"}
              className={clsx(
                "px-4 py-2 rounded text-white",
                inputState === "submitting"
                  ? "bg-indigo-300 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {inputState === "submitting" ? (
                <span className="inline-flex items-center gap-2">
                  <FiLoader className="animate-spin" /> Analyzing...
                </span>
              ) : (
                "Analyze your portfolio"
              )}
            </motion.button>
          </div>

          <div id="token-help" className="text-right">
            <span className={clsx(inputState === "invalid" && "text-red-600")}>
              {message || (address ? "Ready" : "Wallet not connected")}
            </span>
          </div>
        </div>
      </form>

      {/* Results */}
      {metricsData && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <RiskMetricsHexagon data={metricsData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <TokenBreakdownChart data={metricsData} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
