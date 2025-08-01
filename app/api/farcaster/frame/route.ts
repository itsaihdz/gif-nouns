import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Handle frame interaction
    console.log('Farcaster Frame interaction:', { untrustedData, trustedData });

    // Redirect to the main app
    return NextResponse.json({
      success: true,
      redirectUrl: 'https://gif-nouns.vercel.app',
      message: 'Welcome to Nouns Remix Studio!'
    });

  } catch (error) {
    console.error('Farcaster Frame error:', error);
    return NextResponse.json(
      { success: false, error: 'Frame processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return frame metadata
    return NextResponse.json({
      success: true,
      frame: {
        version: "vNext",
        image: "https://gif-nouns.vercel.app/og-image.png",
        buttons: [
          {
            label: "Create Animated Noun",
            action: "post"
          },
          {
            label: "View Gallery",
            action: "post"
          }
        ],
        postUrl: "https://gif-nouns.vercel.app/api/farcaster/frame",
        input: {
          text: "Enter your Noun PFP URL (optional)"
        }
      }
    });

  } catch (error) {
    console.error('Farcaster Frame GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Frame metadata failed' },
      { status: 500 }
    );
  }
} 