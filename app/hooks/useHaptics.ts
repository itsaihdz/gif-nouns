"use client";

import sdk from '@farcaster/miniapp-sdk';

import { useSDK } from '../components/providers/FarcasterSDKProvider';

type ImpactStyle = 'light' | 'medium' | 'heavy';
type NotificationStyle = 'success' | 'warning' | 'error';

/**
 * Hook for providing haptic feedback using Farcaster MiniApp SDK
 */
export function useHaptics() {
  const { isSDKReady } = useSDK();

  const impactOccurred = async (style: ImpactStyle = 'medium') => {
    if (!isSDKReady) {
      console.debug('Haptics not available - SDK not ready');
      return;
    }

    try {
      await sdk.haptics.impactOccurred(style);
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug('Haptics not available:', error);
    }
  };

  const notificationOccurred = async (style: NotificationStyle) => {
    if (!isSDKReady) {
      console.debug('Haptics not available - SDK not ready');
      return;
    }

    try {
      await sdk.haptics.notificationOccurred(style);
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug('Haptics not available:', error);
    }
  };

  const selectionChanged = async () => {
    if (!isSDKReady) {
      console.debug('Haptics not available - SDK not ready');
      return;
    }

    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug('Haptics not available:', error);
    }
  };

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged,
    isReady: isSDKReady,
  };
}
