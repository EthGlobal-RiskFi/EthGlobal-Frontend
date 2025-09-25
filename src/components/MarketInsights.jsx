"use client";
export default function MarketInsights() {
  const items = [
    { title: "Vigilance Highlights", body: "Quick bullet describing market highlights (demo)." },
    { title: "Liquidity Overview", body: "Sample stat: 2% price impact: $5,000 (demo)." },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium mb-2">Market Insights</h4>
      <div className="space-y-2 text-sm">
        {items.map((it, i) => (
          <div key={i} className="p-2 border rounded">
            <div className="font-semibold">{it.title}</div>
            <div className="text-gray-600">{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
