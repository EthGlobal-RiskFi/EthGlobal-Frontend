"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAddress, getAddress } from "ethers";
import { useAnalyzeToken } from "../hooks/useAnalyzeToken";
import Link from "next/link";
import { FiClipboard, FiCheck, FiLoader, FiAlertCircle } from "react-icons/fi";
import clsx from "clsx";

/**
 * TokenInput component (fixed)
 * - Validates using regex + ethers
 * - Handles clipboard paste
 * - Works with example address (no invalid format bug)
 */

export default function TokenInput() {
  const [raw, setRaw] = useState("");
  const [address, setAddress] = useState("");
  const [inputState, setInputState] = useState("idle"); // idle|valid|invalid|submitting
  const [message, setMessage] = useState("");
  const [example] = useState("0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"); // SHIB

  const { status, job, report, error, startAnalyze } = useAnalyzeToken();

  useEffect(() => {
    if (status === "running") {
      setInputState("submitting");
      setMessage("Job started...");
    } else if (status === "done" && report) {
      setInputState("idle");
      setMessage("Report ready");
    } else if (status === "error") {
      setInputState("idle");
      if (error) setMessage(error);
    }
  }, [status, report, error]);

  // Robust validation
  function validateAndNormalize(value) {
    let rawVal = (value || "").trim();
    rawVal = rawVal.replace(/[^\x20-\x7E]/g, "");

    const match = rawVal.match(/0x[a-fA-F0-9]{40}/);
    if (!match) {
      return {
        ok: false,
        reason: "Invalid format: must be 0x followed by 40 hex characters.",
      };
    }
    let candidate = match[0];

    try {
      if (isAddress(candidate)) {
        const normalized = getAddress(candidate);
        return { ok: true, normalized };
      } else {
        return { ok: false, reason: "Invalid Ethereum address." };
      }
    } catch {
      return { ok: false, reason: "Invalid address format." };
    }
  }

  async function onPaste() {
    try {
      const text = await navigator.clipboard.readText();
      setRaw(text || "");
      const result = validateAndNormalize(text || "");
      if (result.ok) {
        setAddress(result.normalized);
        setInputState("valid");
        setMessage("Address looks valid.");
      } else {
        setAddress("");
        setInputState("invalid");
        setMessage(result.reason);
      }
    } catch {
      setMessage("Clipboard access denied.");
    }
  }

  function onChange(e) {
    const v = e.target.value;
    setRaw(v);
    setAddress("");
    setMessage("");
    setInputState("idle");
  }

  function onUseExample() {
    const cleaned = example.trim().slice(0, 42);
    console.log(
      "Cleaned example:",
      JSON.stringify(cleaned),
      "len:",
      cleaned.length
    );

    setRaw(cleaned);
    const res = validateAndNormalize(cleaned);
    if (res.ok) {
      setAddress(res.normalized);
      setInputState("valid");
      setMessage("Example address loaded.");
    } else {
      setInputState("invalid");
      setMessage(res.reason);
    }
  }

  async function onAnalyze(e) {
    e?.preventDefault();
    setMessage("");
    const res = validateAndNormalize(raw);
    if (!res.ok) {
      setInputState("invalid");
      setMessage(res.reason);
      return;
    }
    setAddress(res.normalized);
    setInputState("submitting");
    setMessage("Submitting job...");
    try {
      await startAnalyze(res.normalized, 1);
    } catch (err) {
      setInputState("idle");
      setMessage(err?.message || "Failed to start analysis.");
    }
  }

  const shake = {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45 },
  };

  return (
    <motion.div
      initial="init"
      animate="anim"
      className="bg-white p-5 rounded shadow-sm"
    >
      <form onSubmit={onAnalyze} className="space-y-3">
        <label htmlFor="tokenAddress" className="block text-sm font-medium">
          ERC-20 token address
        </label>

        <div className="flex gap-2">
          <motion.div
            key={inputState}
            animate={inputState === "invalid" ? shake : undefined}
            className={clsx("flex-1")}
          >
            <input
              id="tokenAddress"
              name="tokenAddress"
              value={raw}
              onChange={onChange}
              placeholder="0xabc... (paste token contract address)"
              className={clsx(
                "w-full px-3 py-2 rounded border focus:outline-none",
                inputState === "invalid"
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-indigo-100"
              )}
              aria-invalid={inputState === "invalid"}
              aria-describedby="token-help"
            />
          </motion.div>

          <button
            type="button"
            onClick={onPaste}
            title="Paste from clipboard"
            className="px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100"
          >
            <FiClipboard />
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div id="token-help">
            {inputState === "invalid" ? (
              <span className="flex items-center gap-1 text-red-600">
                <FiAlertCircle /> {message || "Invalid address"}
              </span>
            ) : inputState === "submitting" ? (
              <span className="flex items-center gap-2">
                <FiLoader className="animate-spin" />{" "}
                {message || "Submitting job..."}
              </span>
            ) : (
              <span>{message || "Paste token address and click Analyze"}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onUseExample}
              className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
            >
              Use example
            </button>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={inputState === "submitting" || status === "running"}
              className={clsx(
                "px-4 py-2 rounded text-white",
                inputState === "submitting" || status === "running"
                  ? "bg-indigo-300 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {inputState === "submitting" || status === "running" ? (
                <span className="inline-flex items-center gap-2">
                  <FiLoader className="animate-spin" /> Analyzing...
                </span>
              ) : (
                "Analyze"
              )}
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {job?.id && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-3 rounded border bg-gray-50 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Job ID:</span>
              <span className="font-mono text-sm">{job.id}</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {report ? (
                <>
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="text-green-600 p-1 rounded-full bg-green-50"
                  >
                    <FiCheck />
                  </motion.div>
                  <div>
                    <div className="text-xs text-gray-500">Report ready</div>
                    <Link href={`/report/${report.cid || report.cid}`} className="text-sm text-indigo-600">
                      Open report
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-indigo-600 p-1 rounded-full bg-indigo-50">
                    <FiLoader className="animate-spin" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">
                      Analysis running
                    </div>
                    <div className="text-sm">
                      Progress will appear in JobStatus panel.
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
