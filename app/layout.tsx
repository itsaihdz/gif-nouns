import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
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
      // Required fc:frame meta tag for proper embed rendering
      "fc:frame": JSON.stringify({
        version: "1",
        name: "GifNouns",
        iconUrl: ICON_URL,
        homeUrl: URL,
        splashImageUrl: SPLASH_URL,
        splashBackgroundColor: "#8B5CF6",
        subtitle: "Animate your Nouns PFP",
        description: "Create animated Nouns with custom noggles and eye animations. Upload your Noun PFP and transform it into animated art with unique color combinations and dynamic eye movements.",
        screenshotUrls: [SCREENSHOT_URL],
        primaryCategory: "art-creativity",
        tags: ["nouns", "animation", "pfp", "gif", "art"],
        heroImageUrl: HERO_IMAGE_URL,
        tagline: "Bring your Nouns to life",
        ogTitle: "GifNouns",
        ogDescription: "Create animated Nouns with custom noggles and eye animations",
        ogImageUrl: HERO_IMAGE_URL,
        // Required fields for embed schema
        imageUrl: HERO_IMAGE_URL,
        button: {
          title: "Animate your nouns ⌐◨-◨",
          action: {
            type: "post_redirect",
            url: URL
          }
        },
        requiredChains: ["eip155:1", "eip155:8453"],
        requiredCapabilities: ["wallet.getEthereumProvider", "actions.signIn"],
        noindex: false,
      }),
      // Keep existing fc:miniapp for backward compatibility
      "fc:miniapp": JSON.stringify({
        version: "1",
        name: "GifNouns",
        iconUrl: ICON_URL,
        homeUrl: URL,
        splashImageUrl: SPLASH_URL,
        splashBackgroundColor: "#8B5CF6",
        subtitle: "Animate your Nouns PFP",
        description: "Create animated Nouns with custom noggles and eye animations. Upload your Noun PFP and transform it into animated art with unique color combinations and dynamic eye movements.",
        screenshotUrls: [SCREENSHOT_URL],
        primaryCategory: "art-creativity",
        tags: ["nouns", "animation", "pfp", "gif", "art"],
        heroImageUrl: HERO_IMAGE_URL,
        tagline: "Bring your Nouns to life",
        ogTitle: "GifNouns",
        ogDescription: "Create animated Nouns with custom noggles and eye animations",
        ogImageUrl: HERO_IMAGE_URL,
        // Required fields for embed schema
        imageUrl: HERO_IMAGE_URL,
        button: {
          title: "Animate your nouns ⌐◨-◨",
          action: {
            type: "post_redirect",
            url: URL
          }
        },
        requiredChains: ["eip155:1", "eip155:8453"],
        requiredCapabilities: ["wallet.getEthereumProvider", "actions.signIn"],
        noindex: false,
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
