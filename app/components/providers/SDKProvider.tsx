"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

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
  const [sdkError, setSDKError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeSDK = async () => {
    if (isInitializing || isInitialized) {
      console.log('🔄 SDK already initializing or initialized, skipping...');
      return;
    }

    setIsInitializing(true);
    setSDKError(null);

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

      // Just mark as initialized, don't call ready() yet
      console.log('✅ Farcaster MiniApp SDK initialized (ready() will be called later)');
      setIsInitialized(true);
      setSDKError(null);
      
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
      setSDKError(errorMessage);
      setIsInitialized(false);
      
      // Still allow the app to function without SDK
      console.warn('⚠️ App will continue without Farcaster SDK functionality');
      console.warn('⚠️ This is normal when testing outside of Farcaster environment');
    } finally {
      setIsInitializing(false);
    }
  };

  // Separate function to call ready() - this should be called after app is fully loaded
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
      await sdk.actions.ready();
      
      console.log('✅ sdk.actions.ready() called successfully!');
      setIsSDKReady(true);
      setSDKError(null);
      
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
      
    } catch (error) {
      console.error('❌ Failed to call sdk.actions.ready():', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSDKError(errorMessage);
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
