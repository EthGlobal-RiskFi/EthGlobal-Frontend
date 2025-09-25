// src/components/Navbar.jsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import { ethers } from "ethers";
import useOutsideClick from "../hooks/useOutsideClick";

// lazy-load AuthModal to improve initial load
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

/** shorten address for UI */
function shortAddress(addr = "") {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Navbar() {
  // auth modal
  const [open, setOpen] = useState(false);

  // wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, isLoading: connectLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  // dropdown states
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);

  // refs to detect outside click
  const connectRef = useRef(null);
  const walletRef = useRef(null);

  // close menus when clicking outside or pressing Escape
  useOutsideClick(connectRef, {
    onOutside: () => setConnectMenuOpen(false),
    onEscape: () => setConnectMenuOpen(false),
  });
  useOutsideClick(walletRef, {
    onOutside: () => setWalletMenuOpen(false),
    onEscape: () => setWalletMenuOpen(false),
  });

  // checksum the address if possible
  const normalizedAddress = useMemo(() => {
    if (!address) return null;
    try {
      return ethers.utils.getAddress(address);
    } catch (e) {
      return address;
    }
  }, [address]);

  // body scroll lock while any dropdown open
  useEffect(() => {
    const anyOpen = connectMenuOpen || walletMenuOpen;
    const prev = document.body.style.overflow;
    if (anyOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [connectMenuOpen, walletMenuOpen]);

  // helper to handle connector click (closes menu and attempts connect)
  function handleConnectorClick(connector) {
    // attempt connect (wagmi will handle prompts)
    connect({ connector });
    // close menu immediately to avoid multiple modals stacking
    setConnectMenuOpen(false);
  }

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-indigo-600">
              <Link href="/">CipherHealth</Link>
            </div>

            <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              {/* <Link href="/features" className="hover:text-indigo-600">Features</Link>
              <Link href="/how-it-works" className="hover:text-indigo-600">How it works</Link>
              <Link href="/docs" className="hover:text-indigo-600">Docs</Link> */}
              <Link href="/reports" className="hover:text-indigo-600">Reports</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-sm rounded-md border">JOIN NOW</button>

            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
            >
              SIGN UP
            </button>

            {/* Not connected: show connect button */}
            {!isConnected ? (
              <div ref={connectRef} className="relative">
                <button
                  onClick={() => {
                    setConnectMenuOpen((s) => !s);
                    setWalletMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                  aria-expanded={connectMenuOpen}
                  aria-haspopup="menu"
                >
                  Connect Wallet
                </button>

                {connectMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Wallet connectors"
                    className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-50"
                  >
                    <div className="py-2">
                      {connectors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleConnectorClick(c)}
                          disabled={!c.ready}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center justify-between"
                        >
                          <span>{c.name}</span>
                          {!c.ready ? (
                            <span className="text-xs text-red-400">Not available</span>
                          ) : connectLoading && pendingConnector?.id === c.id ? (
                            <span className="text-xs text-gray-500">Connecting…</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div ref={walletRef} className="relative">
                <button
                  onClick={() => {
                    setWalletMenuOpen((s) => !s);
                    setConnectMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-md flex items-center gap-2"
                  aria-expanded={walletMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="font-medium">
                    {ensName ? ensName : shortAddress(normalizedAddress ?? address)}
                  </span>
                  <span className="text-xs text-gray-500">Wallet</span>
                </button>

                {walletMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Wallet menu"
                    className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50"
                  >
                    <div className="px-4 py-3">
                      <div className="text-xs text-gray-500">Connected</div>
                      <div className="mt-1 text-sm text-gray-800 break-all">
                        {normalizedAddress ?? address}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Network: <span className="font-medium">—</span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(normalizedAddress ?? address);
                            } catch (e) {}
                            setWalletMenuOpen(false);
                          }}
                          className="px-3 py-1 text-sm border rounded"
                        >
                          Copy
                        </button>

                        <button
                          onClick={() => {
                            disconnect();
                            setWalletMenuOpen(false);
                          }}
                          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded border"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* AuthModal lazy-loaded above */}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
