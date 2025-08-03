"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

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
    const initializeFarcaster = async () => {
      try {
        console.log('🔄 Initializing Farcaster Mini App...');
        
        // Call sdk.actions.ready() to hide splash screen and display content
        // This is required by the Farcaster Mini Apps documentation
        await sdk.actions.ready();
        
        console.log('✅ Farcaster Mini App ready!');
        setIsReady(true);
      } catch (err) {
        console.error('❌ Failed to initialize Farcaster Mini App:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Farcaster Mini App');
        // Still set ready to true to prevent infinite loading
        setIsReady(true);
      }
    };

    // Initialize after a short delay to ensure the app is fully loaded
    const timer = setTimeout(initializeFarcaster, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <FarcasterContext.Provider value={{ isReady, error }}>
      {children}
    </FarcasterContext.Provider>
  );
} 