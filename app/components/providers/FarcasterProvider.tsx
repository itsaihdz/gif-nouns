"use client";

import { createContext, useContext, useEffect, useState } from 'react';

// Extend Window interface for Farcaster
declare global {
  interface Window {
    farcaster?: {
      actions: {
        ready(): Promise<void>;
      };
    };
  }
}

interface FarcasterContextType {
  isReady: boolean;
  error: string | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isReady: false,
  error: null,
});

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFrame = async () => {
      try {
        // Check if we're in a Farcaster Frame environment
        if (typeof window !== 'undefined' && window.farcaster) {
          // Call ready() to signal that the app is ready
          await window.farcaster.actions.ready();
          console.log('Farcaster Frame SDK ready() called successfully');
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize Farcaster Frame SDK:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Still mark as ready even if there's an error
        setIsReady(true);
      }
    };

    initializeFrame();
  }, []);

  return (
    <FarcasterContext.Provider value={{ isReady, error }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error('useFarcaster must be used within a FarcasterProvider');
  }
  return context;
} 