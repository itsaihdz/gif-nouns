"use client";

import { Icon } from "../icons";
import { WalletConnect } from "../ui/WalletConnect";
import { useUser } from "../../contexts/UserContext";
import { useAccount } from "wagmi";
import { useFarcasterData } from "../../hooks/useFarcasterData";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user, isAuthenticated } = useUser();
  const { address, isConnected } = useAccount();
  const { farcasterUser, isLoading: farcasterLoading } = useFarcasterData();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="sparkles" className="text-white" size="sm" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Nouns Remix Studio
                </span>
              </div>
            </div>
          </div>

          {/* Single Wallet Indicator */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              farcasterUser ? (
                // Show Farcaster user info (username + PFP)
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                    <img 
                      src={farcasterUser.pfp} 
                      alt={`${farcasterUser.displayName}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/32/32?random=${farcasterUser.fid}`;
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {farcasterUser.displayName || farcasterUser.username}
                  </span>
                </div>
              ) : farcasterLoading ? (
                // Show loading state
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </span>
                </div>
              ) : (
                // Show wallet address
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Icon name="wallet" className="text-white" size="sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                    {formatAddress(address || "")}
                  </span>
                </div>
              )
            ) : (
              // Show connect wallet button
              <WalletConnect variant="button" size="md" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 