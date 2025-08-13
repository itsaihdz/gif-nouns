import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '../../config/urls';

export async function GET() {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjQxODY3MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDFGRGUyN0YwMjM5YmY3OTA5OTdlRjRlNzQ5RWRCRDY2M0Y3NTU4RmIifQ",
      "payload": "eyJkb21haW4iOiJnaWZub3Vucy5mcmVlemVydmVyc2UuY29tIn0",
      "signature": "MHg5Yzg0YjgzNjQxMTUxOTI3OTBhM2E2ZmRkYjViMDE3MjY5YWUwZDc0Y2E4NjgxNzBmZGMxMzMyNmRmODBmZmRlNzFjZGU2MjMwNTJlYjJmNDg3ZDc3NTVlYjJjZDczZTI4MDg0NzJkZmI1Y2FiMmJlNjZlMDE4YTQ0NzQ5YjE5MTFi"
    },
    frame: {
      version: '1',
      name: 'GifNouns',
      iconUrl: SITE_CONFIG.ICON_URL,
      homeUrl: SITE_CONFIG.BASE_URL,
      splashImageUrl: SITE_CONFIG.SPLASH_URL,
      splashBackgroundColor: SITE_CONFIG.SPLASH_BACKGROUND_COLOR,
      subtitle: "Animate your Nouns PFP",
      description: 'Create animated Nouns with custom noggles and eye animations. Upload your Noun PFP and transform it into animated art with unique color combinations and dynamic eyes.',
      screenshotUrls: [
        SITE_CONFIG.SCREENSHOT_URL
      ],
      primaryCategory: "art-creativity",
      tags: [
        "nouns",
        "animation",
        "pfp",
        "gif",
        "art"
      ],
      heroImageUrl: SITE_CONFIG.HERO_IMAGE_URL,
      tagline: "Bring your Nouns to life",
      ogTitle: "GifNouns - Animated Nouns",
      ogDescription: "Create animated Nouns with custom noggles and eyes animations",
      ogImageUrl: SITE_CONFIG.HERO_IMAGE_URL,
      imageUrl: SITE_CONFIG.HERO_IMAGE_URL,
      button: {
        title: "Animate your nouns ⌐◨-◨",
        action: {
          type: "post_redirect",
          url: SITE_CONFIG.BASE_URL
        }
      },
      buttonTitle: "Animate your nouns ⌐◨-◨",
      requiredChains: [
        "eip155:1",
        "eip155:8453"
      ],
      requiredCapabilities: [
        "wallet.getEthereumProvider",
        "actions.signIn"
      ],
      noindex: false
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
