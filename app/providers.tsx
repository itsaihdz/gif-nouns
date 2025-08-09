"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";

// Create a query client
const queryClient = new QueryClient();

// Configure wagmi config without WalletConnect to avoid TypeScript issues
const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Nouns Remix Studio" }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers(props: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_CDP_CLIENT_API_KEY;
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          apiKey={apiKey || "placeholder"} // Use placeholder if no API key to avoid build errors
          chain={base}
        >
          {props.children}
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
