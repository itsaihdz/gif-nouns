'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SDKContextType {
  isSDKReady: boolean;
  sdkError: string | null;
  sdk: any;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

export function useSDK() {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error('useSDK must be used within a SimplifiedSDKProvider');
  }
  return context;
}

interface SimplifiedSDKProviderProps {
  children: ReactNode;
}

export function SimplifiedSDKProvider({ children }: SimplifiedSDKProviderProps) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        console.log('🔄 SimplifiedSDK: Starting initialization...');
        console.log('🔧 Environment check:', {
          hostname: window.location.hostname,
          userAgent: window.navigator.userAgent.substring(0, 100),
          pathname: window.location.pathname,
          search: window.location.search
        });
        
        // Import the SDK
        const { sdk: importedSDK } = await import('@farcaster/miniapp-sdk');
        
        if (!mounted) return;
        
        console.log('✅ SimplifiedSDK: SDK imported successfully');
        console.log('🔧 SDK structure:', {
          sdk: !!importedSDK,
          actions: !!importedSDK?.actions,
          ready: typeof importedSDK?.actions?.ready,
          haptics: !!importedSDK?.haptics
        });
        
        setSdk(importedSDK);
        
        // Validate that ready function exists
        if (typeof importedSDK.actions.ready !== 'function') {
          throw new Error('SDK ready function is not available');
        }
        
        // Call ready() once, as recommended in the debugging guide
        console.log('📞 SimplifiedSDK: Calling sdk.actions.ready()...');
        
        // Wait a moment for DOM to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await importedSDK.actions.ready({
          disableNativeGestures: true
        });
        
        if (!mounted) return;
        
        console.log('✅ SimplifiedSDK: ready() called successfully!');
        setIsSDKReady(true);
        setSdkError(null);
        
        // Optional: Test basic SDK functionality
        try {
          if (typeof importedSDK.haptics?.impactOccurred === 'function') {
            await importedSDK.haptics.impactOccurred('light');
            console.log('✅ SimplifiedSDK: Haptics test successful');
          }
        } catch (hapticError) {
          console.warn('⚠️ SimplifiedSDK: Haptics test failed (expected outside Farcaster):', hapticError);
        }
        
      } catch (error) {
        console.error('❌ SimplifiedSDK: Failed to initialize:', error);
        console.error('🔧 Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setSdkError(errorMessage);
        setIsSDKReady(false);
        
        // Don't fail completely - app should work without SDK
        console.log('⚠️ SimplifiedSDK: App will continue without SDK functionality');
      }
    };

    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      // Check if document is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSDK);
      } else {
        // DOM is already ready
        initializeSDK();
      }
    }

    return () => {
      mounted = false;
      if (typeof document !== 'undefined') {
        document.removeEventListener('DOMContentLoaded', initializeSDK);
      }
    };
  }, []);

  const value: SDKContextType = {
    isSDKReady,
    sdkError,
    sdk,
  };

  return (
    <SDKContext.Provider value={value}>
      {children}
    </SDKContext.Provider>
  );
}