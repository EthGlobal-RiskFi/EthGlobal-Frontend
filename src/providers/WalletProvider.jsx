// src/providers/WalletProvider.jsx
"use client";

import { ethers } from "ethers";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import sampleData from "../../public/sample.json";
import { db } from "../lib/firebase";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);
    // initial network
    p.getNetwork()
      .then((n) => setNetwork(n))
      .catch(() => {});

    // check if already connected
    p.send("eth_accounts", [])
      .then((accounts) => {
        if (accounts && accounts.length) setAddress(accounts[0]);
      })
      .catch(() => {
        /* ignore */
      });

    // handle account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length) setAddress(accounts[0]);
      else setAddress(null);
    };

    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);
    const handleChainChanged = async () => {
      try {
        const p2 = new ethers.BrowserProvider(window.ethereum);
        setProvider(p2);
        const n = await p2.getNetwork();
        setNetwork(n);
      } catch (e) {
        setNetwork(null);
      }
    };

    window.ethereum?.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  // Function to send POST request and store response in Firestore
  async function processRiskAppetite(walletAddress) {
    setIsProcessing(true);
    try {
      console.log("Sending POST request with sample data...");

      // Make POST request to the endpoint
      const response = await fetch(
        "http://10.125.9.225:5000/user_risk_appetite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Received response:", responseData);

      // Store the response in Firestore using wallet address as document ID
      const docRef = doc(db, "risk_appetites", walletAddress);
      await setDoc(docRef, {
        walletAddress: walletAddress,
        requestData: sampleData,
        responseData: responseData,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });

      console.log("Document written with ID: ", walletAddress);
      return responseData;
    } catch (error) {
      console.error("Error processing risk appetite:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }

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
      try {
        const n = await p.getNetwork();
        setNetwork(n);
      } catch (e) {
        setNetwork(null);
      }
      setAddress(addr);

      // Process risk appetite after successful wallet connection
      try {
        await processRiskAppetite(addr);
      } catch (error) {
        // Risk appetite processing failed, but wallet is still connected
        console.error("Risk appetite processing failed:", error);
      }

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
    <WalletContext.Provider
      value={{
        address,
        provider,
        connectWallet,
        disconnect,
        getSigner,
        network,
        isProcessing,
        processRiskAppetite,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
