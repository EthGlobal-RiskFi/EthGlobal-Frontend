// src/components/LandingHero.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-6 py-20 text-center" // ⬅️ added bigger top/bottom padding
    >
      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-12"> 
        RobinHood —{" "}
        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Token Risk Intelligence
        </span>
      </h1>

      {/* Info box with button inside */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="mt-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm max-w-2xl mx-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-2">
          What is “View Reports”?
        </h3>
        <p className="text-sm text-[var(--color-text-300)] leading-relaxed mb-4">
          The reports section provides access to pre-generated risk intelligence PDFs.  
          These contain in-depth token insights, risk levels, and technical breakdowns that you can download or share.
        </p>
        <p className="text-xs text-[var(--color-text-400)] mb-4">
          Navigate to <span className="font-semibold text-indigo-400">/reports</span> to explore the latest analysis.
        </p>

        <Link href="/reports">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl font-medium text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm"
          >
            View Reports
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
