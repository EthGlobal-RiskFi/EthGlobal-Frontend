"use client";
export default function JobStatus({ job }) {
  if (!job) return null;
  const p = job.progress || {};
  const items = [
    { name: "Fundamentals", v: Math.round((p.fundamentals || 0) * 100) },
    { name: "Microstructure", v: Math.round((p.microstructure || 0) * 100) },
    { name: "Sentiment", v: Math.round((p.sentiment || 0) * 100) },
    { name: "Technical", v: Math.round((p.technical || 0) * 100) },
  ];

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="font-medium mb-2">Job status: {job.status}</h4>
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.name}>
            <div className="flex justify-between text-xs">
              <div>{it.name}</div>
              <div>{it.v}%</div>
            </div>
            <div className="w-full bg-gray-100 rounded h-2">
              <div className="bg-indigo-600 h-2 rounded" style={{ width: `${it.v}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
