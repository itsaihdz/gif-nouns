"use client";

import { useEffect } from 'react';

export function EarlyReady() {
  useEffect(() => {
    console.log('🚨 EarlyReady: Attempting super early ready() calls...');
    
    // Try to import and call ready immediately
    const attemptEarlyReady = async () => {
      try {
        console.log('🔍 EarlyReady: Checking for SDK in window...');
        
        // Check if SDK is already available on window
        if ((window as any).sdk) {
          console.log('✅ EarlyReady: Found SDK on window, calling ready()...');
          await (window as any).sdk.actions.ready();
          console.log('✅ EarlyReady: Window SDK ready() successful!');
          return;
        }

        // Try dynamic import
        console.log('🔍 EarlyReady: Attempting dynamic SDK import...');
        const { sdk } = await import('@farcaster/miniapp-sdk');
        console.log('✅ EarlyReady: SDK imported, calling ready()...');
        await sdk.actions.ready();
        console.log('✅ EarlyReady: Dynamic import ready() successful!');
      } catch (error) {
        console.warn('⚠️ EarlyReady: Failed to call ready():', error);
        
        // Last resort: try without await
        try {
          if ((window as any).sdk) {
            console.log('🔍 EarlyReady: Trying sync ready() call...');
            (window as any).sdk.actions.ready();
            console.log('✅ EarlyReady: Sync ready() completed');
          }
        } catch (syncError) {
          console.error('❌ EarlyReady: All attempts failed:', syncError);
        }
      }
    };

    // Call immediately and with delays
    attemptEarlyReady();
    setTimeout(attemptEarlyReady, 100);
    setTimeout(attemptEarlyReady, 500);
    setTimeout(attemptEarlyReady, 1000);

    // Also try when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attemptEarlyReady);
    } else {
      // DOM already loaded
      setTimeout(attemptEarlyReady, 0);
    }

    // And when window is fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', attemptEarlyReady);
    }

  }, []);

  return null; // This component doesn't render anything
}