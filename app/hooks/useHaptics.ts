"use client";

import { sdk } from '@farcaster/miniapp-sdk';

type ImpactStyle = 'light' | 'medium' | 'heavy';
type NotificationStyle = 'success' | 'warning' | 'error';

/**
 * Hook for providing haptic feedback using Farcaster MiniApp SDK
 */
export function useHaptics() {
  const impactOccurred = async (style: ImpactStyle = 'medium') => {
    try {
      await sdk.haptics.impactOccurred(style);
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug('Haptics not available:', error);
    }
  };

  const notificationOccurred = async (style: NotificationStyle) => {
    try {
      await sdk.haptics.notificationOccurred(style);
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug('Haptics not available:', error);
    }
  };

  const selectionChanged = async () => {
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
  };
}
