// src/lib/reownConfig.js
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";

// your Reown project id (use NEXT_PUBLIC_ so it's available client-side)
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "ac56eb4d5d707a86d7f67c3bdbf0277f";

if (!projectId) {
  // don't crash hard in dev; you can set this in .env.local
  console.warn("Reown projectId not defined (NEXT_PUBLIC_PROJECT_ID or NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)");
}

export const networks = [mainnet, arbitrum];

// WagmiAdapter configuration
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

// Export wagmiConfig (client components will read wagmiAdapter.wagmiConfig)
export const wagmiConfig = wagmiAdapter.wagmiConfig;
