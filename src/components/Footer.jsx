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
            <div className="text-lg font-bold text-indigo-600">RobinHood</div>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
              Risk & technical insights for on-chain assets — fast, interpretable, and verifiable.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="/docs"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="/reports"
                >
                  Reports
                </Link>
              </li>
              <li>
                <a
                  className="text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  href="#"
                  aria-disabled
                >
                  API (coming soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Learn</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#risk"
                >
                  Risk model overview
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#technicals"
                >
                  Technicals we use
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#market"
                >
                  Market data fields
                </a>
              </li>
            </ul>
          </div>

          {/* Social / legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Community</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#"
                  aria-disabled
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#"
                  aria-disabled
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  className="text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                  href="#"
                  aria-disabled
                >
                  Twitter/X
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            © {new Date().getFullYear()} RobinHood. All rights reserved.
          </p>
          <div className="text-xs text-gray-700 dark:text-gray-300">
            Built with performance-first, privacy-friendly design.
          </div>
        </div>
      </div>
    </footer>
  );
}
