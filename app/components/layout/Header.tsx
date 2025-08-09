"use client";

// import { Icon } from "../icons"; // Unused import
import { WalletConnect } from "../ui/WalletConnect";
// import { useUser } from "../../contexts/UserContext"; // Unused variables
import { useAccount } from "wagmi";
import { Avatar, Identity, Name, Badge } from '@coinbase/onchainkit/identity';
import { useEffect } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  // const { user, isAuthenticated } = useUser(); // Unused variables
  const { address, isConnected } = useAccount();

  // Debug logging for OnchainKit Identity
  useEffect(() => {
    if (isConnected && address) {
      console.log('🔍 Header: Wallet connected, address:', address);
    }
  }, [isConnected, address]);

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
                className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
              />
            </div>
          </div>

          {/* Wallet Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isConnected ? (
              // Show OnchainKit Identity when wallet is connected
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