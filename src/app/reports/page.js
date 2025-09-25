"use client";

import Navbar from "../../components/Navbar";
import ReportList from "../../components/ReportList";

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Reports</h1>
        <p className="text-sm text-gray-600 mb-6">
          Browse generated reports. Hover or press on an item to prefetch the
          report for instant viewing.
        </p>

        <ReportList />
      </main>
    </>
  );
}
