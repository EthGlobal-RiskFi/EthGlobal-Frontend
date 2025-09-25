"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-indigo-600">CipherHealth</div>
            <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              <a className="hover:text-indigo-600">Features</a>
              <a className="hover:text-indigo-600">How it works</a>
              <a className="hover:text-indigo-600">Docs</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-sm rounded-md border">JOIN NOW</button>
            <button className="px-3 py-1 text-sm rounded-md">LOG IN</button>
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </nav>

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
