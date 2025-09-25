const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    // propagate error to caller to let them fallback on mock
    throw e;
  }
}

function sleep(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function postAnalyze(tokenAddress, chainId = 1) {
  const url = `${API_BASE}/analyze`;
  try {
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenAddress, chainId }),
    });
  } catch (e) {
    // fallback mock
    await sleep(700);
    return { jobId: `mock-job-${Date.now()}` };
  }
}

export async function getJob(jobId) {
  const url = `${API_BASE}/jobs/${jobId}`;
  try {
    return await safeFetch(url);
  } catch (e) {
    // fallback mock — quick done status with cid
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

export async function getReport(cid) {
  const url = `${API_BASE}/reports/${cid}`;
  try {
    return await safeFetch(url);
  } catch (e) {
    // fallback mock report
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
        { id: 1, title: "Owner can mint tokens", severity: "high" },
        { id: 2, title: "High holder concentration", severity: "medium" },
        { id: 3, title: "Thin liquidity in major pools", severity: "medium" },
      ],
      vae: { VaR95: -0.28, VaR99: -0.45, ES95: -0.32 },
      signature: "0xMOCKSIGNATURE",
      timestamp: Date.now(),
    };
  }
}

export async function publishReport(payload) {
  const url = `${API_BASE}/publish`;
  try {
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    await sleep(400);
    return { txHash: "0xMOCKTXHASH", explorerUrl: "#" };
  }
}
