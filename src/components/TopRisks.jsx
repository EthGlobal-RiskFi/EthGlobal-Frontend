"use client";

import { motion } from "framer-motion";

export default function TopRisks({ risks }) {
  const items =
    risks || [
      { title: "Owner can mint tokens (high)" },
      { title: "Top holder concentration (medium)" },
      { title: "Thin liquidity in primary pool (medium)" },
    ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm"
    >
      <h4 className="font-semibold text-[var(--color-text-100)] mb-3">
        Top Risks
      </h4>
      <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--color-text-300)]">
        {items.map((r, i) => (
          <li
            key={i}
            className="hover:text-[var(--color-text-100)] transition-colors"
          >
            {r.title}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
