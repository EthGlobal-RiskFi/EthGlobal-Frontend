"use client";
import { useState } from "react";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("signup"); // signup | login
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="bg-white p-6 rounded shadow-lg z-10 w-full max-w-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{mode === "signup" ? "Create Account" : "Log in"}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-4 space-y-3">
          <input placeholder="Name" className="w-full border px-3 py-2 rounded" />
          <input placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" />
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-sm text-gray-600"
            >
              {mode === "signup" ? "Already registered? Log in" : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
