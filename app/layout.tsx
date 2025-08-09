import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://gifnouns.freezerverse.com";
  return {
    title: "GifNouns",
    description: "Create animated Nouns with custom noggles and eye animations",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/hero.png`,
        button: {
          title: "Launch GifNouns",
          action: {
            type: "launch_frame",
            name: "GifNouns",
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#8B5CF6",
          },
        },
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
      <head>
        <meta name="farcaster:app:icon" content="https://gifnouns.freezerverse.com/icon.png" />
        <meta name="farcaster:app:url" content="https://gifnouns.freezerverse.com" />
        <meta name="fc:miniapp" content="https://gifnouns.freezerverse.com" />
      </head>
      <body className="font-montserrat antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
