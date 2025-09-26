"use client";

import { useWallet } from "@/providers/WalletProvider";

const BASE_URL = "https://token-api.thegraph.com/historical/balances/evm";
const TOKEN =
  "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTQ5MDA5NDAsImp0aSI6IjA1M2QzZGQxLWU5N2QtNDdhNC1hZTllLTYwMDk5YjFlNTJmOCIsImlhdCI6MTc1ODkwMDk0MCwiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiIwdnlqdTJlMTIxZTEwNzM3NDI2NTciLCJ2IjoyLCJha2kiOiJiMjFkY2FhNjEzYzYwNzk3YzIwZjExNGFjYjgyMGRkZjZiMWE5ZDRjZDAzZThjZDBiNzk1Y2MxNjJkZWUzZDUyIiwidWlkIjoiMHZ5anUyZTEyMWUxMDczNzQyNjU3Iiwic3Vic3RyZWFtc19wbGFuX3RpZXIiOiJGUkVFIiwiY2ZnIjp7IlNVQlNUUkVBTVNfTUFYX1JFUVVFU1RTIjoiMiIsIlNVQlNUUkVBTVNfUEFSQUxMRUxfSk9CUyI6IjUiLCJTVUJTVFJFQU1TX1BBUkFMTEVMX1dPUktFUlMiOiI1In19.WufuezRWNvZSFNkR6_1UYZAAILFAcYrZmzTzRPWxTT2Eor0VKtD-XOCgDUTQ4ofrmh0ofbQrc1SCGdtgfpwvDA";

export function useTheGraph() {
  const { address } = useWallet();

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

    const url = `${BASE_URL}/${address}?network_id=mainnet&startTime=${startTime}&endTime=${endTime}&limit=${limit}&page=${page}`;

    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${TOKEN}` },
    };

    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const text = await res.text(); // log raw error
        console.error(`The Graph API returned HTTP ${res.status}:`, text);
        return null;
      }

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
