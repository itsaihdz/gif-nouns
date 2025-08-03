import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjQxODY3MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGRGUyN0YwMjM5YmY3OTA5OTdlRjRlNzQ5RWRCRDY2M0Y3NTU4RmIifQ",
      "payload": "eyJkb21haW4iOiJnaWYtbm91bnMudmVyY2VsLmFwcCJ9",
      "signature": "MHhkYTM5ZWFhZjcwOTU5NmQ5NTU3MTQyNzkzYWNlNzkwYzFkMDAxZTllMzQxZDU0YzZiNTc5ZTA5NDM5NGFiZDM4Mzk2NThmNWE1MTljYWYzZGJmYzY3YTExYzAwMzIxYTBlZWQ4ZjA0M2QwNDk3NjZjZTkxZDY3N2QzYzc3OGQ2ZDFj"
    },
    "miniapp": {
      "version": "1",
      "name": "Nouns Remix Studio",
      "iconUrl": "https://gif-nouns.vercel.app/icon.png",
      "homeUrl": "https://gif-nouns.vercel.app",
      "splashImageUrl": "https://gif-nouns.vercel.app/splash.png",
      "splashBackgroundColor": "#8B5CF6",
      "subtitle": "Create animated Nouns",
      "description": "Upload your Noun PFP, customize with noggle colors and animated eyes, then export as GIF. Join the community gallery!",
      "primaryCategory": "art-creativity",
      "tags": [
        "nouns",
        "gif",
        "animation",
        "pfp",
        "community"
      ],
      "heroImageUrl": "https://gif-nouns.vercel.app/hero.png",
      "tagline": "Animate your Nouns",
      "ogTitle": "Nouns Remix Studio",
      "ogDescription": "Create animated Nouns with custom noggles and eye animations",
      "ogImageUrl": "https://gif-nouns.vercel.app/hero.png",
      "requiredChains": [
        "eip155:8453"
      ],
      "requiredCapabilities": [
        "actions.signIn",
        "wallet.getEthereumProvider"
      ]
    }
  };

  return NextResponse.json(manifest);
} 