"use client";

import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, right = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-5 flex items-center justify-between"
    >
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-100)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-400)]">{subtitle}</p>
        )}
      </div>
      {right}
    </motion.div>
  );
}
