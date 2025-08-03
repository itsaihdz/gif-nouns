import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://nouns-remix-studio.vercel.app";
  
  return {
    title: "Nouns Remix Studio - Turn Your Noun Into Viral Animated Art",
    description: "The first social remix platform for Nouns. Create, remix, and collect unique animated PFPs in the Farcaster ecosystem. Join 500+ creators already earning from their art.",
    keywords: [
      "Nouns",
      "NFT",
      "animation",
      "remix",
      "Farcaster",
      "Base L2",
      "PFP",
      "crypto art",
      "creator economy",
      "social platform"
    ],
    authors: [{ name: "Nouns Remix Studio Team" }],
    creator: "Nouns Remix Studio",
    publisher: "Nouns Remix Studio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl || "https://gif-nouns.vercel.app"),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: "Nouns Remix Studio - Turn Your Noun Into Viral Animated Art",
      description: "The first social remix platform for Nouns. Create, remix, and collect unique animated PFPs in the Farcaster ecosystem.",
      url: baseUrl,
      siteName: "Nouns Remix Studio",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Nouns Remix Studio - Animated Noun NFTs",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nouns Remix Studio - Turn Your Noun Into Viral Animated Art",
      description: "The first social remix platform for Nouns. Create, remix, and collect unique animated PFPs in the Farcaster ecosystem.",
      images: ["/og-image.png"],
      creator: "@nounsremix",
      site: "@nounsremix",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
    other: {
      // Farcaster Mini App specific meta tags
      "farcaster:app": "nouns-remix-studio",
      "farcaster:app:name": "Nouns Remix Studio",
      "farcaster:app:description": "Create animated Nouns and discover community creations",
      "farcaster:app:icon": "https://gifnouns.freezerverse.com/icon.png",
      "farcaster:app:url": "https://gifnouns.freezerverse.com",
      "farcaster:app:category": "creative",
      "farcaster:app:permissions": "farcaster,ethereum",
      "farcaster:app:version": "1.0.0",
      "farcaster:app:tags": "nouns,animation,gif,nft,base,farcaster",
      "farcaster:app:features": "upload,gallery,voting,nft",
      "farcaster:app:social": "farcaster",
      "farcaster:app:social:farcaster:channel": "nouns-remix-studio",
      "farcaster:app:social:farcaster:description": "Share your animated Nouns with the community",
      
      // Farcaster Mini App configuration
      "fc:miniapp": JSON.stringify({
        version: "1",
        imageUrl: "https://gifnouns.freezerverse.com/hero.png",
        button: {
          title: "Open Nouns Remix Studio",
          action: {
            type: "launch_frame",
            name: "Nouns Remix Studio",
            url: "https://gifnouns.freezerverse.com",
            splashImageUrl: "https://gifnouns.freezerverse.com/splash.png",
            splashBackgroundColor: "#8B5CF6"
          }
        }
      }),
      "theme-color": "#8B5CF6",
      "msapplication-TileColor": "#8B5CF6",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "Nouns Remix Studio",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Nouns Remix Studio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nouns Remix Studio" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8B5CF6" />
      </head>
      <body className="bg-background antialiased font-montserrat">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
