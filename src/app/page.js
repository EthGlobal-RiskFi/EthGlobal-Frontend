"use client";
import Navbar from "../components/Navbar";
import LandingHero from "../components/LandingHero";
import TokenInput from "../components/TokenInput";
import AgentProgress from "../components/AgentProgress";
import MarketInsights from "../components/MarketInsights";
import ChatBotPlaceholder from "../components/ChatBotPlaceholder";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <LandingHero />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TokenInput />
            <AgentProgress />
          </div>
          <div className="space-y-4">
            <MarketInsights />
            <ChatBotPlaceholder />
          </div>
        </div>
      </main>
    </>
  );
}
