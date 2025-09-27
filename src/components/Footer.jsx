// src/components/Footer.jsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold text-indigo-600">CipherHealth</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Risk & technical insights for on-chain assets — fast, interpretable, and verifiable.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="/docs">Docs</Link></li>
              <li><Link className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="/reports">Reports</Link></li>
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#" aria-disabled>API (coming soon)</a></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Learn</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#risk">Risk model overview</a></li>
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#technicals">Technicals we use</a></li>
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#market">Market data fields</a></li>
            </ul>
          </div>

          {/* Social / legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Community</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#" aria-disabled>GitHub</a></li>
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#" aria-disabled>Discord</a></li>
              <li><a className="text-slate-600 hover:text-indigo-600 dark:text-slate-300" href="#" aria-disabled>Twitter/X</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} CipherHealth. All rights reserved.
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Built with performance-first, privacy-friendly design.
          </div>
        </div>
      </div>
    </footer>
  );
}
