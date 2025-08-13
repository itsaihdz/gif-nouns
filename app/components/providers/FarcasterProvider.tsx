"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';

interface FarcasterContextType {
  isReady: boolean;
  error: string | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isReady: false,
  error: null,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

interface FarcasterProviderProps {
  children: ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip Farcaster SDK initialization for now to prevent loading issues
    console.log('🔄 Skipping Farcaster SDK initialization to prevent loading issues...');
    
    // Set ready immediately to allow the app to load
    setTimeout(() => {
      setIsReady(true);
      setError('Farcaster integration temporarily disabled');
      console.log('✅ App ready (Farcaster integration disabled)');
    }, 100);
  }, []);

  const value = useMemo(() => ({
    isReady,
    error
  }), [isReady, error]);

  return (
    <FarcasterContext.Provider value={value}>
      {children}
    </FarcasterContext.Provider>
  );
} 