"use client";

import { motion } from "framer-motion";
import ChallengeButtonSol from "../../components/ChallengeButtonSol";

export default function ReportsPage() {
  const report = {
    key: "aave-risk-v1",                  // <- used by the contract to identify this report
    name: "AAVE Risk Report",
    desc: "Comprehensive risk insights for AAVE (PDF).",
    file: "/data/SHIB_report.pdf",        // make sure this exists in /public/data
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-20 space-y-12">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-[var(--color-text-100)]">Reports</h1>
        <p className="text-[var(--color-text-400)]">
          Browse available reports. Each report is available in PDF format for download,
          in-app reading, or challenge.
        </p>
      </header>

      {/* Single Report Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-sm text-center"
      >
        <h3 className="text-xl font-semibold text-[var(--color-text-100)] mb-2">
          {report.name}
        </h3>
        <p className="text-sm text-[var(--color-text-400)] mb-6">{report.desc}</p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={report.file}
            download
            className="px-5 py-2.5 rounded-lg bg-[var(--color-grad-1)] text-white text-sm font-medium"
          >
            Download PDF
          </a>

          <a
            href={`/reports/read?file=${encodeURIComponent(report.file)}`}
            className="px-5 py-2.5 rounded-lg border border-white/20 text-sm text-[var(--color-text-100)] hover:bg-white/10"
          >
            Read Online
          </a>

          {/* Contract-backed challenge */}
          <ChallengeButtonSol
            reportKey={report.key}
            onCreated={(info) => {
              // Optional: push to Firebase here
              console.log("Challenge created:", info);
            }}
          />
        </div>
      </motion.div>
    </main>
  );
}
