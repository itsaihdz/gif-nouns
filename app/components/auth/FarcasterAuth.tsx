"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { useUser } from "../../contexts/UserContext";

interface FarcasterAuthProps {
  className?: string;
}

export function FarcasterAuth({ className = "" }: FarcasterAuthProps) {
  const { user, login, logout, isLoading } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    setIsConnecting(true);
    setError("");

    try {
      // Test Neynar API connection first
      console.log("Testing Neynar API connection...");
      const testResponse = await fetch('/api/test/neynar?test=connection');
      const testResult = await testResponse.json();
      
      if (!testResult.success) {
        throw new Error('Failed to connect to Neynar API');
      }
      
      console.log("Neynar API connection successful:", testResult);
      
      // For now, simulate a login with a test user
      // In production, this would integrate with Warpcast's sign-in
      const testUserResponse = await fetch('/api/test/neynar?test=user&fid=12345');
      const userResult = await testUserResponse.json();
      
      if (userResult.success) {
        login(userResult.user);
        console.log("Farcaster login successful:", userResult.user);
      } else {
        throw new Error('Failed to fetch user data');
      }
      
    } catch (err) {
      console.error("Farcaster login error:", err);
      setError("Failed to login with Farcaster. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Card variant="outlined" className={`p-6 text-center ${className}`}>
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </Card>
    );
  }

  if (user) {
    return (
      <Card variant="outlined" className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.pfp}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.displayName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {user.followerCount} followers
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            icon={<Icon name="logout" size="sm" />}
          >
            Logout
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={`p-6 text-center ${className}`}>
      <div className="mb-4">
        <Icon name="farcaster" size="xl" className="text-purple-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect with Farcaster
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to create, vote, and share animated Nouns with the community
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        variant="gradient"
        size="lg"
        onClick={handleLogin}
        disabled={isConnecting}
        icon={<Icon name="farcaster" size="md" />}
        className="w-full"
      >
        {isConnecting ? "Connecting..." : "Connect with Farcaster"}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        By connecting, you agree to share your Farcaster profile data
      </p>
    </Card>
  );
} 