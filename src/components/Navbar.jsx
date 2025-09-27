"use client";

import { ethers } from "ethers";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";
import { useWallet } from "../providers/WalletProvider";
import { motion } from "framer-motion";

// lazy-load AuthModal to improve initial load
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

function shortAddress(addr = "") {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { address, provider, connectWallet, disconnect, isProcessing, network } =
    useWallet();
  const isConnected = !!address;

  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [connectMenuOpen, setConnectMenuOpen] = useState(false);

  const connectRef = useRef(null);
  const walletRef = useRef(null);

  const [ensName, setEnsName] = useState(null);

  useOutsideClick(connectRef, {
    onOutside: () => setConnectMenuOpen(false),
    onEscape: () => setConnectMenuOpen(false),
  });
  useOutsideClick(walletRef, {
    onOutside: () => setWalletMenuOpen(false),
    onEscape: () => setWalletMenuOpen(false),
  });

  const normalizedAddress = useMemo(() => {
    if (!address) return null;
    try {
      return ethers.utils.getAddress(address);
    } catch (e) {
      return address;
    }
  }, [address]);

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
      <motion.nav
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 bg-white/5 backdrop-blur border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-lg font-bold text-[var(--color-text-100)] hover:text-[var(--color-grad-2)] transition-colors"
            >
              RobinHood
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!isConnected ? (
              <div ref={connectRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setConnectMenuOpen((s) => !s);
                    setWalletMenuOpen(false);
                  }}
                  disabled={isProcessing}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    isProcessing
                      ? "bg-white/20 cursor-not-allowed text-[var(--color-text-400)]"
                      : "bg-gradient-to-r from-[var(--color-grad-1)] to-[var(--color-grad-2)] text-white"
                  }`}
                  aria-expanded={connectMenuOpen}
                  aria-haspopup="menu"
                >
                  {isProcessing ? "Processing..." : "Connect Wallet"}
                </motion.button>

                {connectMenuOpen && !isProcessing && (
                  <div
                    role="menu"
                    aria-label="Wallet connectors"
                    className="absolute right-0 mt-2 w-60 bg-[var(--color-bg-900)] border border-white/10 rounded-xl shadow-lg z-50 p-2"
                  >
                    <button
                      onClick={handleConnectClick}
                      className="w-full text-left px-3 py-2 rounded hover:bg-white/5 text-sm text-[var(--color-text-100)]"
                    >
                      Connect with MetaMask / Injected Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div ref={walletRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setWalletMenuOpen((s) => !s);
                    setConnectMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-white/10 rounded-md text-sm flex items-center gap-2 text-[var(--color-text-100)]"
                  aria-expanded={walletMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="font-medium">
                    {ensName
                      ? ensName
                      : shortAddress(normalizedAddress ?? address)}
                  </span>
                  <span className="text-xs text-[var(--color-text-400)]">
                    Wallet
                  </span>
                </motion.button>

                {walletMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Wallet menu"
                    className="absolute right-0 mt-2 w-64 bg-[var(--color-bg-900)] border border-white/10 rounded-xl shadow-lg z-50 p-3"
                  >
                    <div className="text-xs text-[var(--color-text-400)]">
                      Connected
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-100)] break-all">
                      {normalizedAddress ?? address}
                    </div>

                    <div className="mt-2 text-xs text-[var(--color-text-400)]">
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
                          } catch {}
                          setWalletMenuOpen(false);
                        }}
                        className="px-3 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          disconnect();
                          setWalletMenuOpen(false);
                        }}
                        className="px-3 py-1 text-sm bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
