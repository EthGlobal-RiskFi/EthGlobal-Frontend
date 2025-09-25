"use client";
export default function AgentProgress() {
  const steps = [
    "Contract Agent",
    "Market Agent",
    "Sentiment Agent",
    "Risk Aggregator",
  ];

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-medium mb-2">Agents</h3>
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center p-2 border rounded animate-pulse">
            <div className="text-xs text-gray-500">Step {i + 1}</div>
            <div className="font-semibold">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
