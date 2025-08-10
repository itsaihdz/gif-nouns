"use client";

import { useAccount, useDisconnect } from "wagmi";
import { WalletDropdown, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { Button } from "./Button";
import { Icon } from "../icons";
import { useTracking } from "../analytics/Tracking";
import { useEffect, useState } from "react";

interface WalletConnectProps {
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WalletConnect({ 
  variant = "button", 
  className = "" 
}: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
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
        <WalletDropdown />
      </div>
    );
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className={className}>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // If connected, show disconnect button
  if (isConnected && address) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            icon={<Icon name="close" size="sm" />}
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  // If not connected, show connect button
  return (
    <div className={className}>
      <ConnectWallet />
    </div>
  );
} 