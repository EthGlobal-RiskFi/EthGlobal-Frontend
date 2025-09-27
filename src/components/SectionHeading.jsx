// src/components/SectionHeading.jsx
"use client";

export default function SectionHeading({ title, subtitle, right = null }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
