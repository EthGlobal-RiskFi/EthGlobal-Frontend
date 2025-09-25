// src/lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      // try to parse backend error message
      const text = await res.text();
      throw new Error(text || `bad response: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    throw e;
  }
}

function sleep(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * POST /analyze
 * Request body: { tokenAddress, chainId }
 * Returns: { jobId }
 */
export async function postAnalyze(tokenAddress, chainId = 1) {
  const url = `${API_BASE}/analyze`;
  try {
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenAddress, chainId }),
    });
  } catch (e) {
    console.warn("Backend not available, falling back to mock postAnalyze:", e.message);
    await sleep(700);
    return { jobId: `mock-job-${Date.now()}` };
  }
}

/**
 * GET /jobs/:jobId
 * Returns job status & progress and reportCid when done
 */
export async function getJob(jobId) {
  const url = `${API_BASE}/jobs/${jobId}`;
  try {
    return await safeFetch(url);
  } catch (e) {
    console.warn("Backend not available, falling back to mock getJob:", e.message);
    await sleep(500);
    return {
      id: jobId,
      status: "done",
      progress: {
        fundamentals: 0.88,
        microstructure: 0.72,
        sentiment: 0.45,
        technical: 0.60,
      },
      reportCid: "mock-report-cid",
    };
  }
}

/**
 * GET /reports/:cid
 * Returns full report object.
 */
export async function getReport(cid) {
  const url = `${API_BASE}/reports/${cid}`;
  try {
    return await safeFetch(url);
  } catch (e) {
    console.warn("Backend not available, falling back to mock getReport:", e.message);
    await sleep(300);
    return {
      cid,
      token: "0xMockTokenAddress",
      score: 62,
      label: "Yellow",
      pillars: {
        fundamentals: 65,
        microstructure: 70,
        sentiment: 50,
        technical: 55,
      },
      topRisks: [
        { id: 1, title: "Owner can mint tokens", severity: "high", detail: "Owner-controlled mint function present." },
        { id: 2, title: "High holder concentration", severity: "medium", detail: "Top holders control >40% supply." },
        { id: 3, title: "Thin liquidity in major pools", severity: "medium", detail: "Low depth in main DEX pool." },
      ],
      vae: { VaR95: -0.28, VaR99: -0.45, ES95: -0.32 },
      signature: "0xMOCKSIGNATURE",
      timestamp: Date.now(),
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Convenience alias for older code expecting fetchReport(...)
 */
export const fetchReport = getReport;

/**
 * POST /publish
 * Accepts either:
 *  - publishReport({ cid, address, signature })
 *  - publishReport(cid, address, signature)
 *
 * Returns { txHash, explorerUrl } or a fallback mock object.
 */
export async function publishReport(arg1, arg2, arg3) {
  const url = `${API_BASE}/publish`;

  // Normalize payload
  let payload;
  if (typeof arg1 === "object" && arg1 !== null && arg1.cid) {
    payload = arg1;
  } else {
    // assume (cid, address, signature)
    payload = { cid: arg1, address: arg2, signature: arg3 };
  }

  try {
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("Backend not available, falling back to mock publishReport:", e.message);
    await sleep(400);
    return { txHash: "0xMOCKTXHASH", explorerUrl: "#" };
  }
}
