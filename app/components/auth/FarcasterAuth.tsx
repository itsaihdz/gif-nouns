"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

interface FarcasterAuthProps {
  onLogin: (user: FarcasterUser) => void;
  onLogout: () => void;
  className?: string;
}

export function FarcasterAuth({ onLogin, onLogout, className = "" }: FarcasterAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [error, setError] = useState<string>("");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("farcaster_user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          onLogin(userData);
        } catch (err) {
          localStorage.removeItem("farcaster_user");
        }
      }
    };
    
    checkAuth();
  }, [onLogin]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual Farcaster login
      // This would typically involve:
      // 1. Opening Farcaster sign-in modal
      // 2. Getting user's FID and profile data
      // 3. Storing authentication state
      
      // Mock login for now
      const mockUser: FarcasterUser = {
        fid: 12345,
        username: "you.noun",
        displayName: "Your Noun",
        pfp: "https://picsum.photos/32/32?random=8",
        followerCount: 42,
        followingCount: 38
      };

      // Store user data
      localStorage.setItem("farcaster_user", JSON.stringify(mockUser));
      setUser(mockUser);
      onLogin(mockUser);

      console.log("Farcaster login successful:", mockUser);
      
    } catch (err) {
      console.error("Farcaster login error:", err);
      setError("Failed to login with Farcaster. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("farcaster_user");
    setUser(null);
    onLogout();
  };

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
        disabled={isLoading}
        icon={<Icon name="farcaster" size="md" />}
        className="w-full"
      >
        {isLoading ? "Connecting..." : "Connect with Farcaster"}
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        By connecting, you agree to share your Farcaster profile data
      </p>
    </Card>
  );
} 