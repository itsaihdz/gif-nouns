"use client";

import { WalletConnect } from "../ui/WalletConnect";
import { useAccount } from "wagmi";
import { Avatar, Identity, Name, Badge } from '@coinbase/onchainkit/identity';
import { useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (isMounted) {
      console.log('🔍 Header: Wallet state changed - isConnected:', isConnected, 'address:', address);
    }
  }, [isConnected, address, isMounted]);

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
            {isMounted && isConnected && address ? (
              // Show wallet address when connected (simplified for testing)
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
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