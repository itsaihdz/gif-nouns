"use client";

import { useEffect } from 'react';

// Extend Window interface for Farcaster
declare global {
  interface Window {
    farcaster?: {
      actions: {
        ready(): Promise<void>;
      };
    };
  }
}

export function FarcasterReady() {
  useEffect(() => {
    const callReady = async () => {
      try {
        // Check if we're in a Farcaster Frame environment
        if (typeof window !== 'undefined' && window.farcaster) {
          // Call ready() to signal that the app is ready
          await window.farcaster.actions.ready();
          console.log('✅ Farcaster Frame SDK ready() called successfully');
        } else {
          console.log('ℹ️ Not in Farcaster Frame environment');
        }
      } catch (err) {
        console.error('❌ Failed to call Farcaster ready():', err);
      }
    };

    callReady();
  }, []);

  return null; // This component doesn't render anything
} 