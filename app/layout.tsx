import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    metadataBase: new URL(baseUrl),
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
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "/hero.png",
        button: {
          title: "Launch Nouns Remix Studio",
          action: {
            type: "launch_frame",
            name: "Nouns Remix Studio",
            url: baseUrl,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE || "/splash.png",
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#8B5CF6",
          },
        },
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
      <body className="bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
