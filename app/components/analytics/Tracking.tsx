"use client";

import React from "react";
import { track } from "@vercel/analytics";

// Custom tracking events for Nouns Remix Studio
export const trackingEvents = {
  // Page views
  pageView: (page: string) => {
    track("page_view", { page });
  },

  // User interactions
  walletConnect: (walletType: string) => {
    track("wallet_connect", { wallet_type: walletType });
  },

  walletDisconnect: () => {
    track("wallet_disconnect");
  },

  // Demo interactions
  demoPaletteChange: (palette: string) => {
    track("demo_palette_change", { palette });
  },

  demoAnimationChange: (animation: string) => {
    track("demo_animation_change", { animation });
  },

  // Web3 transactions
  transactionStart: (type: "mint" | "remix") => {
    track("transaction_start", { type });
  },

  transactionSuccess: (type: "mint" | "remix", hash: string) => {
    track("transaction_success", { type, hash });
  },

  transactionError: (type: "mint" | "remix", error: string) => {
    track("transaction_error", { type, error });
  },

  // CTA interactions
  ctaClick: (ctaType: string) => {
    track("cta_click", { cta_type: ctaType });
  },

  // Feature interactions
  featureView: (feature: string) => {
    track("feature_view", { feature });
  },

  // Social interactions
  socialShare: (platform: string) => {
    track("social_share", { platform });
  },

  // Error tracking
  errorOccurred: (error: string, page: string) => {
    track("error_occurred", { error, page });
  },

  // Performance tracking
  performanceMetric: (metric: string, value: number) => {
    track("performance_metric", { metric, value });
  },

  // Upload & Preview System
  uploadStart: (fileName: string, fileSize: number) => {
    track("upload_start", { file_name: fileName, file_size: fileSize });
  },

  // traitsDetected: (traits: Record<string, unknown>) => {
  //   track("traits_detected", { traits });
  // },

  exportComplete: (gifUrl: string) => {
    track("export_complete", { gif_url: gifUrl });
  },

  downloadStart: () => {
    track("download_start");
  },
};

// Hook for easy tracking
export function useTracking() {
  return trackingEvents;
}

// Component for automatic page view tracking
export function PageViewTracker({ page }: { page: string }) {
  React.useEffect(() => {
    trackingEvents.pageView(page);
  }, [page]);

  return null;
} 