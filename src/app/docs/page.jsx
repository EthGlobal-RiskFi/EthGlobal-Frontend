// src/app/docs/page.jsx
"use client";

import { motion } from "framer-motion";
import SectionHeading from "../../components/SectionHeading";

const refs = [
  {
    id: 1,
    text: "Etherscan Developer Docs — APIs for blockchain data",
    url: "https://docs.etherscan.io",
  },
  {
    id: 2,
    text: "Pyth Network Whitepaper — High-frequency price oracles",
    url: "https://pyth.network/whitepaper",
  },
  {
    id: 3,
    text: "The Graph Protocol Docs — Decentralized indexing and querying",
    url: "https://thegraph.com/docs",
  },
  {
    id: 4,
    text: "Risk Management in DeFi (Aramonte et al., BIS Quarterly Review)",
    url: "https://www.bis.org/publ/qtrpdf/r_qt2109b.htm",
  },
  {
    id: 5,
    text: "Portfolio Risk Metrics — Jorion (2006), Value at Risk",
    url: "https://onlinelibrary.wiley.com/doi/book/10.1002/9781119201893",
  },
];

/** motion helpers */
const containerV = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut", staggerChildren: 0.06 },
  },
};
const cardV = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

function GlassCard({ id, title, children }) {
  return (
    <motion.section
      id={id}
      variants={cardV}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md shadow-sm
                 hover:border-white/20 hover:shadow-md transition"
    >
      {/* faint corner glow */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-tr from-white/10 to-transparent" />
      <h3
        className="text-xl font-semibold mb-2 bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)]
                     bg-clip-text text-transparent"
      >
        {title}
      </h3>
      <div className="prose prose-invert max-w-none">{children}</div>
    </motion.section>
  );
}

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <header className="text-center mb-12 pt-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] bg-clip-text text-transparent">
          Docs — What you see in the app
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[var(--color-text-400)] max-w-2xl mx-auto">
          A guide to the metrics, visuals, and analytics shown in{" "}
          <span className="font-semibold text-[var(--color-text-100)]">
            RobinHood
          </span>
          .
        </p>
      </header>

      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Risk Panel */}
        <GlassCard id="risk" title="Risk Panel">
          <p className="text-[var(--color-text-300)]">
            The risk engine summarizes downside risk using established metrics
            like VaR and Expected Shortfall (ES){" "}
            <a
              href="#ref-4"
              className="text-indigo-300 underline/30 hover:underline"
            >
              [4]
            </a>
            .
          </p>
          <ul className="mt-3 grid gap-2 text-[var(--color-text-100)]">
            <li>
              <span className="font-semibold">VaR:</span> Loss threshold at a
              confidence level (e.g., 95%){" "}
              <a
                href="#ref-5"
                className="text-indigo-300 underline/30 hover:underline"
              >
                [5]
              </a>
              .
            </li>
            <li>
              <span className="font-semibold">ES:</span> Average loss if VaR is
              breached (tail-loss severity).
            </li>
            <li>
              <span className="font-semibold">Volatility:</span> Scale of
              variability in returns.
            </li>
            <li>
              <span className="font-semibold">Max Drawdown:</span> Largest
              observed peak-to-trough decline.
            </li>
            <li>
              <span className="font-semibold">Risk Level & Score:</span> Compact
              summary for quick comparisons.
            </li>
          </ul>
        </GlassCard>

        {/* Technical Panel */}
        <GlassCard id="technicals" title="Technical Health">
          <p className="text-[var(--color-text-300)]">
            We synthesize RSI, MACD, and Bollinger statistics into an overall
            technical grade, and show a short trend chart for context.
          </p>
          <ul className="mt-3 grid gap-2 text-[var(--color-text-100)]">
            <li>
              <span className="font-semibold">RSI:</span> Momentum oscillator
              (0–100) for overbought/oversold zones.
            </li>
            <li>
              <span className="font-semibold">MACD:</span> Momentum/Trend view
              from EMAs and histogram.
            </li>
            <li>
              <span className="font-semibold">Bollinger Bands:</span> Price
              position vs. dynamic σ bands.
            </li>
          </ul>
        </GlassCard>

        {/* Market Insights */}
        <GlassCard id="market" title="Market Insights">
          <p className="text-[var(--color-text-300)]">
            RealTime token metrics (price, volume, TVL) analogous to data you
            might fetch from Etherscan{" "}
            <a
              href="#ref-1"
              className="text-indigo-300 underline/30 hover:underline"
            >
              [1]
            </a>
            , Pyth{" "}
            <a
              href="#ref-2"
              className="text-indigo-300 underline/30 hover:underline"
            >
              [2]
            </a>
            , or The Graph
            <a
              href="#ref-3"
              className="text-indigo-300 underline/30 hover:underline"
            >
              [3]
            </a>
            .
          </p>
        </GlassCard>

        {/* Pivot Chart */}
        <GlassCard id="pivot" title="Pivot Price Chart">
          <p className="text-[var(--color-text-300)]">
            Token visualized as a time-series to inspect price
            evolution and trend changes at a glance.
          </p>
        </GlassCard>

        {/* Address Analyzer */}
        <GlassCard id="analyzer" title="Address Analyzer">
          <p className="text-[var(--color-text-300)]">
            Connect your wallet, query balances via a subgraph
            <a
              href="#ref-3"
              className="text-indigo-300 underline/30 hover:underline"
            >
              [3]
            </a>
            , and get a quick, verifiable risk snapshot from sample data.
          </p>
        </GlassCard>

        {/* Notes
        <GlassCard title="Notes & Tips">
          <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-100)] marker:text-white/60">
            <li>Risk stats are indicative, not guarantees.</li>
            <li>Technical grades can shift quickly with market events.</li>
            <li>CSV feeds are cached; you can swap in real-time APIs later.</li>
          </ul>
        </GlassCard> */}

        {/* References */}
        <motion.section
          variants={cardV}
          className="p-6 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] bg-clip-text text-transparent">
            References
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--color-text-100)]">
            {refs.map((r) => (
              <li key={r.id} id={`ref-${r.id}`}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline/30 hover:underline text-indigo-300"
                >
                  {r.text}
                </a>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Knowledge Center */}
        <motion.section
          variants={cardV}
          className="p-6 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] bg-clip-text text-transparent">
              Knowledge Center
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://docs.etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 hover:shadow-md transition"
            >
              <div className="font-semibold text-white">Etherscan API Docs</div>
              <div className="text-sm text-[var(--color-text-300)]">
                REST endpoints for chain data & logs.
              </div>
              <div className="mt-2 text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition">
                Visit →
              </div>
            </a>

            <a
              href="https://pyth.network/whitepaper"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 hover:shadow-md transition"
            >
              <div className="font-semibold text-white">
                Pyth Network Whitepaper
              </div>
              <div className="text-sm text-[var(--color-text-300)]">
                High-freq price oracle architecture.
              </div>
              <div className="mt-2 text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition">
                Read →
              </div>
            </a>

            <a
              href="https://thegraph.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 hover:shadow-md transition"
            >
              <div className="font-semibold text-white">
                The Graph Protocol Docs
              </div>
              <div className="text-sm text-[var(--color-text-300)]">
                Subgraphs for indexing/querying.
              </div>
              <div className="mt-2 text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition">
                Explore →
              </div>
            </a>

            <a
              href="https://www.bis.org/publ/qtrpdf/r_qt2109b.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-white/20 hover:shadow-md transition"
            >
              <div className="font-semibold text-white">
                BIS DeFi Risk Review
              </div>
              <div className="text-sm text-[var(--color-text-300)]">
                Macro risk & supervision context.
              </div>
              <div className="mt-2 text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition">
                Open →
              </div>
            </a>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
