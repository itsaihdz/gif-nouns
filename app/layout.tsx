import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConsoleLogger } from "./components/debug/ConsoleLogger";
import { LoadingIndicator } from "./components/debug/LoadingIndicator";
import { SITE_CONFIG } from "./config/urls";
// import { ErrorBoundary } from "./components/ui/ErrorBoundary"; // Unused import
// import { Analytics } from "@vercel/analytics/react"; // Unused import

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = SITE_CONFIG.BASE_URL;
  const HERO_IMAGE_URL = SITE_CONFIG.HERO_IMAGE_URL;
  const ICON_URL = SITE_CONFIG.ICON_URL;
  const SPLASH_URL = SITE_CONFIG.SPLASH_URL;
  const SCREENSHOT_URL = SITE_CONFIG.SCREENSHOT_URL;
  
  return {
    title: "GifNouns",
    description: "Create animated Nouns with custom noggles and eye animations",
    openGraph: {
      title: "GifNouns",
      description: "Create animated Nouns with custom noggles and eye animations",
      images: [HERO_IMAGE_URL],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "GifNouns",
      description: "Create animated Nouns with custom noggles and eye animations",
      images: [HERO_IMAGE_URL],
    },
    other: {
      // Farcaster Mini App metadata with proper JSON structure
      "fc:frame": JSON.stringify({
        title: "GifNouns",
        type: "website", 
        description: "Create animated Nouns with custom noggles and eye animations",
        version: "next",
        url: URL,
        imageUrl: HERO_IMAGE_URL,
        button: {
          title: "Animate your nouns ⌐◨-◨",
          action: {
            type: "launch_frame",
            name: "GifNouns",
            url: URL,
            splashImageUrl: SPLASH_URL,
            splashBackgroundColor: "#8B5CF6"
          }
        }
      }),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-montserrat antialiased">
        <LoadingIndicator />
        <ConsoleLogger />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
