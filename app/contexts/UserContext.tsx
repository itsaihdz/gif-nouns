"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useFarcasterData } from "../hooks/useFarcasterData";

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

interface UserContextType {
  user: FarcasterUser | null;
  isLoading: boolean;
  login: (userData: FarcasterUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { farcasterUser, isLoading: farcasterLoading } = useFarcasterData();

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 UserContext: Starting auth check...');
      try {
        const storedUser = localStorage.getItem("farcaster_user");
        console.log('📦 UserContext: Stored user data:', storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('✅ UserContext: Found user data:', userData);
          setUser(userData);
        } else {
          console.log('ℹ️ UserContext: No stored user data found');
        }
      } catch (error) {
        console.error("❌ UserContext: Error loading user from storage:", error);
        localStorage.removeItem("farcaster_user");
      } finally {
        console.log('🏁 UserContext: Setting isLoading to false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update user when Farcaster data is fetched
  useEffect(() => {
    if (farcasterUser && !farcasterLoading) {
      console.log('🔄 UserContext: Updating user with Farcaster data:', farcasterUser);
      setUser(farcasterUser);
      localStorage.setItem("farcaster_user", JSON.stringify(farcasterUser));
    } else if (!farcasterUser && !farcasterLoading) {
      console.log('🔄 UserContext: Clearing user data - no Farcaster user found');
      setUser(null);
      localStorage.removeItem("farcaster_user");
    }
  }, [farcasterUser, farcasterLoading]);

  const login = (userData: FarcasterUser) => {
    console.log('🔐 UserContext: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem("farcaster_user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log('🚪 UserContext: Logging out user');
    setUser(null);
    localStorage.removeItem("farcaster_user");
  };

  const value: UserContextType = {
    user,
    isLoading: isLoading || farcasterLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  console.log('🔄 UserContext: Current state:', { user, isLoading: isLoading || farcasterLoading, isAuthenticated: !!user });

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
} 