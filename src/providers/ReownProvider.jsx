// src/providers/ReownProvider.jsx
"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, projectId } from "../lib/reownConfig";
import { WagmiProvider, cookieToInitialState } from "wagmi";

/**
 * This provider creates the Reown AppKit modal and wraps the app with WagmiProvider & QueryClientProvider
 * It must be a client component.
 */
export default function ReownProvider({ children }) {
  const queryClientRef = React.useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const queryClient = queryClientRef.current;

  // Create modal once on client
  const modalRef = React.useRef();
  if (!modalRef.current) {
    const metadata = {
      name: "cipher",
      description: "CipherHealth dApp",
      url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      icons: [],
    };

    modalRef.current = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: wagmiAdapter.networks,
      defaultNetwork: wagmiAdapter.networks?.[0],
      metadata,
      features: { analytics: false },
    });
  }
  const modal = modalRef.current;

  // Build initialState from cookies (for SSR hydration you'd pass cookies)
  const initialState = React.useMemo(() => {
    try {
      // cookieToInitialState expects server cookie string; for client, pass null to use storage
      return cookieToInitialState(wagmiAdapter.wagmiConfig, null);
    } catch (e) {
      return undefined;
    }
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      {/* Optionally expose modal for debugging:
          window.__APPKIT_MODAL = modal
      */}
    </WagmiProvider>
  );
}
