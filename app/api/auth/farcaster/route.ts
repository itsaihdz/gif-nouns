import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/supabase-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, displayName, pfp, followerCount, followingCount } = body;

    // Validate required fields
    if (!fid || !username || !displayName || !pfp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or update user in Supabase
    const user = await userService.upsertUser({
      fid,
      username,
      displayName,
      pfp,
      followerCount,
      followingCount,
    });

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp,
        followerCount: user.follower_count,
        followingCount: user.following_count,
      }
    });
  } catch (error) {
    console.error('Error in Farcaster auth:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
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
        { error: 'FID parameter is required' },
        { status: 400 }
      );
    }

    const user = await userService.getUserByFid(parseInt(fid));

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp,
        followerCount: user.follower_count,
        followingCount: user.following_count,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 