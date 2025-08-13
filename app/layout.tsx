import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ConsoleLogger } from "./components/debug/ConsoleLogger";
// import { ErrorBoundary } from "./components/ui/ErrorBoundary"; // Unused import
// import { Analytics } from "@vercel/analytics/react"; // Unused import

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://gifnouns.freezerverse.com";
  const HERO_IMAGE_URL = "https://gifnouns.freezerverse.com/hero.png";
  const ICON_URL = "https://gifnouns.freezerverse.com/icon.png";
  const SPLASH_URL = "https://gifnouns.freezerverse.com/splash.png";
  const SCREENSHOT_URL = "https://gifnouns.freezerverse.com/screenshot.png";
  
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
      // Farcaster Frame metadata - using proper format to avoid HTML escaping
      "fc:frame": "1",
      "fc:frame:image": HERO_IMAGE_URL,
      "fc:frame:button:1": "Animate your nouns ⌐◨-◨",
      "fc:frame:post_url": URL,
      
      // Farcaster Mini App metadata - using proper format to avoid HTML escaping
      "fc:miniapp": "1",
      "fc:miniapp:name": "GifNouns",
      "fc:miniapp:icon": ICON_URL,
      "fc:miniapp:home": URL,
      "fc:miniapp:splash": SPLASH_URL,
      "fc:miniapp:image": HERO_IMAGE_URL,
      "fc:miniapp:description": "Create animated Nouns with custom noggles and eye animations",
      
      // Additional required embed fields
      "fc:frame:version": "1",
      "fc:frame:imageUrl": HERO_IMAGE_URL,
      "fc:frame:aspectRatio": "1.91:1",
      "fc:frame:button": "Animate your nouns ⌐◨-◨",
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
        <ConsoleLogger />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
