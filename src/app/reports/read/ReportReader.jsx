// src/app/reports/read/ReportReader.jsx
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function ReportReader() {
  const params = useSearchParams();

  // Get ?file=/data/SHIB_report.pdf (must be inside /public)
  const file = params.get("file");

  // Basic guard + only allow files under /data to avoid weird URLs
  const src = useMemo(() => {
    const candidate = file || "/data/SHIB_report.pdf";
    // simple safety: require it to start with / and live under /data
    if (!candidate.startsWith("/")) return "/data/SHIB_report.pdf";
    if (!candidate.startsWith("/data/")) return "/data/SHIB_report.pdf";
    return candidate;
  }, [file]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <a
          href={src}
          download
          className="px-4 py-2 rounded-lg bg-[var(--color-grad-1)] text-white text-sm font-medium"
        >
          Download PDF
        </a>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border border-white/20 text-sm text-[var(--color-text-100)] hover:bg-white/10"
        >
          Open in new tab
        </a>
      </div>

      <div className="h-[75vh] rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Use <iframe> to render PDF from /public */}
        <iframe
          key={src}
          src={src}
          title="Report PDF"
          className="w-full h-full"
        />
      </div>

      <p className="text-xs text-[var(--color-text-400)]">
        Showing: <code className="text-[var(--color-text-100)]">{src}</code>
      </p>
    </section>
  );
}
