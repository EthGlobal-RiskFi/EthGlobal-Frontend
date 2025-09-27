// src/components/ChallengeButtonSol.jsx
"use client";

import React from "react";
import { ethers } from "ethers";
import { useWallet } from "../providers/WalletProvider";
import { db } from "../lib/firebase"; // ensure firebase is configured & exported here
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ---------------- Contract ABI & Config ---------------- */
// adjust method names / ABI to match your deployed contract
const ABI = [
  "function MIN_STAKE() view returns (uint256)",
  "function stakeFor(string reportKey) payable",
  "function stakeAgainst(string reportKey) payable",
];

const METHODS = {
  for: "stakeFor",
  against: "stakeAgainst",
};

const REQUIRED_CHAIN_ID = 11155111; // Sepolia
const CONTRACT_ADDR = "0x3624EcDc7bd36640a2fb3D814f6F93F03E7524b5"; // replace with your contract address
const STAKE_ETH = "0.001"; // fallback if MIN_STAKE not provided

/* ---------------- Helpers ---------------- */

async function ensureChain() {
  if (!window?.ethereum) return;
  try {
    const currentHex = await window.ethereum.request({ method: "eth_chainId" });
    const current = parseInt(currentHex, 16);
    if (current !== REQUIRED_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + REQUIRED_CHAIN_ID.toString(16) }],
      });
    }
  } catch (e) {
    // bubble up error to caller
    throw e;
  }
}

function getProvider() {
  if (!window?.ethereum) throw new Error("No injected provider (MetaMask).");
  return new ethers.BrowserProvider(window.ethereum);
}

/* check if error is user rejection */
function isUserRejected(e) {
  // MetaMask user rejection codes can be 4001 or 'ACTION_REJECTED'
  return (
    e &&
    (e.code === 4001 ||
      e.code === "ACTION_REJECTED" ||
      (typeof e.message === "string" && e.message.toLowerCase().includes("user rejected")))
  );
}

/* ---------------- Component ---------------- */

export default function ChallengeButtonSol({
  reportKey = "aave-risk-v1",
  onCreated, // optional callback({ side, txHash })
}) {
  const { address, connectWallet, getSigner } = useWallet();

  // statuses: idle | checking | ready | calling | done | blocked
  const [statusFor, setStatusFor] = React.useState("idle");
  const [statusAgainst, setStatusAgainst] = React.useState("idle");
  const [errorFor, setErrorFor] = React.useState("");
  const [errorAgainst, setErrorAgainst] = React.useState("");
  const [minStake, setMinStake] = React.useState(null); // ETH string

  const docIdFor = React.useMemo(() => (address ? `${reportKey}_${address}_for` : null), [
    reportKey,
    address,
  ]);
  const docIdAgainst = React.useMemo(
    () => (address ? `${reportKey}_${address}_against` : null),
    [reportKey, address]
  );

  const load = React.useCallback(async () => {
    if (!address) {
      setStatusFor("idle");
      setStatusAgainst("idle");
      return;
    }

    try {
      // Ensure chain and create provider
      await ensureChain();
      const provider = getProvider();

      // Try to read MIN_STAKE from contract (optional)
      try {
        const read = new ethers.Contract(CONTRACT_ADDR, ABI, provider);
        const min = await read.MIN_STAKE();
        setMinStake(ethers.formatEther(min));
      } catch {
        setMinStake(null);
      }

      // Check Firestore for existing challenge docs
      setStatusFor("checking");
      setStatusAgainst("checking");

      const snapFor = await getDoc(doc(db, "challenges", docIdFor));
      const snapAgainst = await getDoc(doc(db, "challenges", docIdAgainst));

      // if user already staked "for" mark done and block other
      if (snapFor.exists()) {
        setStatusFor("done");
        setStatusAgainst("blocked");
        return;
      }

      if (snapAgainst.exists()) {
        setStatusAgainst("done");
        setStatusFor("blocked");
        return;
      }

      // neither exists => ready
      setStatusFor("ready");
      setStatusAgainst("ready");
    } catch (e) {
      console.error("Load error:", e);
      // fallback to ready so user can try
      setStatusFor((s) => (s === "idle" ? "ready" : s));
      setStatusAgainst((s) => (s === "idle" ? "ready" : s));
    }
  }, [address, docIdFor, docIdAgainst]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function stake(side) {
    const setStatus = side === "for" ? setStatusFor : setStatusAgainst;
    const setError = side === "for" ? setErrorFor : setErrorAgainst;
    const otherStatusSetter = side === "for" ? setStatusAgainst : setStatusFor;
    const otherStatusGetter = side === "for" ? statusAgainst : statusFor;
    const docId = side === "for" ? docIdFor : docIdAgainst;
    const methodName = METHODS[side];

    try {
      setError("");
      // Prevent staking if other side already done
      if (otherStatusGetter === "done") {
        setError("You already created a challenge on the other side.");
        return;
      }

      // Connect/get signer
      let signer = await getSigner();
      if (!signer) {
        await connectWallet();
        signer = await getSigner();
      }

      // Ensure correct chain
      await ensureChain();

      // Create fresh provider & signer after chain switch
      const provider = getProvider();
      signer = await provider.getSigner();

      // Prepare contract
      const contract = new ethers.Contract(CONTRACT_ADDR, ABI, signer);
      const valueEth = minStake || STAKE_ETH;

      setStatus("calling");

      // send transaction
      const tx = await contract[methodName](reportKey, {
        value: ethers.parseEther(String(valueEth)),
      });

      // wait for receipt
      const rcpt = await tx.wait();

      // Store result in Firestore
      await setDoc(doc(db, "challenges", docId), {
        address,
        reportKey,
        side,
        txHash: rcpt?.transactionHash ?? rcpt?.transactionHash ?? tx.hash,
        stakeEth: valueEth,
        createdAt: new Date().toISOString(),
      });

      // Update statuses: mark this side done and block the other
      setStatus("done");
      otherStatusSetter("blocked");

      onCreated?.({ side, txHash: rcpt?.transactionHash ?? tx.hash });
    } catch (e) {
      console.error("Stake error:", e);

      // User cancelled the transaction in wallet
      if (isUserRejected(e)) {
        setError("Request was cancelled by user.");
        setStatus("ready"); // reset so user can try again
        // also ensure other side remains same
        return;
      }

      // For other errors show a message and reset status to ready
      setError(e?.shortMessage || e?.reason || e?.message || "Unable to complete transaction.");
      setStatus("ready");
    }
  }

  // If wallet not connected, show connect button
  if (!address) {
    return (
      <button
        type="button"
        onClick={connectWallet}
        className="px-5 py-2.5 rounded-lg bg-[var(--color-grad-2)] text-white text-sm font-medium"
      >
        Connect Wallet
      </button>
    );
  }

  // render two side-by-side controls
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
      {/* --- FOR --- */}
      <div className="flex flex-col items-center gap-2">
        {statusFor === "done" ? (
          <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-[var(--color-success)] text-sm font-semibold">
            Challenge Created (For)
          </span>
        ) : (
          <button
            type="button"
            onClick={() => stake("for")}
            disabled={statusFor === "checking" || statusFor === "calling" || statusFor === "blocked"}
            className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium ${
              statusFor === "blocked"
                ? "bg-white/10 opacity-60 cursor-not-allowed"
                : "bg-[var(--color-grad-1)]"
            }`}
          >
            {statusFor === "checking"
              ? "Checking…"
              : statusFor === "calling"
              ? `Staking ${(minStake || STAKE_ETH)}…`
              : `Challenge For (${minStake || STAKE_ETH} ETH)`}
          </button>
        )}
        {errorFor && <div className="text-xs text-[var(--color-danger)]">{errorFor}</div>}
      </div>

      {/* --- AGAINST --- */}
      <div className="flex flex-col items-center gap-2">
        {statusAgainst === "done" ? (
          <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-[var(--color-danger)] text-sm font-semibold">
            Challenge Created (Against)
          </span>
        ) : (
          <button
            type="button"
            onClick={() => stake("against")}
            disabled={
              statusAgainst === "checking" || statusAgainst === "calling" || statusAgainst === "blocked"
            }
            className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium ${
              statusAgainst === "blocked"
                ? "bg-white/10 opacity-60 cursor-not-allowed"
                : "bg-[var(--color-grad-2)]"
            }`}
          >
            {statusAgainst === "checking"
              ? "Checking…"
              : statusAgainst === "calling"
              ? `Staking ${(minStake || STAKE_ETH)}…`
              : `Challenge Against (${minStake || STAKE_ETH} ETH)`}
          </button>
        )}
        {errorAgainst && (
          <div className="text-xs text-[var(--color-danger)]">{errorAgainst}</div>
        )}
      </div>
    </div>
  );
}
