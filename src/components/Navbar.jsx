// src/components/Navbar.jsx
"use client";

import { ethers } from "ethers";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";
import { useWallet } from "../providers/WalletProvider";

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

  // wallet provider (lightweight)
  const { address, provider, connectWallet, disconnect, isProcessing } =
    useWallet();
  const { network } = useWallet();
  const isConnected = !!address;

  // dropdown states
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);

  // refs to detect outside click
  const connectRef = useRef(null);
  const walletRef = useRef(null);

  // ENS name
  const [ensName, setEnsName] = useState(null);

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

  // lookup ENS when address changes (use provider if available, else fallback)
  useEffect(() => {
    let mounted = true;
    async function lookupENS() {
      setEnsName(null);
      if (!address) return;
      try {
        const lookupProvider = provider ?? ethers.getDefaultProvider();
        const name = await lookupProvider.lookupAddress(address);
        if (!mounted) return;
        setEnsName(name || null);
      } catch (e) {
        if (mounted) setEnsName(null);
      }
    }
    lookupENS();
    return () => {
      mounted = false;
    };
  }, [address, provider]);

  // body scroll lock while any dropdown open
  useEffect(() => {
    const anyOpen = connectMenuOpen || walletMenuOpen;
    const prev = document.body.style.overflow;
    if (anyOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [connectMenuOpen, walletMenuOpen]);

  async function handleConnectClick() {
    await connectWallet();
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

            {/* <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              <Link href="/reports" className="hover:text-indigo-600">
                Reports
              </Link>
            </div> */}
          </div>

          <div className="flex items-center gap-3">
            {/* Not connected: show connect button */}
            {!isConnected ? (
              <div ref={connectRef} className="relative">
                <button
                  onClick={() => {
                    setConnectMenuOpen((s) => !s);
                    setWalletMenuOpen(false);
                  }}
                  disabled={isProcessing}
                  className={`px-3 py-1 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white rounded-md text-sm flex items-center gap-2`}
                  aria-expanded={connectMenuOpen}
                  aria-haspopup="menu"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>

                {connectMenuOpen && !isProcessing && (
                  <div
                    role="menu"
                    aria-label="Wallet connectors"
                    className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={handleConnectClick}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        Connect with MetaMask / Injected Wallet
                      </button>

                      {!typeof window === "undefined" && !window?.ethereum ? (
                        <div className="px-3 py-2 text-xs text-red-500">
                          No injected wallet found in this browser
                        </div>
                      ) : null}
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
                    {ensName
                      ? ensName
                      : shortAddress(normalizedAddress ?? address)}
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
                        Network:{" "}
                        <span className="font-medium">
                          {network
                            ? network.name || network.chainId || network?.chain
                            : "—"}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                normalizedAddress ?? address
                              );
                            } catch (e) {
                              /* ignore */
                            }
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
