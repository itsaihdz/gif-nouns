import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjQxODY3MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGRGUyN0YwMjM5YmY3OTA5OTdlRjRlNzQ5RWRCRDY2M0Y3NTU4RmIifQ",
      "payload": "eyJkb21haW4iOiJnaWZub3Vucy5mcmVlemVydmVyc2UuY29tIn0",
      "signature": "MHg5Yzg0YjgzNjQxMTUxOTI3OTBhM2E2ZmRkYjViMDE3MjY5YWUwZDc0Y2E4NjgxNzBmZGMxMzMyNmRmODBmZmRlNzFjZGU2MjMwNTJlYjJmNDg3ZDc3NTVlYjJjZDczZTI4MDg0NzJkZmI1Y2FiMmJlNjZlMDE4YTQ0NzQ5YjE5MTFi"
    },
    "miniapp": {
      "version": "1",
      "name": "Nouns Remix Studio",
      "iconUrl": "https://gifnouns.freezerserve.com/icon.png",
      "homeUrl": "https://gifnouns.freezerserve.com",
      "splashImageUrl": "https://gifnouns.freezerserve.com/splash.png",
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
      "heroImageUrl": "https://gifnouns.freezerserve.com/hero.png",
      "tagline": "Animate your Nouns",
      "ogTitle": "Nouns Remix Studio",
      "ogDescription": "Create animated Nouns with custom noggles and eye animations",
      "ogImageUrl": "https://gifnouns.freezerserve.com/hero.png",
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