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
    throw new Error('useSDK must be used within a GlobalSDKProvider');
  }
  return context;
}

interface GlobalSDKProviderProps {
  children: ReactNode;
}

export function GlobalSDKProvider({ children }: GlobalSDKProviderProps) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const findSDKGlobally = () => {
      console.log('🔍 GlobalSDK: Looking for Farcaster SDK in global scope...');
      
      // Check for SDK injected by Farcaster client
      const possibleSDKPaths = [
        ['window.farcaster', () => (window as any).farcaster],
        ['window.sdk', () => (window as any).sdk], 
        ['window.FarcasterSDK', () => (window as any).FarcasterSDK],
        ['window.miniappSDK', () => (window as any).miniappSDK],
        ['window.farcasterMiniApp', () => (window as any).farcasterMiniApp],
        ['window.parent.farcaster', () => window.parent && (window.parent as any).farcaster],
        ['window.parent.sdk', () => window.parent && (window.parent as any).sdk]
      ];
      
      for (const [path, getter] of possibleSDKPaths) {
        try {
          const sdkObj = getter();
          if (sdkObj && sdkObj.actions && typeof sdkObj.actions.ready === 'function') {
            console.log(`✅ GlobalSDK: Found SDK at ${path}`);
            console.log('🔧 SDK structure:', {
              actions: !!sdkObj.actions,
              ready: typeof sdkObj.actions.ready,
              haptics: !!sdkObj.haptics,
              sdkKeys: Object.keys(sdkObj),
              actionsKeys: sdkObj.actions ? Object.keys(sdkObj.actions) : []
            });
            return sdkObj;
          }
        } catch (e) {
          // Ignore errors
        }
      }
      
      return null;
    };

    const tryDynamicImport = async () => {
      try {
        console.log('🔄 GlobalSDK: Trying dynamic import as fallback...');
        const { sdk: importedSDK } = await import('@farcaster/miniapp-sdk');
        if (importedSDK && importedSDK.actions && typeof importedSDK.actions.ready === 'function') {
          console.log('✅ GlobalSDK: Dynamic import successful');
          return importedSDK;
        }
      } catch (importError) {
        console.log('❌ GlobalSDK: Dynamic import failed:', importError.message);
      }
      return null;
    };

    const callReadyWithVariations = async (foundSDK: any) => {
      console.log('📞 GlobalSDK: Calling sdk.actions.ready()...');
      
      // Try different ready() call variations
      const readyVariations = [
        { name: 'with disableNativeGestures', call: () => foundSDK.actions.ready({ disableNativeGestures: true }) },
        { name: 'with empty options', call: () => foundSDK.actions.ready({}) },
        { name: 'without options', call: () => foundSDK.actions.ready() },
      ];
      
      for (const variation of readyVariations) {
        try {
          console.log(`📞 GlobalSDK: Trying ready() ${variation.name}...`);
          await variation.call();
          console.log(`✅ GlobalSDK: ready() ${variation.name} succeeded!`);
          return true;
        } catch (readyError) {
          console.log(`❌ GlobalSDK: ready() ${variation.name} failed:`, readyError.message);
        }
      }
      
      return false;
    };

    const initializeSDK = async () => {
      try {
        console.log('🔄 GlobalSDK: Starting initialization...');
        console.log('🔧 Environment check:', {
          hostname: window.location.hostname,
          userAgent: window.navigator.userAgent.substring(0, 100),
          pathname: window.location.pathname,
          search: window.location.search,
          referrer: document.referrer,
          readyState: document.readyState,
          isFramed: window.parent !== window,
          availableGlobals: Object.keys(window).filter(k => 
            k.toLowerCase().includes('farcaster') || 
            k.toLowerCase().includes('sdk')
          )
        });
        
        // First try to find SDK globally (most likely to work in Farcaster)
        let foundSDK = findSDKGlobally();
        
        // If not found globally, try dynamic import
        if (!foundSDK) {
          foundSDK = await tryDynamicImport();
        }
        
        if (!mounted) return;
        
        if (!foundSDK) {
          throw new Error('No Farcaster SDK found in global scope or via import');
        }
        
        setSdk(foundSDK);
        
        // Wait a moment for DOM to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try to call ready()
        const readySucceeded = await callReadyWithVariations(foundSDK);
        
        if (!mounted) return;
        
        if (readySucceeded) {
          console.log('✅ GlobalSDK: ready() called successfully!');
          setIsSDKReady(true);
          setSdkError(null);
          
          // Optional: Test basic SDK functionality
          try {
            if (typeof foundSDK.haptics?.impactOccurred === 'function') {
              await foundSDK.haptics.impactOccurred('light');
              console.log('✅ GlobalSDK: Haptics test successful');
            }
          } catch (hapticError) {
            console.warn('⚠️ GlobalSDK: Haptics test failed (expected outside Farcaster):', hapticError);
          }
        } else {
          // Even if ready() failed, mark as ready to prevent infinite loading
          console.log('⚠️ GlobalSDK: All ready() variations failed, marking as ready anyway');
          setIsSDKReady(true);
          setSdkError('Ready call failed but continuing');
        }
        
      } catch (error) {
        console.error('❌ GlobalSDK: Failed to initialize:', error);
        
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setSdkError(errorMessage);
        
        // Try alternative ready signaling methods
        console.log('🔄 GlobalSDK: Trying alternative ready signaling...');
        try {
          // Post message to parent (sometimes works)
          window.parent.postMessage({ type: 'ready' }, '*');
          window.parent.postMessage({ type: 'miniapp_ready' }, '*');
          console.log('✅ GlobalSDK: Posted ready messages to parent');
        } catch (postError) {
          console.log('❌ GlobalSDK: Failed to post ready message:', postError.message);
        }
        
        // Mark as ready to prevent infinite loading
        setIsSDKReady(true);
        console.log('⚠️ GlobalSDK: Marked as ready despite errors');
      }
    };

    // Multiple initialization attempts with delays
    if (typeof window !== 'undefined') {
      // Immediate attempt
      initializeSDK();
      
      // DOM ready attempts
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSDK);
      }
      
      // Window load attempt
      window.addEventListener('load', initializeSDK);
      
      // Delayed attempts (SDK might be injected after page load)
      setTimeout(initializeSDK, 500);
      setTimeout(initializeSDK, 1000);
      setTimeout(initializeSDK, 2000);
      
      // Visibility change attempt (app might load in background)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !isSDKReady) {
          console.log('🔍 GlobalSDK: Page became visible, trying SDK again...');
          initializeSDK();
        }
      });
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