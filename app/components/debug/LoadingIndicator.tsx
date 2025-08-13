"use client";

import { useState, useEffect } from 'react';

export function LoadingIndicator() {
  const [loadState, setLoadState] = useState('🔄 App Starting...');
  const [timestamp] = useState(Date.now());

  useEffect(() => {
    console.log('🚀 LoadingIndicator mounted at:', new Date().toISOString());
    setLoadState('🌐 Client Side Loaded');
    
    // Show a sequence of loading states
    const timer1 = setTimeout(() => {
      setLoadState('⚡ React Hydrated');
    }, 100);

    const timer2 = setTimeout(() => {
      setLoadState('🔧 Effects Running');
    }, 500);

    const timer3 = setTimeout(() => {
      setLoadState('✅ App Ready for SDK');
    }, 1000);

    // Add visible DOM element for debugging
    const debugElement = document.createElement('div');
    debugElement.id = 'farcaster-debug-indicator';
    debugElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff0000;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 9999;
      font-size: 14px;
      font-weight: bold;
    `;
    debugElement.textContent = `🔍 FARCASTER DEBUG: App Loaded at ${new Date().toISOString()}`;
    document.body.appendChild(debugElement);

    // Check environment
    const isInFrame = window !== window.top;
    const userAgent = navigator.userAgent;
    const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('farcaster');
    
    console.log('🔍 Environment Check:', {
      isInFrame,
      isFarcaster,
      userAgent: userAgent.substring(0, 100),
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      const element = document.getElementById('farcaster-debug-indicator');
      if (element) {
        element.remove();
      }
    };
  }, []);

  const sessionId = `session-${timestamp}`;

  return (
    <div 
      id="loading-indicator"
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 9998,
        fontFamily: 'monospace'
      }}
    >
      <div>{loadState}</div>
      <div style={{ fontSize: '10px', opacity: 0.7 }}>
        {sessionId}
      </div>
    </div>
  );
}