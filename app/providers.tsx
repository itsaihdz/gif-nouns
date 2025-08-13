"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { type Chain } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { useEffect } from "react";
import { SimplifiedSDKProvider } from "./components/providers/SimplifiedSDKProvider";
import { MiniAppEmbed } from "./components/providers/MiniAppEmbed";

// Create a query client
const queryClient = new QueryClient();

// Configure wagmi config without WalletConnect to avoid TypeScript issues
const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "GifNouns" }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers(props: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  
  // Only log on client side to prevent hydration mismatch
  useEffect(() => {
    console.log('🔧 Providers: OnchainKit API Key:', apiKey ? `${apiKey.slice(0, 8)}...` : 'NOT SET');
    console.log('🔧 Providers: Environment:', process.env.NODE_ENV);
    console.log('🔧 Providers: Wagmi config:', config);
    console.log('🔧 Providers: Base chain ID:', base.id);
  }, [apiKey]);
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base as Chain}>
          <MiniKitProvider chain={base as Chain}>
            <SimplifiedSDKProvider>
              <MiniAppEmbed>
                {props.children}
              </MiniAppEmbed>
            </SimplifiedSDKProvider>
          </MiniKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
