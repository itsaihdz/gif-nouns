"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

// Debug SDK import
console.log('🔧 SDK import check:', {
  sdk: !!sdk,
  sdkType: typeof sdk,
  sdkKeys: sdk ? Object.keys(sdk) : 'undefined',
  actions: sdk?.actions ? Object.keys(sdk.actions) : 'undefined',
  haptics: sdk?.haptics ? Object.keys(sdk.haptics) : 'undefined'
});

interface SDKContextType {
  isSDKReady: boolean;
  sdkError: string | null;
  sdk: typeof sdk;
  initializeSDK: () => Promise<void>;
  callReady: () => Promise<void>;
}

const SDKContext = createContext<SDKContextType | undefined>(undefined);

export function useSDK() {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error('useSDK must be used within a SDKProvider');
  }
  return context;
}

interface SDKProviderProps {
  children: ReactNode;
}

export function SDKProvider({ children }: SDKProviderProps) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeSDK = async () => {
    if (isInitializing || isInitialized) {
      console.log('🔄 SDK already initializing or initialized, skipping...');
      return;
    }

    setIsInitializing(true);
    setSdkError(null);

    try {
      console.log('🔄 Initializing Farcaster MiniApp SDK...');
      
      // Check if we're in a Farcaster environment
      const isFarcasterEnv = typeof window !== 'undefined' && 
        (window.location.hostname.includes('warpcast.com') || 
         window.location.hostname.includes('farcaster.xyz') ||
         window.navigator.userAgent.includes('Farcaster'));
      
      console.log('🔍 Environment check:', {
        isFarcasterEnv,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
      });

      if (!isFarcasterEnv) {
        console.log('ℹ️ Not in Farcaster environment, SDK will be limited');
        // Still try to initialize but expect limited functionality
      }

      // Mark as initialized
      console.log('✅ Farcaster MiniApp SDK initialized');
      setIsInitialized(true);
      setSdkError(null);
      
      // Log available SDK actions for debugging
      console.log('🔧 Available SDK actions:', {
        ready: typeof sdk.actions.ready,
        composeCast: typeof sdk.actions.composeCast,
        openUrl: typeof sdk.actions.openUrl,
        haptics: {
          impactOccurred: typeof sdk.haptics.impactOccurred,
          notificationOccurred: typeof sdk.haptics.notificationOccurred,
          selectionChanged: typeof sdk.haptics.selectionChanged,
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize Farcaster MiniApp SDK:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSdkError(errorMessage);
      setIsInitialized(false);
      
      // Still allow the app to function without SDK
      console.warn('⚠️ App will continue without Farcaster SDK functionality');
      console.warn('⚠️ This is normal when testing outside of Farcaster environment');
    } finally {
      setIsInitializing(false);
    }
  };

  // Function to call ready() - simplified logic
  const callReady = async () => {
    if (!isInitialized) {
      console.log('⚠️ SDK not initialized yet, cannot call ready()');
      return;
    }

    if (isSDKReady) {
      console.log('✅ SDK already ready, skipping ready() call');
      return;
    }

    try {
      console.log('📞 Calling sdk.actions.ready() to display app...');
      console.log('🔧 SDK object available:', !!sdk);
      console.log('🔧 SDK actions available:', !!sdk.actions);
      console.log('🔧 SDK ready function available:', typeof sdk.actions.ready);
      
      // Ensure we're calling ready() correctly
      if (typeof sdk.actions.ready === 'function') {
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called successfully!');
        setIsSDKReady(true);
        setSdkError(null);
        
        // Test basic SDK functionality after ready
        try {
          if (typeof sdk.haptics.impactOccurred === 'function') {
            console.log('🧪 Testing haptics after ready...');
            await sdk.haptics.impactOccurred('light');
            console.log('✅ Haptics test successful');
          }
        } catch (hapticError) {
          console.warn('⚠️ Haptics test failed (expected in non-Farcaster environments):', hapticError);
        }
      } else {
        throw new Error('sdk.actions.ready is not a function');
      }
      
    } catch (error) {
      console.error('❌ Failed to call sdk.actions.ready():', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSdkError(errorMessage);
      setIsSDKReady(false);
    }
  };

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      console.log('🌐 Browser environment detected, initializing SDK...');
      initializeSDK();
    } else {
      console.log('🖥️ Server environment, skipping SDK initialization');
    }
  }, []);

  // Auto-call ready() when SDK is initialized and we're in a Farcaster environment
  useEffect(() => {
    if (isInitialized && !isSDKReady && typeof window !== 'undefined') {
      const isFarcasterEnv = window.location.hostname.includes('warpcast.com') || 
                             window.location.hostname.includes('farcaster.xyz') ||
                             window.navigator.userAgent.includes('Farcaster');
      
      if (isFarcasterEnv) {
        console.log('🔄 Auto-calling sdk.actions.ready() for Farcaster environment...');
        // Small delay to ensure everything is loaded
        const timer = setTimeout(() => {
          callReady();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialized, isSDKReady]);

  const value: SDKContextType = {
    isSDKReady,
    sdkError,
    sdk,
    initializeSDK,
    callReady,
  };

  return (
    <SDKContext.Provider value={value}>
      {children}
    </SDKContext.Provider>
  );
}
