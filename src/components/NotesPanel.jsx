"use client";
import { useEffect, useState } from "react";

export default function NotesPanel({ storageKey = "cipher-notes" }) {
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey) || "";
      setText(v);
    } catch {}
  }, [storageKey]);

  function save() {
    localStorage.setItem(storageKey, text);
    alert("Saved locally (demo)");
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium">Notes</h4>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full border p-2 rounded mt-2" />
      <div className="mt-2 text-right">
        <button onClick={save} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}
