"use client";
import { useState } from "react";

export default function TeamShare() {
  const [link] = useState(() => `${typeof window !== "undefined" ? window.location.href : ""}share`);
  const [email, setEmail] = useState("");

  function onCopy() {
    if (typeof navigator !== "undefined") navigator.clipboard.writeText(link);
    alert("Link copied to clipboard (demo)");
  }

  function onInvite() {
    alert(`Invite sent to ${email} (demo)`);
    setEmail("");
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium">Share / Team access</h4>
      <div className="mt-2 text-sm">
        <div className="flex gap-2">
          <input className="flex-1 border px-2 py-1 rounded" value={link} readOnly />
          <button onClick={onCopy} className="px-3 py-1 border rounded">Copy</button>
        </div>

        <div className="mt-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite by email" className="w-full border px-2 py-1 rounded" />
          <div className="mt-2 flex justify-end">
            <button onClick={onInvite} className="px-3 py-1 bg-indigo-600 text-white rounded">Invite</button>
          </div>
        </div>
      </div>
    </div>
  );
}
