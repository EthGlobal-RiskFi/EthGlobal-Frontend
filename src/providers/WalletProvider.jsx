// src/providers/WalletProvider.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);

    // check if already connected
    p.send("eth_accounts", [])
      .then((accounts) => {
        if (accounts && accounts.length) setAddress(accounts[0]);
      })
      .catch(() => { /* ignore */ });

    // handle account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length) setAddress(accounts[0]);
      else setAddress(null);
    };

    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  async function connectWallet() {
    if (typeof window === "undefined") return;
    if (!window.ethereum) {
      alert("MetaMask / Injected wallet not found!");
      return null;
    }

    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const signer = await p.getSigner();
      const addr = await signer.getAddress();
      setProvider(p);
      setAddress(addr);
      return addr;
    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Wallet connect failed: " + (err?.message || err));
      return null;
    }
  }

  function disconnect() {
    // Can't programmatically disconnect an injected wallet; clear local state
    setAddress(null);
  }

  async function getSigner() {
    if (!provider) {
      if (typeof window !== "undefined" && window.ethereum) {
        const p = new ethers.BrowserProvider(window.ethereum);
        setProvider(p);
        return p.getSigner();
      }
      return null;
    }
    return provider.getSigner();
  }

  return (
    <WalletContext.Provider value={{ address, provider, connectWallet, disconnect, getSigner }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
