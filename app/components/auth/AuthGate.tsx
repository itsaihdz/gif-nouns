"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { useAccount } from "wagmi";
import { useUser } from "../../contexts/UserContext";

interface AuthGateProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthGate({ children, className = "" }: AuthGateProps) {
  const { address, isConnected } = useAccount();
  const { user, isLoading } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  console.log('🔐 AuthGate: Current state:', { 
    isConnected, 
    user: user ? `@${user.username}` : null, 
    isLoading,
    showAuth 
  });

  useEffect(() => {
    // Show auth gate if user is not connected to wallet OR not logged into Farcaster
    const needsAuth = !isConnected || !user;
    console.log('🔐 AuthGate: needsAuth calculation:', { 
      isConnected, 
      hasUser: !!user, 
      needsAuth 
    });
    setShowAuth(needsAuth);
  }, [isConnected, user]);

  if (isLoading) {
    console.log('⏳ AuthGate: Showing loading state');
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Connecting...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    console.log('🔒 AuthGate: Showing auth gate');
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <Card variant="outlined" className="max-w-md mx-auto p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lock" className="text-white" size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to GifNouns
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your wallet and Farcaster account to start creating animated Nouns
            </p>
          </div>

          <div className="space-y-4">
            {/* Wallet Connection Status */}
            <div className={`p-4 rounded-lg border ${isConnected ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={isConnected ? "check-circle" : "wallet"} className={isConnected ? "text-green-600" : "text-gray-400"} size="md" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Wallet</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Not connected"}
                    </p>
                  </div>
                </div>
                {!isConnected && (
                  <Button variant="outline" size="sm" onClick={() => setShowAuth(false)}>
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Farcaster Connection Status */}
            <div className={`p-4 rounded-lg border ${user ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={user ? "check-circle" : "farcaster"} className={user ? "text-green-600" : "text-gray-400"} size="md" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Farcaster</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user ? `Connected as @${user.username}` : "Not connected"}
                    </p>
                  </div>
                </div>
                {!user && (
                  <Button variant="outline" size="sm" onClick={() => setShowAuth(false)}>
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              variant="gradient" 
              size="lg" 
              onClick={() => setShowAuth(false)}
              className="w-full"
              icon={<Icon name="sparkles" size="md" />}
            >
              Get Started
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            By connecting, you agree to our terms and privacy policy
          </p>
        </Card>
      </div>
    );
  }

  console.log('✅ AuthGate: Showing main content');
  return <>{children}</>;
} 