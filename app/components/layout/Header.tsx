"use client";

import { Icon } from "../icons";
import { WalletConnect } from "../ui/WalletConnect";
import { useUser } from "../../contexts/UserContext";
import { useAccount } from "wagmi";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user, isAuthenticated } = useUser();
  const { isConnected } = useAccount();

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

          {/* User Info / Wallet Connect */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              // Show Farcaster user info alongside wallet
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {/* PFP */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                    <img 
                      src={user.pfp} 
                      alt={`${user.displayName}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to default PFP if image fails to load
                        (e.target as HTMLImageElement).src = `https://picsum.photos/32/32?random=${user.fid}`;
                      }}
                    />
                  </div>
                  {/* Username */}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.displayName || user.username}
                  </span>
                </div>
                {/* MiniKit Wallet Connect */}
                <WalletConnect variant="button" size="md" />
              </div>
            ) : (
              // Show only MiniKit wallet connect
              <WalletConnect variant="button" size="md" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 