"use client";

import { Icon } from "../icons";
import { WalletConnect } from "../ui/WalletConnect";
import { useUser } from "../../contexts/UserContext";
import { useAccount } from "wagmi";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const { user, isAuthenticated, logout } = useUser();
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
              // Show Farcaster user info
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
                <button
                  onClick={logout}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Disconnect"
                >
                  <Icon name="close" size="sm" />
                </button>
              </div>
            ) : isConnected ? (
              // Show wallet info if connected but no Farcaster user
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Wallet Connected
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Connect Farcaster to continue
                </span>
              </div>
            ) : (
              // Show wallet connect button
              <WalletConnect variant="button" size="md" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 