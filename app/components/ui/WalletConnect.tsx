"use client";

import { useAccount, useDisconnect, useConnect } from "wagmi";
import { WalletDropdown, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { Button } from "./Button";
import { Icon } from "../icons";
import { useTracking } from "../analytics/Tracking";
import { useEffect, useState } from "react";
import { Identity, Name, Badge } from "@coinbase/onchainkit/identity";

interface WalletConnectProps {
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WalletConnect({ 
  variant = "button", 
  size = "md",
  className = "" 
}: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const tracking = useTracking();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (isMounted) {
      console.log('🔍 WalletConnect: useEffect triggered');
      console.log('🔍 WalletConnect: isConnected:', isConnected);
      console.log('🔍 WalletConnect: address:', address);
    }
  }, [isConnected, address, isMounted]);

  // Log render state
  if (isMounted) {
    console.log('🔍 WalletConnect: RENDER - isConnected:', isConnected, 'address:', address);
  }

  const handleDisconnect = () => {
    try {
      disconnect();
      tracking.walletDisconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={className}>
        <WalletDropdown>
          <div>Wallet Options</div>
        </WalletDropdown>
      </div>
    );
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    const skeletonSizes = {
      sm: "h-6 w-16",
      md: "h-8 w-20", 
      lg: "h-10 w-24",
      xl: "h-12 w-28"
    };
    
    return (
      <div className={className}>
        <div className={`${skeletonSizes[size]} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}></div>
      </div>
    );
  }

  // If connected, show disconnect button with identity info
  if (isConnected && address) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size={size}
            onClick={handleDisconnect}
            icon={<Icon name="close" size="sm" />}
          >
            <Identity
              address={address as `0x${string}`}
              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
              className="bg-transparent"
            >
              <Name className="text-xs sm:text-sm lg:text-base font-medium bg-transparent">
                <Badge className="bg-transparent" />
              </Name>
            </Identity>
          </Button>
        </div>
      </div>
    );
  }

  // If not connected, show connect button
  return (
    <div className={className}>
      <Button
        variant="primary"
        size={size}
        onClick={() => {
          const connector = connectors[0];
          if (connector) {
            connect({ connector });
          }
        }}
        className="min-w-0"
      >
        Connect Wallet
      </Button>
    </div>
  );
} 