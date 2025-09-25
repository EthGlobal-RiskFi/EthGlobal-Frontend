"use client";
import { useEffect, useState } from "react";
import { getReport } from "../lib/api";

export default function ReportCard({ cid }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!cid) return;
    (async () => {
      const r = await getReport(cid);
      setReport(r);
    })();
  }, [cid]);

  if (!report) {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <div>Loading report...</div>
      </div>
    );
  }

  const score = report.score ?? 0;
  const label = score >= 70 ? "Green" : score >= 40 ? "Yellow" : "Red";
  const color = score >= 70 ? "bg-green-50 text-green-800" : score >= 40 ? "bg-yellow-50 text-yellow-800" : "bg-red-50 text-red-800";

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className={`inline-block px-3 py-1 rounded ${color} font-semibold`} >
        {label} — {score}/100
      </div>

      <div className="mt-3 space-y-2">
        <div className="text-sm">Pillars:</div>
        <ul className="text-sm list-disc pl-5">
          <li>Fundamentals: {report.pillars?.fundamentals ?? "-"}</li>
          <li>Microstructure: {report.pillars?.microstructure ?? "-"}</li>
          <li>Sentiment: {report.pillars?.sentiment ?? "-"}</li>
          <li>Technical: {report.pillars?.technical ?? "-"}</li>
        </ul>
      </div>

      <div className="mt-3 flex gap-2">
        <a className="text-sm px-3 py-1 border rounded">Download JSON</a>
        <a className="text-sm px-3 py-1 border rounded">Download PDF</a>
        <div className="text-sm text-gray-500 ml-auto">CID: {report.cid}</div>
      </div>
    </div>
  );
}
