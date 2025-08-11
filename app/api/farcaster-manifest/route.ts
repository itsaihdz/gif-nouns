import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjQxODY3MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGRGUyN0YwMjM5YmY3OTA5OTdlRjRlNzQ5RWRCRDY2M0Y3NTU4RmIifQ",
      "payload": "eyJkb21haW4iOiJnaWZub3Vucy5mcmVlemVydmVyc2UuY29tIn0",
      "signature": "MHg5Yzg0YjgzNjQxMTUxOTI3OTBhM2E2ZmRkYjViMDE3MjY5YWUwZDc0Y2E4NjgxNzBmZGMxMzMyNmRmODBmZmRlNzFjZGU2MjMwNTJlYjJmNDg3ZDc3NTVlYjJjZDczZTI4MDg0NzJkZmI1Y2FiMmJlNjZlMDE4YTQ0NzQ5YjE5MTFi"
    },
    "frame": {
      "version": "1",
      "name": "GifNouns",
      "iconUrl": "https://gifnouns.freezerverse.com/icon.png",
      "homeUrl": "https://gifnouns.freezerverse.com",
      "splashImageUrl": "https://gifnouns.freezerverse.com/splash.png",
      "splashBackgroundColor": "#8B5CF6",
      "subtitle": "Animate your Nouns PFP",
      "description": "Create animated Nouns with custom noggles and eye animations. Upload your Noun PFP and transform it into animated art with unique color combinations and dynamic eyes.",
      "screenshotUrls": [
        "https://gifnouns.freezerverse.com/screenshot.png"
      ],
      "primaryCategory": "art-creativity",
      "tags": [
        "nouns",
        "animation",
        "pfp",
        "gif",
        "art"
      ],
      "heroImageUrl": "https://gifnouns.freezerverse.com/hero.png",
      "tagline": "Bring your Nouns to life",
      "ogTitle": "GifNouns - Animated Nouns",
      "ogDescription": "Create animated Nouns with custom noggles and eyes animations",
      "ogImageUrl": "https://gifnouns.freezerverse.com/hero.png",
      "imageUrl": "https://gifnouns.freezerverse.com/hero.png",
      "button": {
        "title": "Animate your nouns ⌐◨-◨",
        "action": {
          "type": "post_redirect",
          "url": "https://gifnouns.freezerverse.com"
        }
      },
      "buttonTitle": "Animate your nouns ⌐◨-◨",
      "requiredChains": [
        "eip155:1",
        "eip155:8453"
      ],
      "requiredCapabilities": [
        "wallet.getEthereumProvider",
        "actions.signIn"
      ],
      "noindex": false
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
