"use client";

import { useWallet } from "@/providers/WalletProvider";

const BASE_URL = "https://token-api.thegraph.com/historical/balances/evm";
const TOKEN =
  "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTQ5MDA5NDAsImp0aSI6IjA1M2QzZGQxLWU5N2QtNDdhNC1hZTllLTYwMDk5YjFlNTJmOCIsImlhdCI6MTc1ODkwMDk0MCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwdnlqdTJlMTIxZTEwNzM3NDI2NTciLCJ2IjoyLCJha2kiOiJiMjFkY2FhNjEzYzYwNzk3YzIwZjExNGFjYjgyMGRkZjZiMWE5ZDRjZDAzZThjZDBiNzk1Y2MxNjJkZWUzZDUyIiwidWlkIjoiMHZ5anUyZTEyMWUxMDczNzQyNjU3Iiwic3Vic3RyZWFtc19wbGFuX3RpZXIiOiJGUkVFIiwiY2ZnIjp7IlNVQlNUUkVBTVNfTUFYX1JFUVVFU1RTIjoiMiIsIlNVQlNUUkVBTVNfUEFSQUxMRUxfSk9CUyI6IjUiLCJTVUJTVFJFQU1TX1BBUkFMTEVMX1dPUktFUlMiOiI1In19.WufuezRWNvZSFNkR6_1UYZAAILFAcYrZmzTzRPWxTT2Eor0VKtD-XOCgDUTQ4ofrmh0ofbQrc1SCGdtgfpwvDA";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useTheGraph() {
  const { address, network } = useWallet();

  async function getBalances({
    startTime = 1262304000, // Jan 1, 2010
    endTime = 9999999999,
    limit = 50,
    page = 1,
  } = {}) {
    if (!address) {
      console.warn("Wallet not connected. Skipping fetch.");
      return null;
    }

    if (!TOKEN) {
      console.error("TheGraph API token not configured");
      return null;
    }

    if (!network) {
      console.warn("Network not detected. Skipping fetch.");
      return null;
    }

    // Map chainId to network name
    const networkId = network?.chainId
      ? network.chainId === 1n
        ? "mainnet"
        : network.chainId === 5n
        ? "goerli"
        : network.chainId === 137n
        ? "polygon"
        : "mainnet"
      : "mainnet";

    const url = `${BASE_URL}/${address}?network_id=${networkId}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&page=${page}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    };

    let lastError = null;
    const maxRetries = 3;
    let res;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        res = await fetch(url, options);

        if (!res.ok) {
          const text = await res.text(); // log raw error
          console.error(`The Graph API returned HTTP ${res.status}:`, text);
          throw new Error(
            `The Graph API request failed: ${res.status} ${text}`
          );
        }

        // If successful, break out of retry loop
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          // Wait for a bit before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
          console.warn(
            `Retrying request (attempt ${attempt + 2}/${maxRetries})...`
          );
        }
      }
    }

    if (lastError) {
      console.error("All retry attempts failed:", lastError);
      throw lastError;
    }

    try {
      const data = await res.json();

      // Transform the data into { coin: { current, history: [] } }
      const formatted = {};

      if (Array.isArray(data?.data)) {
        data.data.forEach((item) => {
          const coin = item.symbol;
          const balance = Number(item.close);

          if (!formatted[coin]) formatted[coin] = { current: 0, history: [] };

          formatted[coin].history.push({
            datetime: item.datetime,
            contract: item.contract,
            balance,
          });
        });

        // Set current balance as the most recent close value
        for (const coin in formatted) {
          const sorted = formatted[coin].history.sort(
            (a, b) => new Date(b.datetime) - new Date(a.datetime)
          );
          formatted[coin].current = sorted[0]?.balance || 0;
          formatted[coin].history = sorted;
        }
      }

      return formatted;
    } catch (err) {
      console.error("The Graph fetch error:", err);
      return null;
    }
  }
  return { getBalances };
}
