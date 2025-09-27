"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBotPlaceholder() {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  function send() {
    if (!msg.trim()) return;
    const text = msg.trim();
    setHistory((h) => [...h, { from: "user", text }]);
    setMsg("");
    // demo reply
    setTimeout(() => {
      setHistory((h) => [
        ...h,
        { from: "bot", text: "This is a canned reply (demo)." },
      ]);
    }, 600);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <section className="rounded-2xl p-4 shadow-sm border border-white/10 bg-white/5">
      <h4 className="font-medium mb-3 text-[var(--color-text-100)]">ChatBot</h4>

      {/* Chat history (white card) */}
      <div className="h-40 overflow-auto rounded-xl border border-black/10 bg-white/90 p-3">
        {history.length ? (
          <div className="space-y-2">
            {history.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "user"
                    ? "text-right text-slate-900"
                    : "text-left text-slate-800"
                }
              >
                <span
                  className={
                    m.from === "user"
                      ? "inline-block max-w-[85%] rounded-lg bg-slate-200 px-3 py-1"
                      : "inline-block max-w-[85%] rounded-lg bg-white px-3 py-1 border border-black/10"
                  }
                >
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Ask the bot about tokens (demo).
          </div>
        )}
      </div>

      {/* Input row (white input, blends with glassy shell) */}
      <div className="mt-3 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 rounded-xl bg-white/90 border border-black/10 px-3 py-2 text-sm text-slate-900
                     placeholder:text-slate-500 focus:outline-hidden focus:ring-3 focus:ring-[var(--color-grad-2)]/30"
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)]
                     text-white text-sm font-medium shadow-sm hover:opacity-95 active:scale-[0.98] transition"
        >
          Send
        </button>
      </div>
    </section>
  );
}
