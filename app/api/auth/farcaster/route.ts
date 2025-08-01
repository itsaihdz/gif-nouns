import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, getUserByUsername } from '../../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username } = body;

    if (!fid && !username) {
      return NextResponse.json(
        { success: false, error: 'FID or username is required' },
        { status: 400 }
      );
    }

    let userData;

    if (fid) {
      // Get user by FID
      const response = await getUserByFid(fid);
      userData = response.user;
    } else if (username) {
      // Get user by username
      const response = await getUserByUsername(username);
      userData = response.user;
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.displayName,
        pfp: userData.pfp,
        followerCount: userData.followerCount,
        followingCount: userData.followingCount
      }
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
    const username = searchParams.get('username');

    if (!fid && !username) {
      return NextResponse.json(
        { success: false, error: 'FID or username is required' },
        { status: 400 }
      );
    }

    let userData;

    if (fid) {
      const response = await getUserByFid(parseInt(fid));
      userData = response.user;
    } else if (username) {
      const response = await getUserByUsername(username);
      userData = response.user;
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.displayName,
        pfp: userData.pfp,
        followerCount: userData.followerCount,
        followingCount: userData.followingCount
      }
    });

  } catch (error) {
    console.error('Farcaster user lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'User lookup failed' },
      { status: 500 }
    );
  }
} 