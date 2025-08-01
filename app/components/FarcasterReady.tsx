"use client";

import { useEffect, useState } from 'react';

export function FarcasterReady() {
  const [status, setStatus] = useState<'initializing' | 'success' | 'error' | 'not-supported'>('initializing');

  useEffect(() => {
    const callReady = async () => {
      try {
        console.log('🚀 FarcasterReady: Starting SDK initialization...');
        setStatus('initializing');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('❌ Not in browser environment, skipping SDK initialization');
          setStatus('not-supported');
          return;
        }
        
        // Check if we're in an iframe (common for Mini Apps)
        const isInIframe = window.self !== window.top;
        console.log('🔍 Environment check:', {
          isInIframe,
          userAgent: window.navigator.userAgent,
          location: window.location.href
        });
        
        // Try to import the SDK dynamically
        try {
          const { sdk } = await import('@farcaster/miniapp-sdk');
          console.log('📦 SDK imported successfully:', sdk);
          console.log('🔧 SDK actions:', sdk.actions);
          
          // Call ready() to signal that the app is ready
          console.log('📞 Calling sdk.actions.ready()...');
          await sdk.actions.ready();
          console.log('✅ Farcaster Mini App SDK ready() called successfully');
          setStatus('success');
          
        } catch (importError) {
          console.log('⚠️ SDK import failed (normal in regular browser):', importError);
          console.log('ℹ️ This is expected when not running in a Farcaster Mini App environment');
          setStatus('not-supported');
        }
        
      } catch (err) {
        console.error('❌ Failed to call Farcaster ready():', err);
        console.error('🔍 Error details:', {
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined
        });
        setStatus('error');
      }
    };

    callReady();
  }, []);

  // Show a small status indicator in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 9999,
        backgroundColor: 
          status === 'success' ? '#10b981' :
          status === 'error' ? '#ef4444' :
          status === 'not-supported' ? '#f59e0b' :
          '#6b7280',
        color: 'white'
      }}>
        SDK: {status === 'success' ? '✅ Ready' : 
              status === 'error' ? '❌ Error' : 
              status === 'not-supported' ? '⚠️ Not Supported' : 
              '⏳ Loading...'}
      </div>
    );
  }

  return null; // Don't show anything in production
} 