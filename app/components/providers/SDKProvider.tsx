"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Only import SDK in Farcaster environments to prevent Chrome extension errors
let sdk: any = null;
let sdkImportError: string | null = null;

// Check if we're in a Farcaster environment before importing SDK
const isFarcasterEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.location.hostname.includes('warpcast.com') || 
    window.location.hostname.includes('farcaster.xyz') ||
    window.location.hostname.includes('farcaster.app') ||
    window.navigator.userAgent.includes('Farcaster') ||
    window.navigator.userAgent.includes('Warpcast') ||
    // Check for Farcaster-specific context
    !!(window as any).farcaster ||
    !!(window as any).warpcast ||
    // Check for Mini App specific context
    !!(window as any).farcasterMiniApp ||
    !!(window as any).farcasterFrame
  );
};

// Lazy import SDK only when needed
const importSDK = async () => {
  if (sdk) return sdk; // Already imported
  
  try {
    // Always import SDK for development/testing, but log environment
    const envCheck = isFarcasterEnvironment();
    console.log('🔧 Importing Farcaster MiniApp SDK...', { isFarcasterEnv: envCheck });
    
    const { sdk: importedSDK } = await import('@farcaster/miniapp-sdk');
    sdk = importedSDK;
    
    // Debug SDK import
    console.log('🔧 SDK import check:', {
      sdk: !!sdk,
      sdkType: typeof sdk,
      sdkKeys: sdk ? Object.keys(sdk) : 'undefined',
      actions: sdk?.actions ? Object.keys(sdk.actions) : 'undefined',
      haptics: sdk?.haptics ? Object.keys(sdk.haptics) : 'undefined'
    });
    
    return sdk;
  } catch (error) {
    console.error('❌ Failed to import Farcaster MiniApp SDK:', error);
    sdkImportError = error instanceof Error ? error.message : 'Unknown error';
    sdk = null;
    return null;
  }
};

interface SDKContextType {
  isSDKReady: boolean;
  sdkError: string | null;
  sdk: any;
  isFarcasterEnv: boolean;
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
  const [isFarcasterEnv, setIsFarcasterEnv] = useState(false);

  const initializeSDK = async () => {
    if (isInitializing || isInitialized) {
      console.log('🔄 SDK already initializing or initialized, skipping...');
      return;
    }

    setIsInitializing(true);
    setSdkError(null);

    try {
      console.log('🔄 Initializing Farcaster MiniApp SDK...');
      
      // Check environment first
      const envCheck = isFarcasterEnvironment();
      setIsFarcasterEnv(envCheck);
      
      console.log('🔍 Environment check:', {
        isFarcasterEnv: envCheck,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
      });

      // Always import SDK regardless of environment
      console.log('📦 Importing Farcaster MiniApp SDK...');
      const importedSDK = await importSDK();
      if (!importedSDK) {
        throw new Error('Failed to import SDK');
      }

      // Mark as initialized
      console.log('✅ Farcaster MiniApp SDK initialized');
      setIsInitialized(true);
      setSdkError(null);
      
      // Log available SDK actions for debugging
      console.log('🔧 Available SDK actions:', {
        ready: typeof importedSDK.actions.ready,
        composeCast: typeof importedSDK.actions.composeCast,
        openUrl: typeof importedSDK.actions.openUrl,
        haptics: {
          impactOccurred: typeof importedSDK.haptics.impactOccurred,
          notificationOccurred: typeof importedSDK.haptics.notificationOccurred,
          selectionChanged: typeof importedSDK.haptics.selectionChanged,
        }
      });

      // Always call ready() regardless of environment
      console.log('🔄 Auto-calling sdk.actions.ready() for all environments...');
      try {
        await callReady();
      } catch (readyError) {
        console.warn('⚠️ Auto-ready() call failed:', readyError);
        // Don't fail initialization if ready() fails
      }
      
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

  // Function to call ready() - works in all environments
  const callReady = async () => {
    if (!isInitialized) {
      console.log('⚠️ SDK not initialized yet, cannot call ready()');
      return;
    }

    if (isSDKReady) {
      console.log('✅ SDK already ready, skipping ready() call');
      return;
    }

    if (!sdk) {
      console.log('⚠️ SDK not available, cannot call ready()');
      return;
    }

    try {
      console.log('📞 Calling sdk.actions.ready() to display app...');
      console.log('🔧 SDK object available:', !!sdk);
      console.log('🔧 SDK actions available:', !!sdk.actions);
      console.log('🔧 SDK ready function available:', typeof sdk.actions.ready);
      console.log('🔧 Environment:', { isFarcasterEnv, hostname: typeof window !== 'undefined' ? window.location.hostname : 'server' });
      
      // Ensure we're calling ready() correctly
      if (typeof sdk.actions.ready === 'function') {
        console.log('🚀 Executing sdk.actions.ready()...');
        
        // Call ready() with disableNativeGestures option to prevent conflicts
        // as recommended in Base documentation for apps with gesture interactions
        await sdk.actions.ready({ disableNativeGestures: true });
        
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
        console.error('❌ sdk.actions.ready is not a function');
        console.error('🔧 Available actions:', sdk.actions ? Object.keys(sdk.actions) : 'none');
        throw new Error('sdk.actions.ready is not a function');
      }
      
    } catch (error) {
      console.error('❌ Failed to call sdk.actions.ready():', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSdkError(errorMessage);
      setIsSDKReady(false);
      
      // Log additional debugging info
      console.error('🔧 Debug info:', {
        sdkExists: !!sdk,
        actionsExist: !!sdk?.actions,
        readyExists: !!sdk?.actions?.ready,
        readyType: typeof sdk?.actions?.ready,
        sdkKeys: sdk ? Object.keys(sdk) : 'none',
        actionKeys: sdk?.actions ? Object.keys(sdk.actions) : 'none'
      });
      
      // Always attempt to mark as ready even if ready() fails
      console.log('ℹ️ Marking as ready despite ready() failure to prevent splash screen persistence');
      setIsSDKReady(true);
      setSdkError(null);
    }
  };

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      console.log('🌐 Browser environment detected, checking for Farcaster environment...');
      initializeSDK();
    } else {
      console.log('🖥️ Server environment, skipping SDK initialization');
    }
  }, []);

  // Auto-call ready() when SDK is initialized
  useEffect(() => {
    if (isInitialized && !isSDKReady && sdk && typeof window !== 'undefined') {
      console.log('🔄 Auto-calling sdk.actions.ready() after SDK initialization...');
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        callReady();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isSDKReady, sdk, callReady]);

  const value: SDKContextType = {
    isSDKReady,
    sdkError,
    sdk,
    isFarcasterEnv,
    initializeSDK,
    callReady,
  };

  return (
    <SDKContext.Provider value={value}>
      {children}
    </SDKContext.Provider>
  );
}
