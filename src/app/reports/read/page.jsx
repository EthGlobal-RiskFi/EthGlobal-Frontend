"use client";

import { useSearchParams } from "next/navigation";

export default function ReportReader() {
  const sp = useSearchParams();
  const file = sp.get("file"); // e.g. /data/haha.pdf

  if (!file) {
    return <main className="max-w-6xl mx-auto px-6 py-12">No file selected.</main>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold text-[var(--color-text-100)] mb-6">Report Viewer</h1>

      <div className="w-full h-[80vh] rounded-xl border border-white/20 overflow-hidden bg-white/5">
        {/* Use object/embed/iframe; object is fine for most browsers */}
        <object data={file} type="application/pdf" width="100%" height="100%">
          <p className="p-4 text-sm text-[var(--color-text-400)]">
            PDF preview not supported in your browser.{" "}
            <a href={file} target="_blank" className="underline">
              Open in new tab
            </a>
            .
          </p>
        </object>
      </div>
    </main>
  );
}
