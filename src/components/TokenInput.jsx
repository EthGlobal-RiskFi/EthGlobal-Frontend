// src/components/TokenInput.jsx
"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";

import sampleData from "../../public/sample.json";
import { useTheGraph } from "../lib/theGraph";
import { useWallet } from "../providers/WalletProvider";
import RiskMetricsHexagon from "./RiskMetricsHexagon";
import TokenBreakdownChart from "./TokenBreakDownChart";

export default function TokenInput() {
  const POST_URL = "http://10.125.9.225:5000/portfolio_metrics";

  const { address } = useWallet();
  const { getBalances } = useTheGraph();

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

    if (!address) {
      setInputState("invalid");
      setMessage(
        "Wallet not connected. Please connect your wallet and try again."
      );
      return;
    }

    setInputState("submitting");
    setMessage("Submitting job...");

    try {
      setMessage("Fetching token balances from The Graph...");
      const data = await getBalances({
        startTime: 1262304000,
        endTime: Math.floor(Date.now() / 1000),
        limit: 100,
        page: 1,
        owner: address,
      });
      console.log(data);
    } catch (graphErr) {
      console.error("Error fetching token balances from The Graph:", graphErr);
    }

    try {
      setMessage("Using sample data for analysis...");
      const urlToUse = POST_URL;

      if (!urlToUse) {
        setMessage("No POST endpoint configured; skipping POST.");
      } else if (!isValidHttpUrl(urlToUse)) {
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
          // const responseData = await resp.json();
          const responseData = {
            allocation_percent: {
              LINK: 5.793338369893404,
              SHIB: 0.00039032485545067763,
              USDC: 1.6949139422407637,
              USDT: 1.2646454567386949,
              WBTC: 91.2467119062717,
            },
            concentration_hhi: 0.8363997264729429,
            pnl_percent: 85.65250939926051,
            portfolio_var_99_percent: 22.46244826137623,
            sharpe_ratio: 1.1707353586348785,
            total_value_usd: 1500535.1815311962,
            var_99_per_ticker: {
              LINK: 5.8827,
              SHIB: 5.9406,
              USDC: 3.152,
              USDT: 6.9223,
              WBTC: 3.8948,
            },
            volatility: 0.36370160922422323,
          };
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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="p-6 rounded-2xl border border-white/10 bg-white/5 shadow-sm"
    >
      {/* Heading */}
      <div className="mb-3 text-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-100)]">
          Analyze your portfolio
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-400)]">
          One click → instant risk &amp; health snapshot using your wallet
          address.
        </p>
      </div>

      {/* Single-button form */}
      <form onSubmit={onAnalyze} className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={inputState === "submitting"}
            className={clsx(
              "px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm",
              inputState === "submitting"
                ? "bg-white/20 text-[var(--color-text-400)] cursor-wait"
                : "bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] text-white"
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

          <div id="token-help" className="text-right">
            <span
              className={clsx(
                "text-xs",
                inputState === "invalid"
                  ? "text-[var(--color-danger)]"
                  : "text-[var(--color-text-400)]"
              )}
            >
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
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            <RiskMetricsHexagon data={metricsData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mt-6"
          >
            <TokenBreakdownChart data={metricsData} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
