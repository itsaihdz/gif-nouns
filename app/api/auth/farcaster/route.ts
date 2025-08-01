import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signerUuid, messageBytes, signature } = body;

    // TODO: Implement real Neynar authentication
    // For now, return a mock successful response
    console.log('Farcaster auth request:', { signerUuid, messageBytes, signature });

    // Mock successful authentication
    const mockUser = {
      fid: 12345,
      username: "demo.noun",
      displayName: "Demo User",
      pfp: "https://picsum.photos/32/32?random=1",
      bio: "Nouns Remix Studio user",
      followerCount: 42,
      followingCount: 38
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: "Authentication successful"
    });

  } catch (error) {
    console.error('Farcaster auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'FID parameter required' },
        { status: 400 }
      );
    }

    // TODO: Implement real Neynar user lookup
    // For now, return mock user data
    const mockUser = {
      fid: parseInt(fid),
      username: `user${fid}.noun`,
      displayName: `User ${fid}`,
      pfp: `https://picsum.photos/32/32?random=${fid}`,
      bio: "Nouns Remix Studio user",
      followerCount: Math.floor(Math.random() * 100) + 10,
      followingCount: Math.floor(Math.random() * 50) + 5
    };

    return NextResponse.json({
      success: true,
      user: mockUser
    });

  } catch (error) {
    console.error('Farcaster user lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'User lookup failed' },
      { status: 500 }
    );
  }
} 