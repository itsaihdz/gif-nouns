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
    openGraph: {
      title: "GifNouns",
      description: "Create animated Nouns with custom noggles and eye animations",
      images: [`${URL}/hero.png`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "GifNouns",
      description: "Create animated Nouns with custom noggles and eye animations",
      images: [`${URL}/hero.png`],
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "1",
        name: "GifNouns",
        iconUrl: `${URL}/icon.png`,
        homeUrl: URL,
        splashImageUrl: `${URL}/splash.png`,
        splashBackgroundColor: "#8B5CF6",
        subtitle: "Animate your Nouns PFP",
        description: "Create animated Nouns with custom noggles and eye animations. Upload your Noun PFP and transform it into animated art with unique color combinations and dynamic eye movements.",
        screenshotUrls: [`${URL}/screenshot.png`],
        primaryCategory: "art-creativity",
        tags: ["nouns", "animation", "pfp", "gif", "art"],
        heroImageUrl: `${URL}/hero.png`,
        tagline: "Bring your Nouns to life",
        ogTitle: "GifNouns",
        ogDescription: "Create animated Nouns with custom noggles and eye animations",
        ogImageUrl: `${URL}/hero.png`,
        // Required fields for embed schema
        imageUrl: `${URL}/hero.png`,
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
