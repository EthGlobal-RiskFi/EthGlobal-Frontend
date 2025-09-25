"use client";
import { useState } from "react";

export default function ChatBotPlaceholder() {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([]);

  function send() {
    if (!msg) return;
    setHistory((h) => [...h, { from: "user", text: msg }]);
    setMsg("");
    setTimeout(() => {
      setHistory((h) => [...h, { from: "bot", text: "This is a canned reply (demo)." }]);
    }, 600);
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium mb-2">ChatBot</h4>
      <div className="h-36 overflow-auto bg-gray-50 p-2 rounded">
        {history.map((m, i) => (
          <div key={i} className={`text-sm ${m.from === "user" ? "text-right" : "text-left"}`}>{m.text}</div>
        ))}
        {!history.length && <div className="text-sm text-gray-500">Ask the bot about tokens (demo).</div>}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} className="flex-1 border px-2 py-1 rounded" />
        <button onClick={send} className="px-3 py-1 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}
