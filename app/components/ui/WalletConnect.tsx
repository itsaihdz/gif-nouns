"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectWallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
import { Button } from "./Button";
import { Icon } from "../icons";
import { Loading } from "./Loading";
import { useTracking } from "../analytics/Tracking";

interface WalletConnectProps {
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WalletConnect({ 
  variant = "button", 
  className = "" 
}: WalletConnectProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { error } = useConnect();
  const { disconnect } = useDisconnect();
  const tracking = useTracking();

  const handleDisconnect = () => {
    try {
      disconnect();
      tracking.walletDisconnect();
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
      ) : isConnecting ? (
        <div className="flex items-center space-x-2">
          <Loading variant="dots" size="sm" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Connecting...
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <ConnectWallet />
          {error && (
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