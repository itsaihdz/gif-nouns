"use client";

// import { Icon } from "../icons"; // Unused import
import { WalletConnect } from "../ui/WalletConnect";
// import { useUser } from "../../contexts/UserContext"; // Unused import
import { useAccount } from "wagmi";
import { useFarcasterData } from "../../hooks/useFarcasterData";
import { Avatar, Identity, Name, Badge } from '@coinbase/onchainkit/identity';

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  // const { user, isAuthenticated } = useUser(); // Unused variables
  const { address, isConnected } = useAccount();
  const { farcasterUser, isLoading: farcasterLoading } = useFarcasterData();

  // const formatAddress = (addr: string) => { // Unused function
  //   return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  // };

  return (
    <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-sm mx-auto px-3 sm:max-w-md sm:px-4 md:max-w-2xl lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
          {/* Logo */}
          <div className="flex items-center py-4">
            <div className="flex-shrink-0">
              <img 
                src="/gifnouns.svg" 
                alt="GifNouns" 
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
              />
            </div>
          </div>

          {/* Wallet Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isConnected ? (
              farcasterUser ? (
                // Show Farcaster user info (username + PFP)
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                    <img 
                      src={farcasterUser.pfp} 
                      alt={`${farcasterUser.displayName}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block max-w-20 lg:max-w-none truncate">
                    {farcasterUser.displayName || farcasterUser.username}
                  </span>
                </div>
              ) : farcasterLoading ? (
                // Show loading state
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                    Loading...
                  </span>
                </div>
              ) : (
                // Show OnchainKit Identity (ENS name, avatar, verification)
                <Identity
                  address={address as `0x${string}`}
                  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                >
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Avatar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    <Name className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">
                      <Badge />
                    </Name>
                  </div>
                </Identity>
              )
            ) : (
              // Show connect wallet button
              <WalletConnect variant="button" size="sm" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 