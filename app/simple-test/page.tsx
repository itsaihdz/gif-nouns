'use client';

import { useEffect } from 'react';

export default function SimpleTestPage() {
  useEffect(() => {
    console.log('🔥 Simple test page loaded!');
    
    // Log to webhook endpoint
    fetch('/api/debug-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '🔥 Simple test page loaded and can make requests!',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(err => {
      console.error('Failed to send log:', err);
    });

    // Try to import and call Farcaster SDK
    const testFarcasterSDK = async () => {
      try {
        console.log('🔄 Attempting to import Farcaster SDK...');
        const { sdk } = await import('@farcaster/miniapp-sdk');
        console.log('✅ SDK imported successfully');
        
        console.log('📞 Calling sdk.actions.ready()...');
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called successfully!');
        
        // Log success to webhook
        fetch('/api/debug-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: '✅ SDK ready() called successfully from simple test page!',
            timestamp: new Date().toISOString(),
          }),
        });
        
      } catch (error) {
        console.error('❌ SDK test failed:', error);
        
        // Log error to webhook
        fetch('/api/debug-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: '❌ SDK test failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
            timestamp: new Date().toISOString(),
          }),
        });
      }
    };

    // Try SDK immediately and after delays
    testFarcasterSDK();
    setTimeout(testFarcasterSDK, 1000);
    setTimeout(testFarcasterSDK, 3000);

  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#8B5CF6',
      color: 'white',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🧪 Simple Test Page</h1>
      <p>This is a minimal test page for debugging Farcaster Mini App loading.</p>
      <p>Check the console and webhook logs!</p>
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p>Timestamp: {new Date().toISOString()}</p>
        <p>URL: {typeof window !== 'undefined' ? window.location.href : 'server'}</p>
        <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'server'}</p>
      </div>
    </div>
  );
}