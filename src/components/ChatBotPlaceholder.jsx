// src/components/ChatBotPlaceholder.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const REMOTE_BOT_URL = "https://fd42725aae43.ngrok-free.app/query"; // update if needed
const REQUEST_TIMEOUT_MS = 120_000; // 120 seconds

export default function ChatBotPlaceholder() {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null); // chat scrollable container
  const inputRef = useRef(null);
  const abortRef = useRef(null); // store AbortController
  const timeoutRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    try {
      inputRef.current?.focus?.({ preventScroll: true });
    } catch {}
  }, []);

  // Scroll the chat container to bottom
  function scrollChatToBottom(behavior = "smooth") {
    const c = containerRef.current;
    if (!c) return;
    try {
      if (behavior === "instant") {
        c.scrollTop = c.scrollHeight;
      } else {
        c.scrollTo({ top: c.scrollHeight, behavior });
      }
    } catch {
      c.scrollTop = c.scrollHeight;
    }
  }

  // Add message + scroll
  function pushMessage(from, text) {
    setHistory((h) => [...h, { from, text }]);
    requestAnimationFrame(() => scrollChatToBottom("smooth"));
  }

  async function send() {
    const text = (msg || "").trim();
    if (!text || loading) return;

    setError("");
    setMsg("");
    setLoading(true);

    pushMessage("user", text);
    try {
      inputRef.current?.focus?.({ preventScroll: true });
    } catch {}

    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
    }
    const ac = new AbortController();
    abortRef.current = ac;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      try {
        ac.abort();
      } catch {}
      pushMessage("bot", "Bot not responding. Please try again later.");
      setError("Request timed out after 120s.");
      setLoading(false);
    }, REQUEST_TIMEOUT_MS);

    try {
      const resp = await fetch(REMOTE_BOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
        mode: "cors",
        signal: ac.signal,
      });

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;

      if (!resp.ok) {
        throw new Error(`Remote error ${resp.status} ${resp.statusText}`);
      }

      const data = await resp.json();
      const answer =
        data?.answer ??
        data?.answerText ??
        data?.result ??
        data?.message ??
        data?.reply ??
        null;

      if (!answer) {
        pushMessage("bot", "Sorry — the bot returned an empty response.");
      } else {
        pushMessage("bot", String(answer));
      }
    } catch (e) {
      if (e?.name === "AbortError") {
        // timeout already handled
      } else if (String(e).includes("Failed to fetch")) {
        pushMessage("bot", "Sorry — the bot request failed. Try again later.");
        setError(
          "Failed to fetch — most likely a CORS issue. " +
            "The server must allow `Access-Control-Allow-Origin: *`."
        );
      } else {
        console.error("Chatbot error:", e);
        pushMessage("bot", "Sorry — the bot request failed. Try again later.");
        setError(e?.message || String(e));
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
      try {
        inputRef.current?.focus?.({ preventScroll: true });
      } catch {}
      requestAnimationFrame(() => scrollChatToBottom("instant"));
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) send();
    }
  }

  return (
    <section className="rounded-2xl p-4 shadow-sm border border-white/10 bg-white/5 max-w-full">
      <h4 className="font-medium mb-3 text-[var(--color-text-100)]">ChatBot</h4>

      {/* Chat history area */}
      <div
        ref={containerRef}
        className="h-56 overflow-auto rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm p-4"
      >
        {history.length ? (
          <div className="space-y-4">
            {history.map((m, i) => {
              const isUser = m.from === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={
                      isUser
                        ? "inline-block max-w-[85%] rounded-lg bg-[var(--color-grad-1)]/80 text-white px-3 py-2 text-sm shadow-sm"
                        : "inline-block max-w-[85%] rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm border border-white/20"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-[var(--color-text-400)]">
            Ask the bot about tokens (demo).
          </div>
        )}
      </div>

      {/* Input row */}
      <div className="mt-3 flex gap-2 items-center">
        <textarea
          ref={inputRef}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          className="flex-1 rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm
                     text-[var(--color-text-100)] placeholder:text-[var(--color-text-400)]
                     focus:outline-none focus:ring-4 focus:ring-white/10 resize-none h-10"
          aria-label="Chat message"
        />
        <button
          onClick={() => !loading && send()}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)]
                     text-white text-sm font-medium shadow-sm hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Error info */}
      {error && (
        <div className="mt-2 text-xs text-[var(--color-danger)]">
          <strong>Error:</strong> {error}
        </div>
      )}
    </section>
  );
}
