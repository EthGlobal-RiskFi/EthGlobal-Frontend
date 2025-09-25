"use client";
export default function LandingHero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-lg p-8 shadow">
      <h1 className="text-3xl font-bold">CipherHealth — Token Risk Intelligence</h1>
      <p className="mt-3 max-w-2xl">
        Paste a token address to generate a verifiable risk report. Lightweight frontend demo
        scaffolded for a fast hackathon build.
      </p>
      <div className="mt-4">
        <a href="#analyze" className="inline-block px-4 py-2 bg-white text-indigo-600 rounded">Analyze a token</a>
      </div>
    </section>
  );
}
