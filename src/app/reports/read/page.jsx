// src/app/reports/read/page.jsx
import { Suspense } from "react";
import ReportReader from "./ReportReader";
// Keep the page itself a Server Component and wrap the client reader.
export default function ReadReportPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-2xl font-bold text-[var(--color-text-100)] mb-3">
        Report Viewer
      </h1>
      <p className="text-[var(--color-text-400)] mb-6">
        Inline PDF reader for your report.
      </p>

      <Suspense
        fallback={
          <div className="h-[70vh] rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
            <div className="flex items-center gap-3 text-[var(--color-text-400)]">
              <span className="h-5 w-5 border-2 border-[var(--color-grad-1)] border-t-transparent rounded-full animate-spin" />
              Loading…
            </div>
          </div>
        }
      >
        {/* The part that uses useSearchParams lives here */}
        <ReportReader />
      </Suspense>
    </main>
  );
}
