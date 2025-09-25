"use client";
import { useState } from "react";
import { publishReport } from "../lib/api";

export default function PublishCard({ cid }) {
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState(null);

  async function onPublish() {
    setLoading(true);
    try {
      const res = await publishReport({ cid });
      setTx(res.txHash || res.tx);
    } catch (e) {
      alert("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium">Publish report</h4>
      <p className="text-sm text-gray-600">Write the report to the registry (demo/stub).</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onPublish} className="px-3 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
          {loading ? "Publishing..." : "Publish on-chain"}
        </button>
        {tx && <a className="text-sm text-gray-600">Tx: {tx}</a>}
      </div>
    </div>
  );
}
