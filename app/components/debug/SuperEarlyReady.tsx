'use client';

import { useEffect } from 'react';

export function SuperEarlyReady() {
  useEffect(() => {
    console.log('🚨 SuperEarlyReady: Starting IMMEDIATE ready() attempts...');
    
    let readyCallMade = false;
    
    const attemptReady = async (method: string) => {
      if (readyCallMade) return;
      
      try {
        console.log(`🔥 ${method}: Attempting ready() call...`);
        
        // Try to import SDK
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        if (typeof sdk?.actions?.ready === 'function') {
          // Try multiple call variations
          try {
            await sdk.actions.ready();
            console.log(`✅ ${method}: ready() SUCCESS!`);
            readyCallMade = true;
          } catch (e1) {
            console.log(`❌ ${method}: Basic ready() failed:`, e1);
            
            try {
              await sdk.actions.ready({});
              console.log(`✅ ${method}: ready({}) SUCCESS!`);
              readyCallMade = true;
            } catch (e2) {
              console.log(`❌ ${method}: ready({}) failed:`, e2);
              
              try {
                await sdk.actions.ready({ disableNativeGestures: true });
                console.log(`✅ ${method}: ready({disableNativeGestures: true}) SUCCESS!`);
                readyCallMade = true;
              } catch (e3) {
                console.log(`❌ ${method}: All variants failed:`, e3);
              }
            }
          }
        } else {
          console.log(`❌ ${method}: SDK ready function not available`);
        }
      } catch (importError) {
        console.log(`❌ ${method}: SDK import failed:`, importError);
      }
    };

    // Immediate attempt
    attemptReady('IMMEDIATE');
    
    // Multiple timed attempts
    setTimeout(() => attemptReady('100ms'), 100);
    setTimeout(() => attemptReady('250ms'), 250);
    setTimeout(() => attemptReady('500ms'), 500);
    setTimeout(() => attemptReady('1s'), 1000);
    setTimeout(() => attemptReady('2s'), 2000);
    
    // DOM ready attempt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => attemptReady('DOMContentLoaded'));
    } else {
      attemptReady('DOM_ALREADY_READY');
    }
    
    // Window load attempt
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => attemptReady('WINDOW_LOAD'));
    } else {
      attemptReady('WINDOW_ALREADY_LOADED');
    }
    
    // Visibility change attempt
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        attemptReady('VISIBILITY_CHANGE');
      }
    });
    
    // Focus attempt
    window.addEventListener('focus', () => attemptReady('WINDOW_FOCUS'));
    
    // Mouse move attempt (user interaction)
    const handleMouseMove = () => {
      attemptReady('MOUSE_MOVE');
      window.removeEventListener('mousemove', handleMouseMove);
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Click attempt (user interaction)
    const handleClick = () => {
      attemptReady('CLICK');
      window.removeEventListener('click', handleClick);
    };
    window.addEventListener('click', handleClick);
    
    // Keydown attempt (user interaction)
    const handleKeydown = () => {
      attemptReady('KEYDOWN');
      window.removeEventListener('keydown', handleKeydown);
    };
    window.addEventListener('keydown', handleKeydown);
    
    // Interval-based attempts
    const interval = setInterval(() => {
      if (!readyCallMade) {
        attemptReady('INTERVAL');
      } else {
        clearInterval(interval);
      }
    }, 1000);
    
    // Cleanup after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      console.log('🔥 SuperEarlyReady: Giving up after 30 seconds. Ready call made:', readyCallMade);
    }, 30000);
    
  }, []);

  return null;
}