"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectWallet, WalletDropdown } from "@coinbase/onchainkit/wallet";
import { Button } from "./Button";
import { Icon } from "../icons";
import { Loading } from "./Loading";
import { useTracking } from "../analytics/Tracking";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";

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
  const { user, isAuthenticated, login, logout } = useUser();
  const [isConnectingFarcaster, setIsConnectingFarcaster] = useState(false);

  const handleDisconnect = () => {
    try {
      disconnect();
      logout(); // Also logout from Farcaster
      tracking.walletDisconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  const handleFarcasterLogin = async () => {
    if (!isConnected) {
      console.log("Wallet not connected, cannot connect Farcaster");
      return;
    }

    setIsConnectingFarcaster(true);
    try {
      // Simulate Farcaster login with mock data for now
      // In a real implementation, this would use the Farcaster SDK
      const mockUser = {
        fid: 12345,
        username: "stinos",
        displayName: "Stijn den Engelse",
        pfp: "https://i.imgur.com/eZwqtXK.jpg",
        followerCount: 195,
        followingCount: 180,
      };
      
      login(mockUser);
      console.log("Farcaster login successful:", mockUser);
    } catch (error) {
      console.error("Farcaster login error:", error);
    } finally {
      setIsConnectingFarcaster(false);
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

  // If Farcaster user is authenticated, show user info
  if (isAuthenticated && user) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Connected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* PFP */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
              <img 
                src={user.pfp} 
                alt={`${user.displayName}'s profile`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/32/32?random=${user.fid}`;
                }}
              />
            </div>
            {/* Username */}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {user.displayName || user.username}
            </span>
          </div>
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

  // If wallet is connected but no Farcaster user, show connect Farcaster option
  if (isConnected && !isAuthenticated) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Wallet Connected
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatAddress(address || "")}
          </span>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleFarcasterLogin}
            disabled={isConnectingFarcaster}
            icon={isConnectingFarcaster ? <Loading variant="dots" size="sm" /> : <Icon name="user" size="sm" />}
          >
            {isConnectingFarcaster ? "Connecting..." : "Connect Farcaster"}
          </Button>
        </div>
      </div>
    );
  }

  // Default wallet connect state
  return (
    <div className={className}>
      {isConnecting ? (
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