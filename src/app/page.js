// src/app/page.js
"use client";
import Navbar from "../components/Navbar";
import LandingHero from "../components/LandingHero";
import TokenInput from "../components/TokenInput";
import MarketInsights from "../components/MarketInsights";
import PivotChart from "../components/PivotChart";
import ChatBotPlaceholder from "../components/ChatBotPlaceholder";
import RiskPanel from "../components/RiskPanel";
import TechnicalPanel from "../components/TechnicalPanel";
import Footer from "../components/Footer"; // <-- add this

export default function Page() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero */}
        <section>
          <LandingHero />
        </section>

        {/* Token Analyzer */}
        <section className="panel">
          <h3 className="section-title mb-3">ERC-20 Token Analyzer</h3>
          <TokenInput />
        </section>

        {/* Chatbot */}
        <section>
          <ChatBotPlaceholder />
        </section>

        {/* Risk Panel */}
        <section>
          <RiskPanel alpha={0.90} />
        </section>

        {/* Market carousel */}
        <section>
          <MarketInsights />
        </section>

        {/* Technical chart */}
        <section>
          <TechnicalPanel />
        </section>

        {/* Pivot Chart */}
        <section>
          <PivotChart />
        </section>
      </main>
      <Footer /> {/* <-- add this */}
    </>
  );
}
