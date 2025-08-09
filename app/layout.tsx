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
  return {
    title: "GifNouns",
    description: "Create animated Nouns with custom noggles and eye animations",
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        name: "GifNouns",
        iconUrl: `${URL}/icon.png`,
        homeUrl: URL,
        splashImageUrl: `${URL}/splash.png`,
        splashBackgroundColor: "#8B5CF6",
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
        {/* Farcaster Mini App meta tags are handled in generateMetadata() */}
      </head>
      <body className="font-montserrat antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
