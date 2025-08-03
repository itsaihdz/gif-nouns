"use client";

import { useEffect } from 'react';

export function FarcasterReady() {
  useEffect(() => {
    const callReady = async () => {
      try {
        console.log('🚀 FarcasterReady: Starting...');
        
        // Follow the exact documentation pattern
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        // Call ready() as documented
        await sdk.actions.ready();
        
        console.log('✅ Farcaster SDK ready() called successfully');
      } catch (error) {
        console.error('❌ FarcasterReady error:', error);
        
        // Try fallback if import fails
        try {
          if ((window as any).farcaster?.actions?.ready) {
            await (window as any).farcaster.actions.ready();
            console.log('✅ Farcaster ready() called via fallback');
          }
        } catch (fallbackError) {
          console.log('⚠️ Fallback also failed - this is normal in regular browser');
        }
      }
    };

    // Call immediately
    callReady();
  }, []);

  return null;
} 