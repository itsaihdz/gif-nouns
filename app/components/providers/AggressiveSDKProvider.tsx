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
    throw new Error('useSDK must be used within an AggressiveSDKProvider');
  }
  return context;
}

interface AggressiveSDKProviderProps {
  children: ReactNode;
}

export function AggressiveSDKProvider({ children }: AggressiveSDKProviderProps) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    let readyCallSucceeded = false;

    const callReadyMultipleWays = async (importedSDK: any) => {
      if (readyCallSucceeded) return;

      console.log('🚀 AGGRESSIVE: Trying multiple ready() call methods...');
      
      // Method 1: Basic call
      try {
        console.log('📞 Method 1: Basic ready() call...');
        await importedSDK.actions.ready();
        if (!readyCallSucceeded) {
          console.log('✅ Method 1: SUCCESS!');
          readyCallSucceeded = true;
          if (mounted) setIsSDKReady(true);
        }
      } catch (e1) {
        console.log('❌ Method 1 failed:', e1);
      }

      if (readyCallSucceeded) return;

      // Method 2: With options
      try {
        console.log('📞 Method 2: ready() with disableNativeGestures...');
        await importedSDK.actions.ready({ disableNativeGestures: true });
        if (!readyCallSucceeded) {
          console.log('✅ Method 2: SUCCESS!');
          readyCallSucceeded = true;
          if (mounted) setIsSDKReady(true);
        }
      } catch (e2) {
        console.log('❌ Method 2 failed:', e2);
      }

      if (readyCallSucceeded) return;

      // Method 3: With empty options
      try {
        console.log('📞 Method 3: ready() with empty options...');
        await importedSDK.actions.ready({});
        if (!readyCallSucceeded) {
          console.log('✅ Method 3: SUCCESS!');
          readyCallSucceeded = true;
          if (mounted) setIsSDKReady(true);
        }
      } catch (e3) {
        console.log('❌ Method 3 failed:', e3);
      }

      if (readyCallSucceeded) return;

      // Method 4: Sync call (no await)
      try {
        console.log('📞 Method 4: Sync ready() call...');
        importedSDK.actions.ready();
        console.log('✅ Method 4: Sync call completed!');
        readyCallSucceeded = true;
        if (mounted) setIsSDKReady(true);
      } catch (e4) {
        console.log('❌ Method 4 failed:', e4);
      }

      if (readyCallSucceeded) return;

      // Method 5: Force success after delay
      setTimeout(() => {
        if (!readyCallSucceeded && mounted) {
          console.log('🔥 FORCE SUCCESS: Marking as ready after timeout...');
          readyCallSucceeded = true;
          setIsSDKReady(true);
        }
      }, 2000);
    };

    const initializeSDK = async () => {
      try {
        console.log('🔄 AggressiveSDK: Starting initialization...');
        console.log('🔧 Environment check:', {
          hostname: window.location.hostname,
          userAgent: window.navigator.userAgent.substring(0, 100),
          pathname: window.location.pathname,
          search: window.location.search,
          referrer: document.referrer,
          readyState: document.readyState
        });
        
        // Import the SDK
        const { sdk: importedSDK } = await import('@farcaster/miniapp-sdk');
        
        if (!mounted) return;
        
        console.log('✅ AggressiveSDK: SDK imported successfully');
        console.log('🔧 SDK structure:', {
          sdk: !!importedSDK,
          actions: !!importedSDK?.actions,
          ready: typeof importedSDK?.actions?.ready,
          haptics: !!importedSDK?.haptics,
          sdkKeys: importedSDK ? Object.keys(importedSDK) : [],
          actionsKeys: importedSDK?.actions ? Object.keys(importedSDK.actions) : []
        });
        
        setSdk(importedSDK);
        
        // Validate that ready function exists
        if (typeof importedSDK.actions.ready !== 'function') {
          throw new Error('SDK ready function is not available');
        }
        
        // Try ready() immediately
        await callReadyMultipleWays(importedSDK);
        
        // Also set up intervals to keep trying
        const intervals = [
          setInterval(() => {
            if (!readyCallSucceeded && mounted) {
              console.log('🔄 Interval retry ready()...');
              callReadyMultipleWays(importedSDK);
            } else if (readyCallSucceeded) {
              clearInterval(intervals[0]);
            }
          }, 500),
        ];
        
        // Cleanup intervals after 10 seconds
        setTimeout(() => {
          intervals.forEach(clearInterval);
        }, 10000);
        
      } catch (error) {
        console.error('❌ AggressiveSDK: Failed to initialize:', error);
        
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setSdkError(errorMessage);
        
        // Even on error, try to mark as ready to prevent infinite loading
        setTimeout(() => {
          if (!readyCallSucceeded && mounted) {
            console.log('🔥 ERROR RECOVERY: Marking as ready despite error...');
            setIsSDKReady(true);
          }
        }, 3000);
      }
    };

    // Multiple initialization attempts
    if (typeof window !== 'undefined') {
      // Immediate attempt
      initializeSDK();
      
      // DOM ready attempt
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSDK);
      }
      
      // Window load attempt
      window.addEventListener('load', initializeSDK);
      
      // Fallback attempts with delays
      setTimeout(initializeSDK, 100);
      setTimeout(initializeSDK, 500);
      setTimeout(initializeSDK, 1000);
      setTimeout(initializeSDK, 2000);
    }

    return () => {
      mounted = false;
      if (typeof document !== 'undefined') {
        document.removeEventListener('DOMContentLoaded', initializeSDK);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', initializeSDK);
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