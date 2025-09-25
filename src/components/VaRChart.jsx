// src/components/VaRChart.jsx
"use client";

import React, { useMemo } from "react";

/**
 * VaRChart
 * Props:
 *  - vae: { VaR95: number, VaR99: number, ES95: number }  (values are negative for losses)
 *  - height?: number (default 160)
 *
 * Small SVG-based VaR visual — no external deps.
 */

function fmtPct(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return `${Math.round(Math.abs(v) * 100)}%`;
}

export default function VaRChart({ vae = { VaR95: 0, VaR99: 0, ES95: 0 }, height = 160 }) {
  const metrics = useMemo(() => {
    const V95 = vae?.VaR95 ?? 0;
    const V99 = vae?.VaR99 ?? 0;
    const ES95 = vae?.ES95 ?? 0;
    const m95 = Math.abs(Number(V95) || 0);
    const m99 = Math.abs(Number(V99) || 0);
    const e95 = Math.abs(Number(ES95) || 0);
    const maxVal = Math.max(0.0001, m95, m99, e95);
    return { m95, m99, e95, maxVal };
  }, [vae]);

  const padding = 12;
  const innerHeight = Math.max(80, height - padding * 2);
  const barWidth = 48;
  const gap = 18;
  const svgWidth = padding * 2 + barWidth * 2 + gap;

  const toPx = (val) => {
    if (!metrics.maxVal) return 2;
    const pct = Math.min(1, val / metrics.maxVal);
    return Math.max(4, Math.round(pct * innerHeight));
  };

  const bar95H = toPx(metrics.m95);
  const bar99H = toPx(metrics.m99);
  const esH = toPx(metrics.e95);

  return (
    <div className="bg-white border rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Risk (VaR &amp; ES)</div>
        <div className="text-xs text-gray-500">Higher = larger downside</div>
      </div>

      <div className="flex items-end gap-4">
        <svg
          role="img"
          aria-label="Value at Risk chart"
          width={svgWidth}
          height={height}
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="block"
        >
          <defs>
            <linearGradient id="g95" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="g99" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* baseline */}
          <line
            x1="0"
            x2={svgWidth}
            y1={padding + innerHeight + 6}
            y2={padding + innerHeight + 6}
            stroke="#e6e6e6"
            strokeWidth="1"
          />

          {/* VaR95 bar */}
          <g transform={`translate(${padding}, ${padding + (innerHeight - bar95H)})`}>
            <rect width={barWidth} height={bar95H} rx="6" fill="url(#g95)" filter="url(#shadow)" />
            <text x={barWidth / 2} y={-6} textAnchor="middle" fontSize="11" fill="#374151">
              {fmtPct(vae?.VaR95)}
            </text>
            <text x={barWidth / 2} y={innerHeight + 22} textAnchor="middle" fontSize="11" fill="#6b7280">
              VaR95
            </text>
          </g>

          {/* VaR99 bar */}
          <g transform={`translate(${padding + barWidth + gap}, ${padding + (innerHeight - bar99H)})`}>
            <rect width={barWidth} height={bar99H} rx="6" fill="url(#g99)" filter="url(#shadow)" />
            <text x={barWidth / 2} y={-6} textAnchor="middle" fontSize="11" fill="#374151">
              {fmtPct(vae?.VaR99)}
            </text>
            <text x={barWidth / 2} y={innerHeight + 22} textAnchor="middle" fontSize="11" fill="#6b7280">
              VaR99
            </text>
          </g>

          {/* ES95 marker */}
          <g transform={`translate(${padding + barWidth + gap / 2}, ${padding})`}>
            <line
              x1={barWidth + gap / 2}
              x2={barWidth + gap / 2}
              y1={innerHeight - esH}
              y2={innerHeight + 6}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.9"
            />
            <circle cx={barWidth + gap / 2} cy={innerHeight - esH} r="5" fill="#10b981" stroke="#064e3b" strokeWidth="0.6" />
            <text x={barWidth + gap / 2 + 12} y={innerHeight - esH + 4} fontSize="11" fill="#065f46">
              ES95 {fmtPct(vae?.ES95)}
            </text>
          </g>
        </svg>

        <div className="flex-1 text-sm">
          <div className="text-xs text-gray-500 mb-1">Summary</div>
          <div className="text-sm text-gray-700">
            VaR95: <span className="font-semibold">{fmtPct(vae?.VaR95)}</span> •
            VaR99: <span className="font-semibold ml-1">{fmtPct(vae?.VaR99)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Expected Shortfall (ES95): <span className="font-medium">{fmtPct(vae?.ES95)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
