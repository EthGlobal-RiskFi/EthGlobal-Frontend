// src/app/docs/page.jsx
"use client";

import SectionHeading from "../../components/SectionHeading";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SectionHeading
        title="Docs — What you see in the app"
        subtitle="A quick guide to the metrics and visuals shown in CipherHealth."
      />

      {/* Risk Panel */}
      <section id="risk" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Risk Panel</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The risk engine summarizes the short-horizon downside using common risk statistics:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <li><strong>VaR (Value-at-Risk):</strong> A worst-case expected loss threshold over a time window at a given confidence. Example: VaR<sub>95</sub> = 1.29% means there’s a 5% chance losses exceed 1.29% over the horizon.</li>
          <li><strong>ES (Expected Shortfall):</strong> Average loss if losses exceed VaR (tail-loss severity).</li>
          <li><strong>Volatility (Annualized):</strong> Scale of returns variability; higher values imply larger swings.</li>
          <li><strong>Max Drawdown:</strong> The largest peak-to-trough decline observed in the lookback period.</li>
          <li><strong>Custom VaR:</strong> A VaR computed at a custom confidence level (e.g., alpha = 0.52 results in confidence 52%).</li>
          <li><strong>Risk Level & Score:</strong> A compact label/score mapping that helps non-quants quickly compare assets.</li>
        </ul>
      </section>

      {/* Technical Panel */}
      <section id="technicals" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Technical Health</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We synthesize common technical indicators into a unified “Overall Health” score:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <li><strong>RSI:</strong> Momentum oscillator (0–100). Overbought/oversold ratios summarize time spent in extremes.</li>
          <li><strong>MACD:</strong> Trend/momentum indicator. We show the histogram average, its variability, and bullish ratio.</li>
          <li><strong>Bollinger Position:</strong> Normalized price position within bands; higher std means more dispersion.</li>
          <li><strong>Consensus & Grade:</strong> A score and grade (A–F) for quick interpretation of technical conditions.</li>
          <li><strong>Overall Health Trend:</strong> Time-series chart of the unified health score (0–100) vs. Date.</li>
        </ul>
      </section>

      {/* Market Insights */}
      <section id="market" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Market Insights</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          These cards and tables come from a lightweight CSV provider:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <li><strong>Token:</strong> Symbol/ticker (e.g., AAVE).</li>
          <li><strong>Price (USD):</strong> Last price for the token (from your CSV’s latest row per token).</li>
          <li><strong>Volume (USD):</strong> Historical or recent traded volume proxy for activity.</li>
          <li><strong>TVL (USD):</strong> Total value locked; a proxy for capital confidence & depth in DeFi contexts.</li>
          <li><strong>Time:</strong> Timestamp/ISO datetime of the data point (seconds or ms supported).</li>
        </ul>
      </section>

      {/* Pivot Chart */}
      <section id="pivot" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pivot Price Chart</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A “pivot” CSV organizes dates in the first column and tokens across subsequent columns. Select a token to plot its price over time with Date on the x-axis and Price on the y-axis.
        </p>
      </section>

      {/* Address Analyzer */}
      <section id="analyzer" className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Address Analyzer</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          When you click “Analyze your portfolio”, we connect the wallet (if needed), query balances/activity (via subgraph),
          then compute a sample risk visualization locally while your full job runs (report view optional).
        </p>
      </section>

      {/* Practical notes */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Notes & Tips</h3>
        <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <li>Short-horizon risk stats (VaR/ES) are indicative, not guarantees. Use with position sizing.</li>
          <li>Technical grades can shift quickly — always check recent trend context.</li>
          <li>Market data from CSV is intentionally cached for performance; realtime feeds can be integrated later.</li>
        </ul>
      </section>
    </main>
  );
}
