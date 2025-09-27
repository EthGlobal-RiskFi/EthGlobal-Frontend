// src/components/AuthModal.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("signup"); // signup | login

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {mode === "signup" ? "Create Account" : "Log in"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              {mode === "signup" && (
                <input
                  placeholder="Name"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )}
              <input
                placeholder="Email"
                type="email"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                placeholder="Password"
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  {mode === "signup" ? "Sign up" : "Log in"}
                </button>
                <button
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {mode === "signup"
                    ? "Already registered? Log in"
                    : "Create an account"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
