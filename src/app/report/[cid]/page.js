"use client";
import Navbar from "../../../components/Navbar";
import ReportCard from "../../../components/ReportCard";
import VaRChart from "../../../components/VaRChart";
import TopRisks from "../../../components/TopRisks";
import PublishCard from "../../../components/PublishCard";
import NotesPanel from "../../../components/NotesPanel";
import TeamShare from "../../../components/TeamShare";

export default function ReportPage({ params }) {
  const { cid } = params || { cid: "mock-report-cid" };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Report: {cid}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ReportCard cid={cid} />
            <TopRisks />
            <VaRChart />
          </div>

          <div className="space-y-4">
            <PublishCard cid={cid} />
            <TeamShare />
            <NotesPanel />
          </div>
        </div>
      </main>
    </>
  );
}
