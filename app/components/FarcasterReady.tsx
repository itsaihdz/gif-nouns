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
        
        // Try multiple approaches to get the SDK
        let sdk;
        let readyCalled = false;
        
        // Approach 1: Try direct import (documented approach)
        try {
          const { sdk: importedSdk } = await import('@farcaster/miniapp-sdk');
          sdk = importedSdk;
          console.log('📦 SDK imported successfully via import:', sdk);
          
          if (sdk && sdk.actions && sdk.actions.ready) {
            console.log('📞 Calling sdk.actions.ready()...');
            await sdk.actions.ready();
            console.log('✅ Farcaster Mini App SDK ready() called successfully');
            setStatus('success');
            readyCalled = true;
          }
        } catch (importError) {
          console.log('⚠️ Import failed, trying alternative approaches...', importError);
        }
        
        // Approach 2: Try window.farcaster (if not already called)
        if (!readyCalled && (window as any).farcaster) {
          try {
            sdk = (window as any).farcaster;
            console.log('📦 SDK found on window.farcaster:', sdk);
            
            if (sdk && sdk.actions && sdk.actions.ready) {
              console.log('📞 Calling window.farcaster.actions.ready()...');
              await sdk.actions.ready();
              console.log('✅ Farcaster Mini App SDK ready() called successfully');
              setStatus('success');
              readyCalled = true;
            }
          } catch (windowError) {
            console.log('⚠️ window.farcaster approach failed:', windowError);
          }
        }
        
        // Approach 3: Try globalThis.farcaster (if not already called)
        if (!readyCalled && (globalThis as any).farcaster) {
          try {
            sdk = (globalThis as any).farcaster;
            console.log('📦 SDK found on globalThis.farcaster:', sdk);
            
            if (sdk && sdk.actions && sdk.actions.ready) {
              console.log('📞 Calling globalThis.farcaster.actions.ready()...');
              await sdk.actions.ready();
              console.log('✅ Farcaster Mini App SDK ready() called successfully');
              setStatus('success');
              readyCalled = true;
            }
          } catch (globalError) {
            console.log('⚠️ globalThis.farcaster approach failed:', globalError);
          }
        }
        
        // Approach 4: Try calling ready() directly if we're in a Mini App environment
        if (!readyCalled && isInIframe) {
          try {
            console.log('📞 Trying direct ready() call in iframe environment...');
            // This is a fallback for when the SDK is injected by the Mini App environment
            if ((window as any).farcasterReady) {
              await (window as any).farcasterReady();
              console.log('✅ Direct farcasterReady() called successfully');
              setStatus('success');
              readyCalled = true;
            }
          } catch (directError) {
            console.log('⚠️ Direct ready() approach failed:', directError);
          }
        }
        
        if (!readyCalled) {
          console.log('⚠️ No SDK found or ready() could not be called, this is normal in regular browser');
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

    // Call ready immediately
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