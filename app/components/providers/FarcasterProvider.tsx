"use client";

import { createContext, useContext, useEffect, useState } from 'react';

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
        console.log('🏗️ FarcasterProvider: Starting initialization...');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('❌ Not in browser environment, skipping SDK initialization');
          setIsReady(true);
          return;
        }
        
        // Try to import the SDK dynamically
        try {
          const { sdk } = await import('@farcaster/miniapp-sdk');
          console.log('📦 SDK imported successfully in provider:', sdk);
          console.log('🔧 SDK actions in provider:', sdk.actions);
          
          // Call ready() to signal that the app is ready
          console.log('📞 FarcasterProvider: Calling sdk.actions.ready()...');
          await sdk.actions.ready();
          console.log('✅ FarcasterProvider: SDK ready() called successfully');
          setIsReady(true);
        } catch (importError) {
          console.log('⚠️ SDK import failed in provider (normal in regular browser):', importError);
          console.log('ℹ️ This is expected when not running in a Farcaster Mini App environment');
          setIsReady(true);
        }
      } catch (err) {
        console.error('❌ FarcasterProvider: Failed to initialize SDK:', err);
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