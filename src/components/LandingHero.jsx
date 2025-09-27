"use client";
import { motion } from "framer-motion";
export default function LandingHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-10 mt-24 text-center bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] shadow-md"
    >
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        RobinHood — Token Risk Intelligence
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-base text-white/90">
        Paste a token address to generate a verifiable risk report. Lightweight
        frontend demo scaffolded for a fast hackathon build.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        {/* Primary CTA: teal accent */}
        <motion.a
          href="#analyze"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl bg-[var(--color-success)] text-black font-medium shadow hover:shadow-lg transition"
        >
          Analyze a Token
        </motion.a>

        {/* Secondary CTA: subtle glass */}
        <motion.a
          href="/reports"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white/90 font-medium hover:bg-white/20 transition"
        >
          View Reports
        </motion.a>
      </div>
    </motion.section>
  );
}
