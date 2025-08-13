// Central URL configuration for the entire application
export const SITE_CONFIG = {
  // The main URL for the application
  BASE_URL: process.env.NEXT_PUBLIC_URL || "https://gif-nouns-orcin.vercel.app",
  
  // Asset URLs - use env vars if provided, otherwise derive from base URL
  get ICON_URL() { 
    return process.env.NEXT_PUBLIC_ICON_URL || `${this.BASE_URL}/icon.png`; 
  },
  get HERO_IMAGE_URL() { 
    return process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${this.BASE_URL}/hero.png`; 
  },
  get SPLASH_URL() { 
    return process.env.NEXT_PUBLIC_SPLASH_IMAGE || `${this.BASE_URL}/splash.png`; 
  },
  get SCREENSHOT_URL() { return `${this.BASE_URL}/screenshot.png`; },
  get SPLASH_BACKGROUND_COLOR() {
    return process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#8B5CF6";
  },
} as const;