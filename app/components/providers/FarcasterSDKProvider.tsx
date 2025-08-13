'use client';

import sdk from '@farcaster/miniapp-sdk';
import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface FarcasterSDKContextType {
  isSDKLoaded: boolean;
  context: any;
  openUrl: (url: string) => Promise<void>;
  close: () => Promise<void>;
  sdk: typeof sdk;
}

const FarcasterSDKContext = createContext<FarcasterSDKContextType | undefined>(undefined);

export function useFarcasterSDK() {
  const context = useContext(FarcasterSDKContext);
  if (context === undefined) {
    throw new Error('useFarcasterSDK must be used within a FarcasterSDKProvider');
  }
  return context;
}

// For backward compatibility with existing useSDK hooks
export function useSDK() {
  const context = useFarcasterSDK();
  return {
    isSDKReady: context.isSDKLoaded,
    sdkError: null,
    sdk: context.sdk,
  };
}

function useFrame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>();

  // SDK actions only work in mini app clients, so this pattern supports browser actions as well
  const openUrl = useCallback(
    async (url: string) => {
      if (context) {
        await sdk.actions.openUrl(url);
      } else {
        window.open(url, '_blank');
      }
    },
    [context]
  );

  const close = useCallback(async () => {
    if (context) {
      await sdk.actions.close();
    } else {
      window.close();
    }
  }, [context]);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('🔄 FarcasterSDK: Loading SDK context...');

        const context = await sdk.context;
        console.log('✅ FarcasterSDK: Context loaded:', !!context);

        setContext(context);
        setIsSDKLoaded(true);

        // Call ready action - this is the critical part!
        console.log('📞 FarcasterSDK: Calling sdk.actions.ready()...');
        await sdk.actions.ready();
        console.log('✅ FarcasterSDK: sdk.actions.ready() completed successfully!');

      } catch (error) {
        console.error('❌ FarcasterSDK: Failed to load SDK:', error);
        // Still mark as loaded to prevent infinite retry
        setIsSDKLoaded(true);
      }
    };

    if (sdk && !isSDKLoaded) {
      console.log('🔄 FarcasterSDK: Starting SDK initialization...');
      load();

      return () => {
        console.log('🧹 FarcasterSDK: Cleaning up event listeners...');
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  return {
    isSDKLoaded,
    context,
    openUrl,
    close,
  };
}

interface FarcasterSDKProviderProps {
  children: ReactNode;
}

export function FarcasterSDKProvider({ children }: FarcasterSDKProviderProps) {
  const frameContext = useFrame();

  const value: FarcasterSDKContextType = {
    ...frameContext,
    sdk,
  };

  return (
    <FarcasterSDKContext.Provider value={value}>
      {children}
    </FarcasterSDKContext.Provider>
  );
}
