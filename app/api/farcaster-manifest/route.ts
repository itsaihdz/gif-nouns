import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '../../config/urls';

export async function GET() {
  const manifest = {
    frame: {
      version: '1',
      name: 'GifNouns',
      description: 'Create animated Nouns with custom noggles and eye animations',
      iconUrl: SITE_CONFIG.ICON_URL,
      homeUrl: SITE_CONFIG.BASE_URL,
      splashImageUrl: SITE_CONFIG.SPLASH_URL,
      splashBackgroundColor: '#8B5CF6',
      heroImageUrl: SITE_CONFIG.HERO_IMAGE_URL,
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
