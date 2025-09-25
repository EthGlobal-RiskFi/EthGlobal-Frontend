"use client";
import { useEffect, useRef, useState } from "react";
import { postAnalyze, getJob, getReport } from "../lib/api";

export function useAnalyzeToken(pollInterval = 1500) {
  const [status, setStatus] = useState("idle"); // idle|running|done|error
  const [job, setJob] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function startAnalyze(tokenAddress, chainId = 1) {
    setError(null);
    setReport(null);
    setJob(null);
    setStatus("running");
    try {
      const { jobId } = await postAnalyze(tokenAddress, chainId);
      setJob({ id: jobId, status: "submitted" });

      pollRef.current = setInterval(async () => {
        try {
          const jobObj = await getJob(jobId);
          setJob(jobObj);

          if (jobObj.status === "done" && jobObj.reportCid) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setStatus("done");
            const r = await getReport(jobObj.reportCid);
            setReport(r);
          } else if (jobObj.status === "failed") {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setStatus("error");
            setError(jobObj.error || "Job failed");
          } else {
            // still running
          }
        } catch (e) {
          console.error("poll error", e);
          // continue polling; do not throw immediate error for intermittent network
        }
      }, pollInterval);
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
      setStatus("idle");
    }
  }

  return { status, job, report, error, startAnalyze, stopPolling };
}
