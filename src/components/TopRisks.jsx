"use client";
export default function TopRisks({ risks }) {
  const items = risks || [
    { title: "Owner can mint tokens (high)" },
    { title: "Top holder concentration (medium)" },
    { title: "Thin liquidity in primary pool (medium)" },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium mb-2">Top risks</h4>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {items.map((r, i) => (
          <li key={i}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}
