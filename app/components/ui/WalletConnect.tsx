"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectWallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
import { Button } from "./Button";
import { Icon } from "../icons";

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
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [showError, setShowError] = useState(false);

  const handleConnect = async () => {
    try {
      setShowError(false);
      // MiniKit will handle the connection flow
    } catch (err) {
      console.error("Connection error:", err);
      setShowError(true);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (variant === "dropdown") {
    return (
      <div className={className}>
        <WalletDropdown />
      </div>
    );
  }

  return (
    <div className={className}>
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Connected
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
            {formatAddress(address || "")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            icon={<Icon name="close" size="sm" />}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <ConnectWallet />
          {showError && error && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Icon name="close" size="sm" className="text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error.message || "Failed to connect wallet"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 