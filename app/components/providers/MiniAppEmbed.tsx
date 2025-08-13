"use client";

import { useEffect } from 'react';
import { useSDK } from './FarcasterSDKProvider';

interface MiniAppEmbedProps {
  children: React.ReactNode;
}

export function MiniAppEmbed({ children }: MiniAppEmbedProps) {
  const { isSDKReady, sdkError } = useSDK();

  // Just log the SDK status, don't make additional ready() calls
  useEffect(() => {
    console.log('🔧 MiniAppEmbed: SDK Status:', { isSDKReady, sdkError });
  }, [isSDKReady, sdkError]);

  return <>{children}</>;
}